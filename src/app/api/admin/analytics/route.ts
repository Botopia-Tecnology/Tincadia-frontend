import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const projectId = process.env.POSTHOG_PROJECT_ID;
    const personalApiKey = process.env.POSTHOG_PERSONAL_API_KEY;

    if (!projectId || !personalApiKey) {
        return NextResponse.json(
            { error: 'PostHog credentials not configured' },
            { status: 500 }
        );
    }

    try {
        const queryUrl = `https://us.posthog.com/api/projects/${projectId}/query/`;
        const headers = {
            Authorization: `Bearer ${personalApiKey}`,
            'Content-Type': 'application/json',
        };

        console.log(`[Analytics] Fetching BI Metrics for Project: ${projectId}`);

        // 1. Pageviews Trend
        const pageviewsQuery = {
            kind: "TrendsQuery",
            series: [{ kind: "EventsNode", event: "$pageview", name: "Pageview", math: "total" }],
            interval: "day",
            dateRange: { date_from: "-7d" }
        };

        // 2. Uniques Trend
        const uniquesQuery = {
            kind: "TrendsQuery",
            series: [{ kind: "EventsNode", event: "$pageview", name: "Unique Users", math: "dau" }],
            interval: "day",
            dateRange: { date_from: "-7d" }
        };

        // 3. Top Pages (HogQL) - Path, Visitors, Views
        const topPagesQuery = {
            kind: "HogQLQuery",
            query: "select properties.$pathname as path, count(distinct person_id) as visitors, count() as views from events where event = '$pageview' and timestamp >= now() - interval 7 day group by path order by views desc limit 10"
        };

        // 4. Top Sources (HogQL) - Source, Visitors, Views
        const topSourcesQuery = {
            kind: "HogQLQuery",
            query: "select properties.$referring_domain as source, count(distinct person_id) as visitors, count() as views from events where event = '$pageview' and timestamp >= now() - interval 7 day group by source order by views desc limit 10"
        };

        // 5. Session Stats (HogQL on sessions table)
        const sessionsQuery = {
            kind: "HogQLQuery",
            query: "select avg(dateDiff('second', start_timestamp, end_timestamp)) as avg_duration, countIf(pageview_count = 1) / count() as bounce_rate, count() as session_count from sessions where start_timestamp >= now() - interval 7 day"
        };

        // 5b. Robust Session Count (from events)
        const sessionCountQuery = {
            kind: "HogQLQuery",
            query: "select count(distinct properties.$session_id) as count from events where event = '$pageview' and timestamp >= now() - interval 7 day"
        };

        // 6. Device Breakdown (Type, Visitors, Views)
        const deviceQuery = {
            kind: "HogQLQuery",
            query: "select properties.$device_type as device, count(distinct person_id) as visitors, count() as views from events where event = '$pageview' and timestamp >= now() - interval 7 day group by device order by views desc limit 5"
        };

        // 7. Geo Breakdown
        const geoQuery = {
            kind: "HogQLQuery",
            query: "select properties.$geoip_country_name as country, count() as count from events where event = '$pageview' and timestamp >= now() - interval 7 day group by country order by count desc limit 5"
        };

        const [pvRes, uvRes, pagesRes, sourcesRes, sessionsRes, sessionCountRes, deviceRes, geoRes] = await Promise.all([
            fetch(queryUrl, { method: 'POST', headers, body: JSON.stringify({ query: pageviewsQuery }) }),
            fetch(queryUrl, { method: 'POST', headers, body: JSON.stringify({ query: uniquesQuery }) }),
            fetch(queryUrl, { method: 'POST', headers, body: JSON.stringify({ query: topPagesQuery }) }),
            fetch(queryUrl, { method: 'POST', headers, body: JSON.stringify({ query: topSourcesQuery }) }),
            fetch(queryUrl, { method: 'POST', headers, body: JSON.stringify({ query: sessionsQuery }) }),
            fetch(queryUrl, { method: 'POST', headers, body: JSON.stringify({ query: sessionCountQuery }) }),
            fetch(queryUrl, { method: 'POST', headers, body: JSON.stringify({ query: deviceQuery }) }),
            fetch(queryUrl, { method: 'POST', headers, body: JSON.stringify({ query: geoQuery }) }),
        ]);

        const debugInfo: any = { method: 'BI HogQL Suite', projectId };
        const results: any = {};

        // Helper to process response
        const process = async (res: Response, key: string) => {
            if (!res.ok) {
                const txt = await res.text();
                // console.error(`[Analytics] ${key} Failed: ${txt}`);
                debugInfo[key] = `Err ${res.status}`;
                return null;
            }
            debugInfo[key] = 'OK';
            return res.json();
        };

        const pvData = await process(pvRes, 'pageviews');
        const uvData = await process(uvRes, 'uniques');
        const pagesData = await process(pagesRes, 'pages');
        const sourcesData = await process(sourcesRes, 'sources');
        const sessionsData = await process(sessionsRes, 'sessions');
        const sessionCountData = await process(sessionCountRes, 'sessionCount');
        const deviceData = await process(deviceRes, 'devices');
        const geoData = await process(geoRes, 'geo');

        // Format Data
        results.pageviews = {
            total: pvData?.results?.[0]?.count || pvData?.results?.[0]?.data?.reduce((a: number, b: number) => a + b, 0) || 0,
            chart: pvData?.results?.[0]?.data?.map((v: number, i: number) => ({ label: pvData.results[0].labels[i], value: v })) || []
        };
        results.uniques = {
            total: uvData?.results?.[0]?.count || uvData?.results?.[0]?.data?.reduce((a: number, b: number) => a + b, 0) || 0
        };

        results.topPages = pagesData?.results?.map((r: any) => ({ path: r[0], visitors: r[1], views: r[2] })) || [];
        results.topSources = sourcesData?.results?.map((r: any) => ({ source: r[0] || 'Direct / Unknown', visitors: r[1], views: r[2] })) || [];

        // Prioritize robust event-based count if sessions table is empty
        const scFromEvents = sessionCountData?.results?.[0]?.[0] || 0;
        const scFromTable = sessionsData?.results?.[0]?.[2] || 0;

        results.sessionStats = {
            avgDuration: Math.round(sessionsData?.results?.[0]?.[0] || 0), // seconds
            bounceRate: Math.round((sessionsData?.results?.[0]?.[1] || 0) * 100), // percentage
            count: scFromTable > 0 ? scFromTable : scFromEvents
        };

        results.devices = deviceData?.results?.map((r: any) => ({ name: r[0] || 'Unknown', visitors: r[1], views: r[2] })) || [];
        results.geo = geoData?.results?.map((r: any) => ({ country: r[0] || 'Unknown', count: r[1] })) || [];

        return NextResponse.json({ ...results, debug: debugInfo });

    } catch (error: any) {
        console.error('Analytics BI Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch BI analytics', details: error.message },
            { status: 500 }
        );
    }
}
