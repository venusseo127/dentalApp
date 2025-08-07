# Dental Office Online Scheduling System

## Overview

This is a web-based dental clinic scheduling application that allows patients to book, manage, and view dental appointments online. The system serves both patients and clinic staff with a modern, responsive interface built using React and Express.

The application provides a complete appointment management workflow including service selection, dentist selection, date/time scheduling, and appointment confirmation. It features role-based access control with separate interfaces for patients and administrators.

## User Preferences

Preferred communication style: Simple, everyday language.
Database preference: AWS RDS instead of Neon for production reliability.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with conditional rendering based on authentication state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming and design tokens
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation through @hookform/resolvers

### Backend Architecture
- **Framework**: Express.js with TypeScript in ESM module format
- **Database ORM**: Drizzle ORM with node-postgres adapter for type-safe database operations
- **API Design**: RESTful API endpoints following standard HTTP methods and status codes
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

### Authentication System
- **Provider**: Replit Auth using OpenID Connect (OIDC) protocol
- **Session Storage**: PostgreSQL-backed sessions with configurable TTL
- **Authorization**: Role-based access control (patient/admin) with middleware guards
- **Security**: HTTP-only cookies, CSRF protection, and secure session configuration

### Database Design
- **Schema**: Comprehensive relational schema including users, dentists, services, appointments, and availability
- **Migrations**: Drizzle Kit for schema migrations and database versioning
- **Relationships**: Proper foreign key constraints and table relationships
- **Types**: Full TypeScript type generation from database schema using drizzle-zod

### Booking Workflow
- **Multi-step Process**: Service selection → Dentist selection → Date/time selection → Confirmation
- **Real-time Availability**: Dynamic time slot checking based on dentist schedules
- **Form Validation**: Client and server-side validation with proper error handling
- **State Persistence**: Booking data maintained across steps with proper cleanup

### Admin Features
- **Dashboard**: Statistics overview with appointment metrics and system insights
- **Appointment Management**: View, edit, and cancel appointments across all patients
- **Dentist Management**: Add, update, and manage dentist profiles and specializations
- **Service Management**: Configure available services with pricing and duration

## External Dependencies

### Database Service
- **AWS RDS**: PostgreSQL database instance hosted on Amazon Web Services
- **Connection Pooling**: Standard pg (node-postgres) driver with connection pool management
- **SSL Support**: Configured for production environments with SSL certificate validation

### Authentication Provider
- **Replit Auth**: OpenID Connect authentication service integrated with Replit platform
- **Session Storage**: PostgreSQL session store for scalable session management

### UI Component Library
- **Radix UI**: Headless, accessible component primitives for complex UI interactions
- **shadcn/ui**: Pre-styled component library built on Radix with Tailwind CSS integration
- **Lucide React**: Modern icon library with consistent styling and sizing

### Development Tools
- **Vite**: Fast development server with HMR and optimized production builds
- **TypeScript**: Full type safety across frontend, backend, and shared code
- **ESLint/Prettier**: Code formatting and linting for consistent code quality

### Runtime Dependencies
- **Date Handling**: date-fns for date manipulation and formatting
- **Utility Libraries**: clsx and tailwind-merge for conditional styling
- **Form Libraries**: React Hook Form ecosystem for robust form handling