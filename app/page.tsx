'use client';

import { useState, useEffect } from 'react';
import { Loader2, Copy, Check, Star, Globe } from 'lucide-react';

const STYLES = [
  { value: 'practical', label: 'Practical Tips' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'storytelling', label: 'Storytelling' },
  { value: 'controversial', label: 'Controversial' },
  { value: 'humorous', label: 'Humorous' },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ja', label: '日本語' },
];

interface PostVersion {
  type: string;
  content: string;
  interactionScore: number;
  suggestions: string[];
}

export default function Home() {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('practical');
  const [language, setLanguage] = useState('en');
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
      alert('Daily limit reached. Come back tomorrow! 😊');
      return;
    }

    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, style, language }),
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
      alert(error.message || 'Generation failed. Please try again.');
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
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI LinkedIn Post Generator
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Generate high-quality LinkedIn posts in 30 seconds
          </p>
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Daily Remaining: {5 - usageCount}/5 posts
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-lg font-semibold text-gray-900 mb-2">
                Enter Your Topic or Idea
              </label>
              <textarea
                id="topic"
                placeholder="Example: I learned how to use AI to boost my productivity"
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
                <Globe className="inline-block w-5 h-5 mr-2" />
                Output Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {LANGUAGES.map((lang) => (
                  <label
                    key={lang.value}
                    className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      language === lang.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="language"
                      value={lang.value}
                      checked={language === lang.value}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="sr-only"
                    />
                    <span>{lang.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Choose Style
              </label>
              <div className="space-y-2">
                {STYLES.map((s) => (
                  <label
                    key={s.value}
                    className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      style === s.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="style"
                      value={s.value}
                      checked={style === s.value}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-900 font-medium">{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || usageCount >= 5}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                '✨ Generate Posts'
              )}
            </button>
          </div>

          {/* Right: Output */}
          <div>
            {versions.length > 0 ? (
              <div className="space-y-4">
                {versions.map((version, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{version.type}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-500 mr-2">Engagement Score:</span>
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

                    <div className="bg-gray-50 p-4 rounded-lg mb-4 whitespace-pre-wrap text-gray-800 leading-relaxed">
                      {version.content}
                    </div>

                    {version.suggestions && version.suggestions.length > 0 && (
                      <details className="mb-4">
                        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900 font-medium">
                          💡 Optimization Tips
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
                          <Check className="mr-2 h-4 w-4 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy to Clipboard
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-lg">Generated posts will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Powered by OpenAI GPT-4 | Deployed on Cloudflare Pages</p>
          <p className="mt-2">
            <a href="https://github.com/liusikun/linkedin-post-generator" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              View on GitHub
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
