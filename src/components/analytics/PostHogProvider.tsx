'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
        const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

        if (key && host) {
            posthog.init(key, {
                api_host: host,
                person_profiles: 'identified_only',
                capture_pageview: false, // We'll capture manually for SPA
                capture_pageleave: true,
                loaded: (posthog) => {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('✅ PostHog initialized');
                    }
                }
            });
        } else {
            console.warn('⚠️ PostHog keys not found in environment variables');
        }
    }, []);

    return <PHProvider client={posthog}>{children}</PHProvider>;
}

export default PostHogProvider;
