# AItranscribe

## Overview

AItranscribe is a full-stack web application that transforms meeting transcripts into actionable insights using AI-powered summarization. The application features a professional landing page and a comprehensive summarization tool that allows users to upload meeting transcripts and generate intelligent summaries using Groq AI. Users can provide custom instructions, edit results with a rich text editor, and extract key decisions and action items from their meetings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing with two main routes:
  - `/` - Landing page with marketing content and call-to-action
  - `/app` - Main application interface for transcript summarization
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API endpoints
- **Language**: TypeScript for full-stack type safety
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **File Handling**: Multer middleware for file upload processing
- **Development**: Hot module replacement and error overlays via Vite integration

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon Database
- **ORM**: Drizzle ORM chosen for its type safety, performance, and modern TypeScript-first approach
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Fallback Storage**: In-memory storage implementation for development and testing
- **Session Storage**: PostgreSQL-based session storage with connect-pg-simple

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store
- **Password Security**: Planned implementation for user authentication (schema present but not yet implemented)
- **User Management**: Database schema supports user accounts with username/password authentication

### External Dependencies

#### AI/ML Services
- **Grok API (xAI)**: Primary AI service for generating meeting summaries
- **OpenAI SDK**: Used as client library for Grok API communication
- **Custom Instructions**: Support for user-defined summarization preferences

#### Database Services
- **Neon Database**: Serverless PostgreSQL for production data storage
- **Connection Management**: @neondatabase/serverless for optimized database connections

#### UI/UX Libraries
- **Radix UI**: Comprehensive collection of accessible UI primitives
- **Lucide React**: Icon library for consistent visual elements
- **React Hook Form**: Form state management with validation
- **React Dropzone**: Drag-and-drop file upload interface
- **Embla Carousel**: Responsive carousel components

#### Development Tools
- **ESBuild**: Fast bundling for server-side code
- **TSX**: TypeScript execution for development
- **Replit Integration**: Development environment optimizations and error handling

#### File Processing
- **Multer**: Multipart file upload handling
- **File Type Support**: Currently supports .txt files with planned support for .docx and .pdf formats
- **File Validation**: Size limits (10MB) and MIME type checking

### Key Design Decisions

#### Database Choice
- **PostgreSQL over alternatives**: Chosen for its reliability, ACID compliance, and excellent JSON support for future feature expansion
- **Drizzle ORM over Prisma**: Selected for better TypeScript integration, smaller bundle size, and more direct SQL control

#### AI Integration
- **Groq over alternatives**: Chosen for fast inference speed and cost-effective pricing for meeting summarization
- **OpenAI SDK compatibility**: Maintains familiar API patterns while using Groq's infrastructure
- **Llama 3.3 70B model**: Selected for its excellent text comprehension and summarization capabilities (updated from 3.1 due to deprecation)

#### File Upload Strategy
- **Memory storage over disk**: Simplifies deployment and scaling, suitable for the 10MB file size limit
- **Progressive file type support**: Starting with .txt files, with architecture ready for document parsing libraries

#### Frontend State Management
- **React Query over Redux**: Better suited for server state management, automatic caching, and optimistic updates
- **Local component state**: Used for UI state that doesn't need persistence

#### Styling Approach
- **Tailwind over styled-components**: Utility-first approach for consistent design system and smaller bundle size
- **CSS variables**: Enables dynamic theming and easy customization
- **Component-based design**: Reusable UI components with consistent API patterns