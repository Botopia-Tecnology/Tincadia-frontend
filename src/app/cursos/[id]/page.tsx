'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { contentService, Course } from '@/services/content.service';
import { paymentsService } from '@/services/payments.service';
import { useAuth } from '@/contexts/AuthContext';
import { useUI } from '@/contexts/UIContext';
import { Loader2 } from 'lucide-react';
import { CourseLandingView } from './CourseLandingView';
import { CoursePlayerView } from './CoursePlayerView';

export default function CoursePlayerPage() {
    const params = useParams();
    const courseId = params.id as string;
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { setIsRegistrationPanelOpen } = useUI();

    // State
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

    const checkAccess = useCallback(async (courseData: Course) => {
        // If course is not paid, anyone has access
        if (!courseData.isPaid) return true;

        // If not authenticated and course is paid, no access
        if (!isAuthenticated || !user) return false;

        // Admins always have access
        if (user.role === 'Admin') return true;

        try {
            // Check real subscription status from backend
            const status = await paymentsService.getSubscriptionStatus(user.id);
            setSubscriptionStatus(status);
            
            // Check if user has an active personal or corporate plan
            if (status.hasSubscription && (status.planType?.includes('premium') || status.planType?.includes('corporate') || status.planType?.includes('business'))) {
                return true;
            }

            // TODO: Also check if user bought THIS specific course (if we implement individual course purchases)
            // if (user.purchasedCourses?.includes(courseId)) return true;

            return false;
        } catch (error) {
            console.error('Error checking subscription status:', error);
            return false;
        }
    }, [isAuthenticated, user]);

    const fetchCourseData = useCallback(async () => {
        try {
            setLoading(true);
            
            // Initial fetch to get course metadata (isPaid, description, etc)
            const initialData = await contentService.getCourseById(courseId);
            
            // Check if user should have full access
            const access = await checkAccess(initialData);
            setHasAccess(access);

            // Fetch again with hasAccess=true if they have it, to get unmasked video URLs
            if (access) {
                const fullData = await contentService.getCourseById(courseId, { hasAccess: true });
                setCourse(fullData);
            } else {
                setCourse(initialData);
            }
        } catch (error) {
            console.error('Failed to load course', error);
        } finally {
            setLoading(false);
        }
    }, [courseId, checkAccess]);

    useEffect(() => {
        if (courseId && !authLoading) {
            fetchCourseData();
        }
    }, [courseId, authLoading, fetchCourseData]);

    const handleBuy = () => {
        if (!isAuthenticated) {
            setIsRegistrationPanelOpen(true);
        } else {
            // Redirect to pricing or start checkout flow
            window.location.href = '/pricing';
        }
    };

    if (loading || authLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-[#83A98A]" size={48} />
        </div>
    );

    if (!course) return (
        <div className="p-10 text-center py-20 bg-slate-50 min-h-screen">
            <h2 className="text-xl font-bold text-slate-800">Curso no encontrado</h2>
            <Link href="/cursos" className="text-indigo-600 hover:underline mt-4 inline-block">
                Volver al catálogo
            </Link>
        </div>
    );

    // If no access, show the beautiful Landing View (Presentation)
    if (!hasAccess) {
        return (
            <CourseLandingView 
                course={course} 
                onBuy={handleBuy} 
                isAuthenticated={isAuthenticated} 
            />
        );
    }

    // If has access, show the Player View
    return <CoursePlayerView course={course} />;
}
