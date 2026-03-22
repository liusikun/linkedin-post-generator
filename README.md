# AI LinkedIn帖子生成器

30秒生成高质量LinkedIn帖子，不再为写什么而头疼。

## 功能特点

- 🚀 3秒生成3个版本的LinkedIn帖子
- 🎯 5种风格选择（干货型、励志型、故事型、争议型、幽默型）
- ⭐ 预测互动率评分
- 📋 一键复制到剪贴板
- 🆓 免费使用（5次/天）

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- OpenAI GPT-4 Turbo
- Cloudflare Pages

## 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 OPENAI_API_KEY

# 启动开发服务器
npm run dev

# 打开浏览器
# http://localhost:3000
```

## 部署

### Cloudflare Pages

1. Fork本仓库
2. 在Cloudflare Dashboard连接GitHub
3. 配置构建设置：
   - Build command: `npm run build`
   - Build output directory: `out`
   - Environment variables: `OPENAI_API_KEY`
4. 部署

## License

MIT
