import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

function getClient() {
  const privateKey = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, "\n");
  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: process.env.GA4_CLIENT_EMAIL,
      private_key: privateKey,
    },
  });
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId || !process.env.GA4_CLIENT_EMAIL || !process.env.GA4_PRIVATE_KEY) {
    return NextResponse.json({ error: "GA4 not configured" }, { status: 500 });
  }

  try {
    const client = getClient();

    const [overviewResponse, sourceResponse, deviceResponse, pageResponse] = await Promise.all([
      // Overview: users, sessions, pageviews, bounce rate, avg session duration
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "bounceRate" },
          { name: "averageSessionDuration" },
          { name: "newUsers" },
        ],
      }),
      // Traffic sources
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 8,
      }),
      // Devices
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "sessions" }],
      }),
      // Top pages
      client.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 5,
      }),
    ]);

    const overview = overviewResponse[0].rows?.[0]?.metricValues ?? [];
    const sources = (sourceResponse[0].rows ?? []).map((r) => ({
      source: r.dimensionValues?.[0]?.value ?? "",
      sessions: parseInt(r.metricValues?.[0]?.value ?? "0"),
    }));
    const devices = (deviceResponse[0].rows ?? []).map((r) => ({
      device: r.dimensionValues?.[0]?.value ?? "",
      sessions: parseInt(r.metricValues?.[0]?.value ?? "0"),
    }));
    const pages = (pageResponse[0].rows ?? []).map((r) => ({
      path: r.dimensionValues?.[0]?.value ?? "",
      views: parseInt(r.metricValues?.[0]?.value ?? "0"),
    }));

    return NextResponse.json({
      overview: {
        activeUsers: parseInt(overview[0]?.value ?? "0"),
        sessions: parseInt(overview[1]?.value ?? "0"),
        pageViews: parseInt(overview[2]?.value ?? "0"),
        bounceRate: parseFloat(overview[3]?.value ?? "0"),
        avgSessionDuration: parseFloat(overview[4]?.value ?? "0"),
        newUsers: parseInt(overview[5]?.value ?? "0"),
      },
      sources,
      devices,
      pages,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
