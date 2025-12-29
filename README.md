
# SEO Meta Tag Checker 🔍

A powerful web application for analyzing and optimizing website meta tags for search engines and social media platforms. Built with React, TypeScript, Express, and Tailwind CSS.

[![Built with Replit](https://img.shields.io/badge/Built%20with-Replit-orange)](https://replit.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎓 About This Project

This application was created as part of **Replit's Vibe Coding 101** class on [DeepLearning.AI](https://www.deeplearning.ai/short-courses/ai-powered-development-with-replit-agent/). The course teaches modern full-stack development using AI-powered tools and best practices.

**Built entirely on [Replit](https://replit.com)** - a collaborative browser-based IDE that makes coding accessible to everyone.

## ✨ Features

- **Real-time SEO Analysis**: Instantly analyze any website's meta tags
- **Comprehensive Tag Detection**: Checks title, description, Open Graph, Twitter Cards, and more
- **SEO Scoring**: Get a numerical score based on best practices
- **Smart Recommendations**: Receive actionable suggestions to improve your SEO
- **Social Media Previews**: See how your content appears on:
  - Google Search Results
  - Facebook
  - Twitter/X
  - LinkedIn
- **Code Preview**: View all detected meta tags with syntax highlighting
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🚀 Live Demo

[View Live Application](https://tag-scout-test.replit.app) *(deployed on Replit)*

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Wouter** - Lightweight client-side routing
- **TanStack Query** - Server state management
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **Vite** - Lightning-fast build tool

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type-safe server code
- **Zod** - Schema validation
- **Drizzle ORM** - Database toolkit (PostgreSQL ready)

### Development Tools
- **Replit** - Cloud development environment
- **ESBuild** - Fast bundling
- **PostCSS** - CSS processing

## 📦 Installation & Setup

### Running Locally on Replit

1. Fork this Repl on [Replit](https://replit.com)
2. Click the **Run** button
3. The application will automatically install dependencies and start on port 5000

### Running Outside Replit

```bash
# Clone the repository
git clone https://github.com/yourusername/seo-meta-tag-checker.git
cd seo-meta-tag-checker

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎯 Usage

1. Enter a URL in the input field
2. Click "Analyze" or press Enter
3. View the comprehensive SEO analysis including:
   - Overall SEO score
   - Individual tag statuses
   - Character counts and optimization tips
   - Social media preview mockups
   - Actionable recommendations

### Example URLs to Try
- `https://espn.com` - Well-optimized sports website
- `https://amazon.com` - E-commerce platform
- `https://uiowa.edu` - Educational institution

## 📁 Project Structure

```
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/       # shadcn/ui primitives
│   │   │   └── ...       # Feature components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities and helpers
│   │   └── hooks/        # Custom React hooks
│   └── public/           # Static assets
├── server/               # Backend application
│   ├── index.ts         # Express server setup
│   ├── routes.ts        # API endpoints
│   └── storage.ts       # Data persistence layer
├── shared/              # Shared TypeScript types
│   └── schema.ts        # Zod schemas and types
└── script/              # Build scripts
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for optional configuration:

```env
PORT=5000
DATABASE_URL=postgresql://... # Optional: for database persistence
NODE_ENV=production           # Set to 'development' for dev mode
```

### Deployment

This application is deployed on **Replit Deployments** with autoscaling:

```bash
# Build command
npm run build

# Run command
node ./dist/index.cjs
```

For detailed deployment instructions, see [Replit's Deployment Documentation](https://docs.replit.com/hosting/deployments/about-deployments).

## 🎨 Design Philosophy

The application follows a **utility-first design system** inspired by modern developer tools (Linear, Vercel, Raycast):

- **Clean Typography**: Inter font family with clear hierarchy
- **Information Density**: Scannable cards with color-coded status indicators
- **Real Previews**: High-fidelity mockups of social media appearances
- **Responsive Layout**: Adapts from mobile to desktop seamlessly

See [design_guidelines.md](design_guidelines.md) for complete design documentation.

## 📊 API Endpoints

### POST `/api/analyze`

Analyze a URL's meta tags.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "score": 89,
  "tags": { ... },
  "recommendations": [ ... ],
  "googlePreview": { ... },
  "facebookPreview": { ... },
  "twitterPreview": { ... },
  "linkedinPreview": { ... },
  "rawTags": [ ... ]
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project on Replit or GitHub
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **[Replit](https://replit.com)** - For providing an amazing cloud development platform
- **[DeepLearning.AI](https://www.deeplearning.ai/short-courses/ai-powered-development-with-replit-agent/)** - For the Vibe Coding 101 course
- **[shadcn/ui](https://ui.shadcn.com/)** - For beautiful, accessible components
- **[Radix UI](https://www.radix-ui.com/)** - For unstyled, accessible primitives

## 📧 Contact

For questions or feedback, please open an issue on GitHub or reach out through Replit.

---

**Built with ❤️ on [Replit](https://replit.com)**
