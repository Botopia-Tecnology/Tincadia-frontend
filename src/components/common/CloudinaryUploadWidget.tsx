'use client';

import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';
import { api } from '@/lib/api-client';
import { Upload } from 'lucide-react';

interface CloudinaryUploadWidgetProps {
    onUpload: (url: string) => void;
    folder?: string;
    buttonText?: string;
    currentImage?: string;
    resourceType?: 'image' | 'video' | 'auto';
    allowedFormats?: string[];
}

declare global {
    interface Window {
        cloudinary: any;
    }
}

export function CloudinaryUploadWidget({
    onUpload,
    folder = 'tincadia/landing',
    buttonText = 'Subir Imagen',
    currentImage,
    resourceType = 'image',
    allowedFormats
}: CloudinaryUploadWidgetProps) {
    const [loaded, setLoaded] = useState(false);
    const widgetRef = useRef<any>(null);

    useEffect(() => {
        // Check immediately
        if (window.cloudinary) {
            setLoaded(true);
        }

        // Poll check to handle race conditions where onLoad doesn't fire for all instances
        const interval = setInterval(() => {
            if (window.cloudinary) {
                setLoaded(true);
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const createWidgetInstance = async () => {
        if (!window.cloudinary) return;

        const defaultFormats = resourceType === 'video'
            ? ['mp4', 'mov', 'avi', 'webm']
            : ['image', 'png', 'jpg', 'jpeg', 'webp'];

        return window.cloudinary.createUploadWidget(
            {
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'do1mvhvms',
                apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '382513334875637',
                uploadSignature: async (callback: (signature: string, timestamp: string | number | null, apiKey: string | null) => void, params: any) => {
                    try {
                        const paramsToSign = { ...params, source: 'uw' };
                        const data = await api.get<any>(`/content/cloudinary/signature?${new URLSearchParams(paramsToSign).toString()}`);
                        callback(data.signature, data.timestamp, data.apiKey);
                    } catch (error) {
                        console.error('Error fetching signature:', error);
                    }
                },
                folder: folder,
                sources: ['local', 'url'],
                resourceType: resourceType,
                clientAllowedFormats: allowedFormats || defaultFormats,
                maxImageFileSize: 5000000,
                maxVideoFileSize: 50000000, // 50MB
                styles: {
                    palette: {
                        window: "#0F172A",
                        windowBorder: "#334155",
                        tabIcon: "#3B82F6",
                        menuIcons: "#E2E8F0",
                        textDark: "#000000",
                        textLight: "#FFFFFF",
                        link: "#3B82F6",
                        action: "#3B82F6",
                        inactiveTabIcon: "#CBD5E1",
                        error: "#EF4444",
                        inProgress: "#3B82F6",
                        complete: "#10B981",
                        sourceBg: "#1E293B"
                    },
                }
            },
            (error: any, result: any) => {
                if (!error && result && result.event === "success") {
                    onUpload(result.info.secure_url);
                }
            }
        );
    };

    const openWidget = async () => {
        if (!widgetRef.current) {
            widgetRef.current = await createWidgetInstance();
        }

        if (widgetRef.current) {
            widgetRef.current.open();
        }
    };

    const isVideo = resourceType === 'video' || currentImage?.match(/\.(mp4|webm|mov|avi)$/i);

    return (
        <div className="flex flex-col gap-2">
            <Script
                src="https://upload-widget.cloudinary.com/global/all.js"
                onLoad={() => {
                    setLoaded(true);
                }}
            />

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={openWidget}
                    disabled={!loaded}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
                >
                    <Upload size={16} className="text-blue-400" />
                    {buttonText}
                </button>
                {!loaded && <span className="text-xs text-slate-500">Cargando widget...</span>}
            </div>

            {currentImage && (
                <div className="mt-2 relative w-full h-32 bg-slate-900/50 rounded-lg border border-slate-700/50 overflow-hidden flex items-center justify-center">
                    {isVideo ? (
                        <video
                            src={currentImage}
                            className="h-full object-contain"
                            controls
                        />
                    ) : (
                        <img
                            src={currentImage}
                            alt="Preview"
                            className="h-full object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '';
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
