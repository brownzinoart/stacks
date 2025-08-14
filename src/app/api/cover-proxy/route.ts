/**
 * Book Cover Proxy API Route
 * Proxies book cover images to avoid CORS issues
 */

import { NextRequest, NextResponse } from 'next/server';

// Use force-static for export, but runtime will be ignored since Capacitor uses live server
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    // Validate that the URL is from an allowed domain
    const allowedDomains = [
      'books.google.com',
      'googleusercontent.com',
      'googleapis.com',
      'covers.openlibrary.org',
      'archive.org'
    ];

    const urlObj = new URL(imageUrl);
    const isAllowed = allowedDomains.some(domain => urlObj.hostname.includes(domain));

    if (!isAllowed) {
      return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
    }

    // Fetch the image
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Stacks-BookApp/1.0',
        'Accept': 'image/*',
      },
    });

    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: imageResponse.status });
    }

    const contentType = imageResponse.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      return NextResponse.json({ error: 'Not an image' }, { status: 400 });
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    });
  } catch (error) {
    console.error('Cover proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}