'use client';

import { useState, useEffect } from 'react';
import { Loader2, Copy, Check, Star, Globe, Sparkles, TrendingUp } from 'lucide-react';

const STYLES = [
  { value: 'practical', label: 'Practical Tips', icon: '💡', desc: 'Actionable advice' },
  { value: 'inspirational', label: 'Inspirational', icon: '✨', desc: 'Motivational story' },
  { value: 'storytelling', label: 'Storytelling', icon: '📖', desc: 'Personal narrative' },
  { value: 'controversial', label: 'Controversial', icon: '🔥', desc: 'Bold opinions' },
  { value: 'humorous', label: 'Humorous', icon: '😄', desc: 'Light & funny' },
];

const LANGUAGES = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'zh', label: '中文', flag: '🇨🇳' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
  { value: 'fr', label: 'Français', flag: '🇫🇷' },
  { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { value: 'ja', label: '日本語', flag: '🇯🇵' },
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
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-medium mb-6 shadow-lg">
            <Sparkles className="w-4 h-4" />
            <span>Powered by GPT-4</span>
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            AI LinkedIn Post Generator
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your ideas into engaging LinkedIn posts in seconds. 
            <span className="block mt-2 text-indigo-600 font-semibold">No more writer's block.</span>
          </p>
          
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-gray-700">Daily Remaining:</span>
            <span className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {5 - usageCount}/5
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input */}
          <div className="space-y-6">
            {/* Topic Input */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <label htmlFor="topic" className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                <span className="text-2xl">💭</span>
                <span>What's on your mind?</span>
              </label>
              <textarea
                id="topic"
                placeholder="Example: I learned how to use AI to boost my productivity by 3x..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full min-h-[140px] p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all text-gray-700 placeholder-gray-400"
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  {topic.length}/500 characters
                </p>
                {topic.length > 0 && (
                  <span className="text-xs text-green-600 font-medium">✓ Looking good!</span>
                )}
              </div>
            </div>

            {/* Language Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <Globe className="w-5 h-5 text-indigo-600" />
                <span>Output Language</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => setLanguage(lang.value)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      language === lang.value
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md scale-105'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-3xl mb-1">{lang.flag}</div>
                    <div className={`text-sm font-medium ${
                      language === lang.value ? 'text-indigo-700' : 'text-gray-700'
                    }`}>
                      {lang.label}
                    </div>
                    {language === lang.value && (
                      <div className="absolute top-2 right-2">
                        <Check className="w-4 h-4 text-indigo-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <span className="text-2xl">🎨</span>
                <span>Choose Your Style</span>
              </label>
              <div className="space-y-3">
                {STYLES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                      style === s.value
                        ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-3xl">{s.icon}</span>
                    <div className="flex-1 text-left">
                      <div className={`font-semibold ${
                        style === s.value ? 'text-indigo-700' : 'text-gray-900'
                      }`}>
                        {s.label}
                      </div>
                      <div className="text-sm text-gray-500">{s.desc}</div>
                    </div>
                    {style === s.value && (
                      <Check className="w-5 h-5 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || usageCount >= 5 || !topic.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-2xl hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="mr-3 h-6 w-6" />
                  Generate Posts
                </>
              )}
            </button>
          </div>

          {/* Right: Output */}
          <div className="lg:sticky lg:top-8 h-fit">
            {versions.length > 0 ? (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Posts Are Ready! 🎉</h2>
                  <p className="text-gray-600">Pick your favorite and share it on LinkedIn</p>
                </div>
                
                {versions.map((version, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 hover:shadow-indigo-200 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm font-semibold">
                            Version {index + 1}
                          </span>
                          <span className="text-gray-600 font-medium">{version.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Engagement Score:</span>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.round(version.interactionScore)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-200 text-gray-200'
                                }`}
                              />
                            ))}
                            <span className="ml-2 font-bold text-indigo-600">
                              {version.interactionScore.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 p-5 rounded-xl mb-4 border border-gray-100">
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {version.content}
                      </div>
                    </div>

                    {version.suggestions && version.suggestions.length > 0 && (
                      <details className="mb-4 group">
                        <summary className="cursor-pointer text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2">
                          <span>💡</span>
                          <span>Optimization Tips</span>
                          <span className="text-xs text-gray-400 group-open:hidden">(click to expand)</span>
                        </summary>
                        <ul className="mt-3 space-y-2 text-sm text-gray-600 bg-indigo-50/50 p-4 rounded-lg">
                          {version.suggestions.map((suggestion, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-indigo-500 mt-0.5">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}

                    <button
                      onClick={() => handleCopy(version.content, index)}
                      className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-indigo-100 hover:to-purple-100 text-gray-900 hover:text-indigo-700 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200 hover:border-indigo-300"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="h-5 w-5 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-5 w-5" />
                          <span>Copy to Clipboard</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-12 border-2 border-dashed border-gray-200 text-center">
                <div className="text-8xl mb-6 animate-bounce">✨</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Create?</h3>
                <p className="text-gray-600 mb-6">
                  Enter your topic, choose a style, and let AI work its magic!
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Fast</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-1000"></span>
                    <span>Smart</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-2000"></span>
                    <span>Engaging</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Powered by OpenAI GPT-4
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-500" />
              Deployed on Cloudflare
            </span>
            <span>•</span>
            <a 
              href="https://github.com/liusikun/linkedin-post-generator" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </main>
  );
}
