'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { contentService, Course } from '@/services/content.service';
import { paymentsService, PaymentPlan } from '@/services/payments.service';
import { authService } from '@/services/auth.service';
import { CoursePlayerView } from './CoursePlayerView';
import { CourseLandingView } from './CourseLandingView';
import { Loader2 } from 'lucide-react';
import { useWompiWidget } from '@/hooks/useWompiWidget';
import { toast } from 'sonner';

export default function CoursePage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    // State
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [checkingAccess, setCheckingAccess] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

    // Wompi Hook
    const { openWidget } = useWompiWidget({
        onSuccess: (result) => {
            toast.success('¡Compra exitosa! Disfruta tu curso.', {
                description: `ID: ${result.transaction.reference}`
            });
            setHasAccess(true);
            router.refresh();
        },
        onError: (error) => {
            console.error('Payment error:', error);
            toast.error('Error en el pago. Inténtalo de nuevo.');
        }
    });

    useEffect(() => {
        if (courseId) {
            loadCourseData();
        }
    }, [courseId]);

    const loadCourseData = async () => {
        try {
            setLoading(true);
            const [courseData, user] = await Promise.all([
                contentService.getCourseById(courseId),
                authService.getCurrentUser().catch(() => null)
            ]);

            setCourse(courseData);
            setCourse(courseData);
            setUserId(user?.id || null);
            setUserEmail(user?.email);

            // Access Logic
            if (!courseData.isPaid) {
                setHasAccess(true); // Free course
            } else if (user) {
                // Check if bought
                const purchased = await paymentsService.checkPurchaseStatus(user.id, courseId, 'COURSE');
                setHasAccess(purchased);
            } else {
                setHasAccess(false); // Paid and not logged in
            }
        } catch (error) {
            console.error('Failed to load course or user', error);
            toast.error('Error cargando el curso');
        } finally {
            setLoading(false);
            setCheckingAccess(false);
        }
    };

    const handleBuy = async () => {
        if (!userId) {
            toast.error('Debes iniciar sesión para comprar');
            router.push(`/auth/login?redirect=/cursos/${courseId}`);
            return;
        }

        if (!course) return;

        try {
            toast.loading('Iniciando pago...');
            const response = await paymentsService.initiatePayment({
                planId: 'course_purchase', // Generic ID for logging
                planType: PaymentPlan.COURSE_ACCESS, // Enum value for course
                billingCycle: 'mensual', // Irrelevant for one-time but required by DTO
                redirectUrl: window.location.href, // Stay here
                userId: userId,
                customerEmail: userEmail || undefined, // Send undefined if empty to avoid validation error
                // Product Interface
                // @ts-ignore - Adding custom props for Course purchase logic we added to backend
                productType: 'COURSE',
                productId: course.id,
                // NOTE: amountInCents is NOT sent - the backend fetches the price from the database
            });

            toast.dismiss();

            // Redirect to Wompi Standard Checkout
            if (response.checkoutUrl) {
                // Append the reference to the redirect URL if strictly needed (Wompi handles this via config, but check logic)
                // Actually the checkoutUrl is the base + reference usually.
                // The widgetConfig contains the integrity signature, but the checkout URL from backend might already include params?
                // Let's check payments.service.ts backend code.
                // It returns this.wompiService.getCheckoutUrl(), which is just the base domain. 
                // Wait, standard checkout usually requires constructing the URL with parameters (reference, publicKey, amount...).

                // Inspecting the backend code again:
                // getCheckoutUrl() returns the base URL (e.g., https://checkout.wompi.co/p/).
                // We need to construct the full URL with query params OR use the widgetConfig data to build it.
                // Actually, the simplest way for standard checkout is often appending `?public-key=...&currency=...` etc.

                // HOWEVER, openWidget uses the script.
                // If the user wants "checkout normal", they might mean the Redirect.
                // To do a redirect checkout with Wompi, you usually GET the checkout URL with parameters.

                const queryParams = new URLSearchParams({
                    'public-key': response.widgetConfig.publicKey,
                    'currency': response.widgetConfig.currency,
                    'amount-in-cents': response.widgetConfig.amountInCents.toString(),
                    'reference': response.widgetConfig.reference,
                    // 'signature:integrity': response.widgetConfig.signatureIntegrity, // Wompi Checkout often calculates this if not provided or strict.
                    'redirect-url': response.widgetConfig.redirectUrl || window.location.href,
                    ...(response.widgetConfig.signatureIntegrity && { 'signature:integrity': response.widgetConfig.signatureIntegrity }),
                    ...(response.widgetConfig.customerData?.email && { 'customer-data:email': response.widgetConfig.customerData.email }),
                    ...(response.widgetConfig.customerData?.fullName && { 'customer-data:full-name': response.widgetConfig.customerData.fullName }),
                    ...(response.widgetConfig.customerData?.phoneNumber && { 'customer-data:phone-number': response.widgetConfig.customerData.phoneNumber }),
                    ...(response.widgetConfig.customerData?.legalId && { 'customer-data:legal-id': response.widgetConfig.customerData.legalId }),
                });

                window.location.href = `${response.checkoutUrl}?${queryParams.toString()}`;
            } else {
                // Fallback to widget if no checkout url (shouldn't happen)
                openWidget(response.widgetConfig);
            }

        } catch (error) {
            toast.dismiss();
            console.error('Buy error:', error);
            toast.error('No se pudo iniciar el pago');
        }
    };

    if (loading || checkingAccess) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-[#83A98A]" size={48} />
            </div>
        );
    }

    if (!course) {
        return <div className="p-10 text-center">Curso no encontrado</div>;
    }

    // Render Logic
    if (hasAccess) {
        return <CoursePlayerView course={course} />;
    }

    return (
        <CourseLandingView
            course={course}
            onBuy={handleBuy}
            isAuthenticated={!!userId}
        />
    );
}
