import { useState, useEffect } from 'react';
import { FormSubmission } from '../types';

export function useFormSubmissions() {
    const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubmissions = async () => {
        setLoading(true);
        setError(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiUrl}/forms/submissions`);
            if (!response.ok) throw new Error('Failed to fetch submissions');
            const data = await response.json();
            setSubmissions(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading submissions');
            setSubmissions([]);
        } finally {
            setLoading(false);
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
    };
}

