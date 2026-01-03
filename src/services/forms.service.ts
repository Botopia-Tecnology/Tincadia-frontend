import { api } from '@/lib/api-client';
import { FORMS_ENDPOINTS, API_BASE_URL } from '@/config/api.config';

export interface FormDefinition {
    id: string;
    title: string;
    description: string;
    type: string;
    fields: any[];
    [key: string]: any;
}

export interface FormSubmissionResponse {
    message: string;
    submission: any;
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
    async submitForm(formId: string, data: any, submittedBy?: string): Promise<FormSubmissionResponse> {
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
    }
};

export default formsService;
