import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  zh: 'Chinese',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ja: 'Japanese',
};

const STYLE_NAMES: Record<string, string> = {
  practical: 'Practical Tips',
  inspirational: 'Inspirational',
  storytelling: 'Storytelling',
  controversial: 'Controversial',
  humorous: 'Humorous',
};

export async function POST(req: NextRequest) {
  try {
    const { topic, style, language = 'en' } = await req.json();

    if (!topic || !style) {
      return NextResponse.json(
        { error: 'Topic and style are required' },
        { status: 400 }
      );
    }

    const languageName = LANGUAGE_NAMES[language] || 'English';
    const styleName = STYLE_NAMES[style] || style;

    const prompt = `You are a LinkedIn content expert. The user wants to create a post about "${topic}" in ${styleName} style.

Please generate 3 versions of LinkedIn posts in ${languageName}, each version should:
1. Have an attention-grabbing opening (hook, pain point, story, or controversial statement)
2. Clear structure (short sentences, line breaks, numbers, lists)
3. Use emojis appropriately (no more than 8)
4. End with a call-to-action (question, invite comments)
5. Length: 150-300 words

Version 1: Hook + List format (most reliable)
Version 2: Storytelling format (more engaging)
Version 3: Controversial format (high engagement but risky)

Return in JSON format:
{
  "versions": [
    {
      "type": "Hook + List",
      "content": "post content...",
      "interactionScore": 8.5,
      "suggestions": ["tip 1", "tip 2"]
    },
    {
      "type": "Storytelling",
      "content": "post content...",
      "interactionScore": 9.2,
      "suggestions": ["tip 1", "tip 2"]
    },
    {
      "type": "Controversial",
      "content": "post content...",
      "interactionScore": 9.8,
      "suggestions": ["tip 1", "tip 2"]
    }
  ]
}

IMPORTANT: 
- Generate the entire post content in ${languageName}
- Keep the "type" field in English
- Keep the "suggestions" in English
- Make sure the content is culturally appropriate for ${languageName} speakers
- Return ONLY valid JSON, no markdown formatting`;

    // Use Google Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', data);
      throw new Error(data.error?.message || 'Gemini API error');
    }

    // Extract text from Gemini response
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No content generated');
    }

    // Parse JSON from response (remove markdown code blocks if present)
    let jsonText = generatedText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const result = JSON.parse(jsonText);

    return NextResponse.json({ versions: result.versions });

  } catch (error: any) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    );
  }
}
