export interface FormSubmission {
    id: string;
    form: {
        id: string;
        title: string;
        type: string;
        description: string;
    };
    data: Record<string, any>;
    submittedBy?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    documentNumber?: string;
    createdAt: string;
}

