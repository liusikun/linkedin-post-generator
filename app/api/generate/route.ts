import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { topic, style } = await req.json();

    if (!topic || !style) {
      return NextResponse.json(
        { error: 'Topic and style are required' },
        { status: 400 }
      );
    }

    const prompt = `你是一个LinkedIn内容专家。用户想要发布一条关于"${topic}"的帖子，风格是"${style}"。

请生成3个版本的LinkedIn帖子，每个版本都要：
1. 开头吸引人（钩子、痛点、故事、争议观点）
2. 结构清晰（短句、换行、数字、列表）
3. 适量使用emoji（不超过8个）
4. 结尾引导互动（提问、邀请评论）
5. 长度150-300字

版本1：钩子开头 + 列表式（最稳妥）
版本2：故事型（更有温度）
版本3：争议型（高互动但有风险）

请以JSON格式返回，格式如下：
{
  "versions": [
    {
      "type": "钩子+列表",
      "content": "帖子内容...",
      "interactionScore": 8.5,
      "suggestions": ["建议1", "建议2"]
    },
    {
      "type": "故事型",
      "content": "帖子内容...",
      "interactionScore": 9.2,
      "suggestions": ["建议1", "建议2"]
    },
    {
      "type": "争议型",
      "content": "帖子内容...",
      "interactionScore": 9.8,
      "suggestions": ["建议1", "建议2"]
    }
  ]
}`;

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
            content: '你是一个LinkedIn内容专家，擅长创作高互动率的帖子。'
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
    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json({ versions: result.versions });

  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    );
  }
}
