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
    // Enhanced JSON parsing with error handling
    let body;
    try {
      const rawBody = await request.text();
      console.log('Raw request body received:', rawBody.substring(0, 200) + '...');
      
      if (!rawBody || rawBody.trim() === '') {
        console.error('Empty request body received');
        return NextResponse.json({ 
          error: 'Request body is empty. Please provide valid JSON payload.'
        }, { status: 400, headers: corsHeaders });
      }
      
      body = JSON.parse(rawBody);
      console.log('Successfully parsed JSON body');
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return NextResponse.json({ 
        error: 'Invalid JSON in request body. Please check your request format.',
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      }, { status: 400, headers: corsHeaders });
    }

    // Validate required fields
    if (!body.contents || !Array.isArray(body.contents)) {
      console.error('Invalid request structure - missing or invalid contents array');
      return NextResponse.json({ 
        error: 'Invalid request structure. Expected "contents" array in request body.'
      }, { status: 400, headers: corsHeaders });
    }

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

    // Enhanced response handling with better error checking
    let data;
    try {
      const responseText = await response.text();
      console.log('Gemini API response status:', response.status);
      console.log('Raw Gemini API response:', responseText.substring(0, 500) + '...');
      
      if (!responseText || responseText.trim() === '') {
        console.error('Empty response from Gemini API');
        return NextResponse.json({
          error: 'Empty response received from Gemini API'
        }, { status: 502, headers: corsHeaders });
      }
      
      data = JSON.parse(responseText);
      console.log('Successfully parsed Gemini response');
    } catch (parseError) {
      console.error('Failed to parse Gemini API response:', parseError);
      return NextResponse.json({
        error: 'Invalid JSON response from Gemini API',
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      }, { status: 502, headers: corsHeaders });
    }

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
    
    // Enhanced error details for debugging
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('Full error details:', {
      message: errorMessage,
      stack: errorStack,
      type: typeof error,
      name: error instanceof Error ? error.name : 'Unknown'
    });
    
    return NextResponse.json(
      {
        error: 'Error communicating with Gemini API',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500, headers: corsHeaders }
    );
  }
}