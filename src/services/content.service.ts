import { CONTENT_ENDPOINTS, buildUrl } from '@/config/api.config';

// ===========================================
// Interfaces
// ===========================================

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    categoryId: string;
    category?: {
        id: string;
        name: string;
    };
    isPublished: boolean;
    accessScope?: 'course' | 'module' | 'lesson';
    isPaid?: boolean;
    previewLimit?: number | null;
    priceInCents?: number;
    learningPoints?: string[];
    modules?: any[];
}

export const contentService = {
    /**
     * Get all courses
     */
    getAllCourses: async (): Promise<Course[]> => {
        try {
            const response = await fetch(buildUrl(CONTENT_ENDPOINTS.COURSES), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add Authorization header if needed in the future
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    },

    /**
     * Get course by ID
     */
    getCourseById: async (id: string, opts?: { hasAccess?: boolean }): Promise<Course> => {
        try {
            const query = opts?.hasAccess ? `?hasAccess=${opts.hasAccess}` : '';
            const url = buildUrl(CONTENT_ENDPOINTS.DETAILS).replace(':id', id) + query;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch course details');
            return await response.json();
        } catch (error) {
            console.error('Error fetching course details:', error);
            throw error;
        }
    },

    /**
     * Create a new course
     */
    createCourse: async (data: Partial<Course>): Promise<Course> => {
        try {
            const response = await fetch(buildUrl(CONTENT_ENDPOINTS.CREATE), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to create course');
            return await response.json();
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    },

    /**
     * Update a course
     */
    updateCourse: async (id: string, data: Partial<Course>): Promise<Course> => {
        try {
            const url = buildUrl(CONTENT_ENDPOINTS.UPDATE).replace(':id', id);
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to update course');
            return await response.json();
        } catch (error) {
            console.error('Error updating course:', error);
            throw error;
        }
    },

    /**
     * Create a new module
     */
    deleteCourse: async (id: string): Promise<void> => {
        const url = buildUrl(CONTENT_ENDPOINTS.DELETE).replace(':id', id);
        await fetch(url, { method: 'DELETE' });
    },

    // --- Module ---

    createModule: async (courseId: string, data: { title: string; description?: string; isPaid?: boolean }): Promise<any> => {
        try {
            const url = buildUrl(CONTENT_ENDPOINTS.CREATE_MODULE).replace(':courseId', courseId);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create module');
            return await response.json();
        } catch (error) {
            console.error('Error creating module:', error);
            throw error;
        }
    },

    updateModule: async (id: string, data: { title?: string; description?: string; isPaid?: boolean }): Promise<any> => {
        const url = buildUrl(CONTENT_ENDPOINTS.UPDATE_MODULE).replace(':id', id);
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update module');
        return await response.json();
    },

    deleteModule: async (id: string): Promise<void> => {
        const url = buildUrl(CONTENT_ENDPOINTS.DELETE_MODULE).replace(':id', id);
        await fetch(url, { method: 'DELETE' });
    },

    // --- Lesson ---

    createLesson: async (moduleId: string, data: { title: string; content?: string; isPaid?: boolean; isFreePreview?: boolean }): Promise<any> => {
        try {
            const url = buildUrl(CONTENT_ENDPOINTS.CREATE_LESSON).replace(':moduleId', moduleId);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('Failed to create lesson');
            return await response.json();
        } catch (error) {
            console.error('Error creating lesson:', error);
            throw error;
        }
    },

    updateLesson: async (id: string, data: any): Promise<any> => {
        const url = buildUrl(CONTENT_ENDPOINTS.UPDATE_LESSON).replace(':id', id);
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update lesson');
        return await response.json();
    },

    deleteLesson: async (id: string): Promise<void> => {
        const url = buildUrl(CONTENT_ENDPOINTS.DELETE_LESSON).replace(':id', id);
        await fetch(url, { method: 'DELETE' });
    },

    removeLessonVideo: async (id: string): Promise<void> => {
        const url = buildUrl(CONTENT_ENDPOINTS.REMOVE_VIDEO).replace(':id', id);
        await fetch(url, { method: 'DELETE' });
    },

    // --- Category ---

    getCategories: async (): Promise<{ id: string; name: string }[]> => {
        try {
            const response = await fetch(buildUrl(CONTENT_ENDPOINTS.CATEGORIES));
            if (!response.ok) throw new Error('Failed to fetch categories');
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    createCategory: async (name: string): Promise<any> => {
        try {
            const response = await fetch(buildUrl(CONTENT_ENDPOINTS.CREATE_CATEGORY), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            if (!response.ok) throw new Error('Failed to create category');
            return await response.json();
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    updateCategory: async (id: string, name: string): Promise<any> => {
        const url = buildUrl(CONTENT_ENDPOINTS.UPDATE_CATEGORY).replace(':id', id);
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) throw new Error('Failed to update category');
        return await response.json();
    },

    deleteCategory: async (id: string): Promise<void> => {
        const url = buildUrl(CONTENT_ENDPOINTS.DELETE_CATEGORY).replace(':id', id);
        await fetch(url, { method: 'DELETE' });
    },

    uploadThumbnail: async (courseId: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('thumbnail', file);

            const url = buildUrl(CONTENT_ENDPOINTS.UPLOAD_THUMBNAIL).replace(':courseId', courseId);
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload thumbnail');
            return await response.json();
        } catch (error) {
            console.error('Error uploading thumbnail:', error);
            throw error;
        }
    },

    uploadLessonVideo: async (lessonId: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('video', file);

            const url = buildUrl(CONTENT_ENDPOINTS.UPLOAD_LESSON_VIDEO).replace(':lessonId', lessonId);
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload video');
            return await response.json();
        } catch (error) {
            console.error('Error uploading video:', error);
            throw error;
        }
    },

    /**
     * Get landing configuration by key
     */
    getLandingConfig: async (key: string): Promise<string | null> => {
        try {
            // Endpoint needs to be added to api.config.ts first, but assuming pattern
            // Using direct fetch for now or update config file first? 
            // Better to use buildUrl if possible, but let's check api.config.ts first to be clean.
            // Actually, I'll just use the base URL pattern for now to avoid multiple file edits if not strictly necessary, 
            // but for best practice I should use the config. 
            // Let's assume standard path /content/landing-config/:key based on my gateway change.
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/landing-config/${key}`);
            if (!response.ok) return null;
            const data = await response.json();
            return data ? data.value : null;
        } catch (error) {
            console.error(`Error fetching landing config ${key}:`, error);
            return null;
        }
    },
};

// ===========================================
// Pricing Plans Interface & Service
// ===========================================

export interface PricingPlan {
    id: string;
    name: string;
    type: 'personal' | 'empresa';
    plan_type: string;
    price_monthly: string;
    price_annual: string;
    price_monthly_cents: number;
    price_annual_cents: number;
    description: string;
    button_text: string;
    includes: string[];
    excludes: string[];
    is_active: boolean;
    is_free: boolean;
    // Billing interval in months: 1=monthly, 2=bimonthly, 3=quarterly, 6=semiannual, 12=annual
    billing_interval_months?: number;
    order: number;
}

export const pricingService = {
    /**
     * Get all pricing plans
     * @param activeOnly - If true, returns only active plans
     */
    getAll: async (activeOnly: boolean = true): Promise<PricingPlan[]> => {
        try {
            const url = `${buildUrl(CONTENT_ENDPOINTS.PRICING_PLANS)}?activeOnly=${activeOnly}`;

            // Validar que la URL esté bien formada
            if (!url || url.startsWith('undefined') || url.startsWith('null')) {
                throw new Error(`Invalid API URL. Check NEXT_PUBLIC_API_URL environment variable. Current URL: ${url}`);
            }

            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch pricing plans: ${response.status} ${response.statusText}. ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching pricing plans:', error);
            // Re-lanzar con más contexto
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Unknown error fetching pricing plans: ${String(error)}`);
        }
    },

    /**
     * Get a pricing plan by ID
     */
    getById: async (id: string): Promise<PricingPlan> => {
        try {
            const url = buildUrl(CONTENT_ENDPOINTS.PRICING_PLAN_DETAILS).replace(':id', id);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch pricing plan');
            return await response.json();
        } catch (error) {
            console.error('Error fetching pricing plan:', error);
            throw error;
        }
    },

    /**
     * Create a new pricing plan (Admin)
     */
    create: async (data: Omit<PricingPlan, 'id'>): Promise<PricingPlan> => {
        try {
            const response = await fetch(buildUrl(CONTENT_ENDPOINTS.CREATE_PRICING_PLAN), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to create pricing plan');
            }
            return await response.json();
        } catch (error) {
            console.error('Error creating pricing plan:', error);
            throw error;
        }
    },

    /**
     * Update a pricing plan (Admin)
     */
    update: async (id: string, data: Partial<PricingPlan>): Promise<PricingPlan> => {
        try {
            const url = buildUrl(CONTENT_ENDPOINTS.UPDATE_PRICING_PLAN).replace(':id', id);
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update pricing plan');
            }
            return await response.json();
        } catch (error) {
            console.error('Error updating pricing plan:', error);
            throw error;
        }
    },

    /**
     * Delete a pricing plan (Admin)
     */
    delete: async (id: string): Promise<{ deleted: boolean; id: string }> => {
        try {
            const url = buildUrl(CONTENT_ENDPOINTS.DELETE_PRICING_PLAN).replace(':id', id);
            const response = await fetch(url, { method: 'DELETE' });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to delete pricing plan');
            }
            return await response.json();
        } catch (error) {
            console.error('Error deleting pricing plan:', error);
            throw error;
        }
    },
};
