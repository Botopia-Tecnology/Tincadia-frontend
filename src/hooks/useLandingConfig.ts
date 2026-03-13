'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api-client';
import { LandingConfigItem, Testimonial, FAQ } from '@/app/admin/landing/types';

const EXCLUDED_KEYS = ['appstore_icon', 'playstore_icon', 'download_image_1', 'download_image_2'];
const HOW_TO_START_KEYS = ['how_to_start_step_1', 'how_to_start_step_2', 'how_to_start_step_3', 'how_to_start_step_4'];
const QR_KEYS = ['qr_code_appstore', 'qr_code_generic'];
const SERVICE_KEYS = ['service_1_bg', 'service_2_bg', 'service_3_bg'];
const MAP_KEYS = ['world_map_dark', 'world_map_light'];

export function useLandingConfig() {
    const [configs, setConfigs] = useState<LandingConfigItem[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('alianzas');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [configRes, testimonialRes, faqRes] = await Promise.all([
                api.get('/content/landing'),
                api.get('/content/testimonials'),
                api.get('/content/faqs'),
            ]);
            setConfigs(configRes || []);
            setTestimonials(testimonialRes || []);
            setFaqs(faqRes || []);
        } catch (error) {
            console.error('Error fetching landing data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSaveConfig = async (item: LandingConfigItem) => {
        setSaving(item.key);
        try {
            await api.post('/content/landing', {
                key: item.key,
                value: item.value,
                description: item.description,
            });
            await fetchData();
        } catch (error) {
            console.error('Error saving config:', error);
        } finally {
            setSaving(null);
        }
    };

    const handleDeleteAlliance = async (key: string) => {
        try {
            await api.delete(`/content/landing/${key}`);
            await fetchData();
        } catch (error) {
            console.error('Error deleting alliance:', error);
        }
    };

    const handleCreateAlliance = async (key: string, value: string, description: string) => {
        try {
            await api.post('/content/landing', { key, value, description });
            await fetchData();
        } catch (error) {
            console.error('Error creating alliance:', error);
        }
    };

    const categorizeConfigs = useCallback(() => {
        const filtered = configs.filter(c => !EXCLUDED_KEYS.includes(c.key) && !c.key.includes('_hover'));
        return {
            alianzas: filtered.filter(c => c.key.startsWith('logo_') || c.key.startsWith('alliance_')),
            how_to_start: filtered.filter(c => HOW_TO_START_KEYS.includes(c.key)),
            qrs: filtered.filter(c => QR_KEYS.includes(c.key)),
            servicios: filtered.filter(c => SERVICE_KEYS.includes(c.key)),
            mapas: filtered.filter(c => MAP_KEYS.includes(c.key)),
            inclusive: filtered.filter(c => c.key === 'inclusive_companies_list'),
            contact_social: filtered.filter(c => c.key === 'contact_email' || c.key === 'contact_phone' || c.key === 'social_links'),
            otros: filtered.filter(c =>
                !c.key.startsWith('logo_') &&
                !c.key.startsWith('alliance_') &&
                !HOW_TO_START_KEYS.includes(c.key) &&
                !QR_KEYS.includes(c.key) &&
                !SERVICE_KEYS.includes(c.key) &&
                !MAP_KEYS.includes(c.key) &&
                c.key !== 'inclusive_companies_list' &&
                c.key !== 'contact_email' &&
                c.key !== 'contact_phone' &&
                c.key !== 'social_links'
            ),
        };
    }, [configs]);

    return {
        configs,
        testimonials,
        faqs,
        loading,
        saving,
        activeTab,
        setActiveTab,
        handleSaveConfig,
        handleDeleteAlliance,
        handleCreateAlliance,
        categorizeConfigs,
        refresh: fetchData,
    };
}
