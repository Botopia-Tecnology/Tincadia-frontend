import React from 'react';

export function PricingSkeleton() {
    return (
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-3/4 mb-4" />
            <div className="h-12 bg-gray-700 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-700 rounded w-full mb-6" />
            <div className="h-12 bg-gray-700 rounded w-full mb-8" />
            <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-700 rounded w-5/6" />
                <div className="h-4 bg-gray-700 rounded w-4/6" />
            </div>
        </div>
    );
}
