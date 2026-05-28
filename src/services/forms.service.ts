import { api } from '@/lib/api-client';
import { FORMS_ENDPOINTS, API_BASE_URL } from '@/config/api.config';

export interface FormField {
    id: string;
    type: string;
    label: string;
    required?: boolean;
    options?: string[];
    [key: string]: unknown;
}

export interface FormSubmission {
    id: string;
    formId: string;
    data: Record<string, unknown>;
    submittedBy?: string;
    createdAt?: string;
    status?: string;
    [key: string]: unknown;
}

export interface FormDefinition {
    id: string;
    title: string;
    description: string;
    type: string;
    fields: FormField[];
    [key: string]: unknown;
}

export interface FormSubmissionResponse {
    message: string;
    submission: FormSubmission;
    userStatus: 'registered' | 'not_registered' | 'unknown';
    action: 'redirect_to_register' | 'none';
}

export interface FileUploadResponse {
    url: string;
    path: string;
}

export const formsService = {
    /**
     * Find form definition by type
     * 
     * @param type - The unique type string of the form
     */
    async findFormByType(type: string): Promise<FormDefinition> {
        return api.get<FormDefinition>(`${FORMS_ENDPOINTS.FIND_BY_TYPE}/${type}`);
    },

    /**
     * Submit form data
     * 
     * @param formId - The ID of the form being submitted
     * @param data - The form data object
     * @param submittedBy - Optional user ID if authenticated
     */
    async submitForm(formId: string, data: Record<string, unknown>, submittedBy?: string): Promise<FormSubmissionResponse> {
        console.log('📤 [Forms Service] Calling submitForm API:', {
            endpoint: FORMS_ENDPOINTS.SUBMIT,
            formId,
            hasData: !!data,
            submittedBy,
        });

        try {
            const response = await api.post<FormSubmissionResponse>(FORMS_ENDPOINTS.SUBMIT, {
                formId,
                data,
                submittedBy,
            });

            console.log('✅ [Forms Service] Form submitted successfully:', response);
            return response;
        } catch (error) {
            console.error('❌ [Forms Service] Error submitting form:', error);
            throw error;
        }
    },

    /**
     * Upload a file to Supabase Storage
     * 
     * @param file - The file to upload
     * @returns The public URL and path of the uploaded file
     */
    async uploadFile(file: File): Promise<FileUploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/forms/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to upload file');
        }

        return response.json();
    },

    /**
     * Get applications submitted by the current user
     * 
     * @param userId - The user ID
     */
    async getMyApplications(userId: string, email?: string, documentNumber?: string): Promise<FormSubmission[]> {
        const params: Record<string, string> = { userId };
        if (email) params.email = email;
        if (documentNumber) params.documentNumber = documentNumber;

        const queryString = new URLSearchParams(params).toString();
        return api.get<FormSubmission[]>(`/forms/my-applications?${queryString}`);
    },

    /**
     * Update an existing submission
     */
    async updateSubmission(id: string, data: Record<string, unknown>): Promise<FormSubmission> {
        return api.put(`/forms/submissions/${id}`, { data });
    },

    /**
     * Delete a submission
     */
    async deleteSubmission(id: string): Promise<void> {
        return api.delete(`/forms/submissions/${id}`);
    },

    /**
     * Get all submissions (Admin)
     */
    async getAllSubmissions(): Promise<FormSubmission[]> {
        return api.get<FormSubmission[]>('/forms/submissions');
    }
};

export default formsService;
