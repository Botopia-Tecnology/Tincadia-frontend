import { useState, useEffect } from 'react';
import { FormSubmission } from '../types';
import { formsService } from '@/services/forms.service';

export function useFormSubmissions() {
    const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubmissions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await formsService.getAllSubmissions();
            setSubmissions(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading submissions');
            setSubmissions([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteSubmission = async (id: string) => {
        try {
            await formsService.deleteSubmission(id);
            setSubmissions(prev => prev.filter(s => s.id !== id));
            return true;
        } catch (err) {
            console.error('Error deleting submission:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    return {
        submissions,
        loading,
        error,
        refetch: fetchSubmissions,
        deleteSubmission,
    };
}

