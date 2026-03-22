# AI LinkedIn Post Generator

Generate high-quality LinkedIn posts in 30 seconds. No more writer's block.

## Features

- 🚀 Generate 3 versions of LinkedIn posts in 3 seconds
- 🌍 Multi-language support (English, Chinese, Spanish, French, German, Japanese)
- 🎯 5 style options (Practical Tips, Inspirational, Storytelling, Controversial, Humorous)
- ⭐ Engagement score prediction
- 📋 One-click copy to clipboard
- 🆓 Free to use (5 posts/day)

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- OpenAI GPT-4 Turbo
- Cloudflare Pages

## Local Development

```bash
# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local and add your OPENAI_API_KEY

# Start development server
npm run dev

# Open browser
# http://localhost:3000
```

## Deployment

### Cloudflare Pages

1. Fork this repository
2. Connect GitHub in Cloudflare Dashboard
3. Configure build settings:
   - Build command: `npm run build`
   - Build output directory: `out`
   - Environment variables: `OPENAI_API_KEY`
4. Deploy

## Supported Languages

- 🇺🇸 English
- 🇨🇳 Chinese (中文)
- 🇪🇸 Spanish (Español)
- 🇫🇷 French (Français)
- 🇩🇪 German (Deutsch)
- 🇯🇵 Japanese (日本語)

## License

MIT
