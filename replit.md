# SEO Meta Tag Checker

## Overview

This is an SEO Meta Tag Checker tool that analyzes websites and provides feedback on their meta tags. Users enter a URL, and the application fetches the page, extracts meta tags (title, description, Open Graph, Twitter Cards, etc.), calculates an SEO score, and shows previews of how the content appears on Google and social media platforms.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React useState for local state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Theme**: Dark/light mode support via custom ThemeProvider
- **Build Tool**: Vite

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/`
- Reusable components in `client/src/components/`
- UI primitives from shadcn/ui in `client/src/components/ui/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: REST API with JSON request/response
- **Validation**: Zod schemas for request validation
- **Development**: Hot module replacement via Vite middleware

The server has a simple structure:
- `server/index.ts` - Express app setup and middleware
- `server/routes.ts` - API route handlers (includes URL analysis logic)
- `server/storage.ts` - In-memory storage abstraction (prepared for database integration)
- `server/vite.ts` - Development server with Vite HMR
- `server/static.ts` - Production static file serving

### Data Flow
1. User enters URL in frontend
2. Frontend POSTs to `/api/analyze` with URL
3. Backend fetches the target URL, parses HTML with regex
4. Backend extracts meta tags, calculates SEO score, generates recommendations
5. Response returned with tag analysis, score, and social previews

### Shared Code
- `shared/schema.ts` - Zod schemas and TypeScript types shared between frontend and backend
- Types include: `SeoAnalysisResult`, `TagAnalysis`, `SeoRecommendation`, `MetaTag`

## External Dependencies

### Database
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Generated to `./migrations` folder
- **Current State**: Schema defined but using in-memory storage; ready for PostgreSQL when `DATABASE_URL` is provided

### Third-Party Services
- None required for core functionality
- The application fetches external URLs directly using the Fetch API

### Key NPM Packages
- `@tanstack/react-query` - Data fetching and caching
- `drizzle-orm` / `drizzle-zod` - Database ORM and schema validation
- `express` - HTTP server
- `zod` - Runtime type validation
- `wouter` - Client-side routing
- Radix UI primitives - Accessible UI components