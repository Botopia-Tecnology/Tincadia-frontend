import { api } from '@/lib/api-client';
import { FORMS_ENDPOINTS } from '@/config/api.config';

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
        return api.post<FormSubmissionResponse>(FORMS_ENDPOINTS.SUBMIT, {
            formId,
            data,
            submittedBy,
        });
    }
};

export default formsService;
