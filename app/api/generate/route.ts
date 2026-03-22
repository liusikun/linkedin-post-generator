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
- Make sure the content is culturally appropriate for ${languageName} speakers`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a LinkedIn content expert who can write engaging posts in multiple languages. Always respond in valid JSON format.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ versions: result.versions });

  } catch (error: any) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    );
  }
}
