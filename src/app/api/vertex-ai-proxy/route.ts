import { NextRequest, NextResponse } from 'next/server';

// CORS headers for mobile app
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    console.error('Google AI API key not found in environment variables');
    return NextResponse.json({ 
      error: 'Google AI API key not configured. Get one free at https://aistudio.google.com/app/apikey'
    }, { status: 500, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    console.log('Making request to Gemini API with body:', JSON.stringify(body, null, 2));

    // Direct Gemini API endpoint (Google AI Studio) - FREE tier with higher limits
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Gemini API response status:', response.status);
    console.log('Gemini API response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('Gemini API error:', data);
      return NextResponse.json(
        { error: 'Gemini API error', details: data },
        { status: response.status, headers: corsHeaders }
      );
    }

    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error) {
    console.error('Error communicating with Gemini API:', error);
    return NextResponse.json(
      {
        error: 'Error communicating with Gemini API',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}