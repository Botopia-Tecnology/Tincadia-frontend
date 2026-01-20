import { NextResponse } from 'next/server';

export async function GET() {
    // In a real app, you should check for a session/cookie here to ensure the user is an admin.
    // For now, we rely on the route protection (middleware or layout logic) if applicable, 
    // or just the fact that it's an internal API. 
    // Ideally, check for 'tincadia_token' or similar if you have server-side auth validation.

    // Return the URL from server-side env
    return NextResponse.json({
        url: process.env.POSTHOG_SHARED_DASHBOARD_URL || null
    });
}
