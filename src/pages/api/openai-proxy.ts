import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OpenAI API key not found in environment variables');
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    console.log('Making request to OpenAI with body:', JSON.stringify(req.body, null, 2));
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log('OpenAI response status:', response.status);
    console.log('OpenAI response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('OpenAI API error:', data);
      return res.status(response.status).json({ error: 'OpenAI API error', details: data });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({
      error: 'Error communicating with OpenAI',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
