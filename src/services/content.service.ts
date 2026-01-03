import { CONTENT_ENDPOINTS, buildUrl } from '@/config/api.config';

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
    getCourseById: async (id: string): Promise<Course> => {
        try {
            const url = buildUrl(CONTENT_ENDPOINTS.DETAILS).replace(':id', id);
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

    createModule: async (courseId: string, data: { title: string; description?: string }): Promise<any> => {
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

    updateModule: async (id: string, data: { title: string; description?: string }): Promise<any> => {
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

    createLesson: async (moduleId: string, data: { title: string; content?: string }): Promise<any> => {
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
};
