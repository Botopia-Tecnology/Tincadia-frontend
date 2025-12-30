import { CONTENT_ENDPOINTS, buildUrl } from '@/config/api.config';

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    categoryId: string;
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
};
