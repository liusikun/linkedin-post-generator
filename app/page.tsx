'use client';

import { useState, useEffect } from 'react';
import { Loader2, Copy, Check, Star } from 'lucide-react';

const STYLES = [
  { value: '干货型', label: '干货型' },
  { value: '励志型', label: '励志型' },
  { value: '故事型', label: '故事型' },
  { value: '争议型', label: '争议型' },
  { value: '幽默型', label: '幽默型' },
];

interface PostVersion {
  type: string;
  content: string;
  interactionScore: number;
  suggestions: string[];
}

export default function Home() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('干货型');
  const [loading, setLoading] = useState(false);
  const [versions, setVersions] = useState<PostVersion[]>([]);
  const [usageCount, setUsageCount] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const count = parseInt(localStorage.getItem('usage_count') || '0');
    const lastReset = localStorage.getItem('last_reset');
    const today = new Date().toDateString();

    if (lastReset !== today) {
      localStorage.setItem('usage_count', '0');
      localStorage.setItem('last_reset', today);
      setUsageCount(0);
    } else {
      setUsageCount(count);
    }
  }, []);

  const handleGenerate = async () => {
    if (usageCount >= 5) {
      alert('今日额度已用完，明天再来 😊');
      return;
    }

    if (!topic.trim()) {
      alert('请输入话题');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, style }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setVersions(data.versions);

      const newCount = usageCount + 1;
      localStorage.setItem('usage_count', newCount.toString());
      setUsageCount(newCount);

    } catch (error: any) {
      alert(error.message || '生成失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI LinkedIn帖子生成器
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            30秒生成高质量LinkedIn帖子，不再为写什么而头疼
          </p>
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            今日剩余：{5 - usageCount}/5 次
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-lg font-semibold text-gray-900 mb-2">
                输入话题或观点
              </label>
              <textarea
                id="topic"
                placeholder="例如：我今天学会了用AI提高工作效率"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={500}
              />
              <p className="text-sm text-gray-500 mt-1">
                {topic.length}/500
              </p>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                选择风格
              </label>
              <div className="space-y-2">
                {STYLES.map((s) => (
                  <label
                    key={s.value}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="style"
                      value={s.value}
                      checked={style === s.value}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-900">{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || usageCount >= 5}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  生成中...
                </>
              ) : (
                '生成帖子'
              )}
            </button>
          </div>

          {/* Right: Output */}
          <div>
            {versions.length > 0 ? (
              <div className="space-y-4">
                {versions.map((version, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{version.type}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-500 mr-2">预测互动率：</span>
                          <div className="flex items-center">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.round(version.interactionScore)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-2 font-semibold text-gray-900">
                              {version.interactionScore.toFixed(1)}/10
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-4 whitespace-pre-wrap text-gray-800">
                      {version.content}
                    </div>

                    {version.suggestions && version.suggestions.length > 0 && (
                      <details className="mb-4">
                        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                          优化建议
                        </summary>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                          {version.suggestions.map((suggestion, i) => (
                            <li key={i}>• {suggestion}</li>
                          ))}
                        </ul>
                      </details>
                    )}

                    <button
                      onClick={() => handleCopy(version.content, index)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-2 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          复制到剪贴板
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-lg">生成的帖子将显示在这里</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>由 OpenAI GPT-4 驱动 | 部署在 Cloudflare Pages</p>
        </div>
      </div>
    </main>
  );
}
