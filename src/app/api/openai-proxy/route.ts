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
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OpenAI API key not found in environment variables');
    return NextResponse.json(
      { error: 'OpenAI API key not configured' }, 
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const body = await request.json();
    console.log('Making request to OpenAI with body:', JSON.stringify(body, null, 2));
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('OpenAI response status:', response.status);
    console.log('OpenAI response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('OpenAI API error:', data);
      return NextResponse.json(
        { error: 'OpenAI API error', details: data }, 
        { status: response.status, headers: corsHeaders }
      );
    }

    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    return NextResponse.json(
      {
        error: 'Error communicating with OpenAI',
        details: error instanceof Error ? error.message : 'Unknown error',
      }, 
      { status: 500, headers: corsHeaders }
    );
  }
}