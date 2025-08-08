# Dental Office Online Scheduling System

## Overview

This is a web-based dental clinic scheduling application that allows patients to book, manage, and view dental appointments online. The system serves both patients and clinic staff with a modern, responsive interface built using React and Express.

The application provides a complete appointment management workflow including service selection, dentist selection, date/time scheduling, and appointment confirmation. It features role-based access control with separate interfaces for patients and administrators.

## User Preferences

Preferred communication style: Simple, everyday language.
Database preference: Firebase Firestore for real-time updates and easy scalability.
Authentication preference: Firebase Auth with Google sign-in for secure and user-friendly authentication.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with conditional rendering based on authentication state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming and design tokens
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation through @hookform/resolvers

### Backend Architecture
- **Framework**: Express.js with TypeScript serving as a minimal static file server
- **Database Operations**: Client-side Firebase Firestore SDK for direct database operations
- **API Design**: No server-side API - all data operations handled by Firebase on the client
- **Real-time Data**: Firebase Firestore real-time listeners for live data updates
- **Error Handling**: Client-side error handling with Firebase-specific error management

### Authentication System
- **Provider**: Firebase Auth with Google sign-in authentication
- **Client-side Authentication**: Real-time authentication state management using react-firebase-hooks
- **Authorization**: Role-based access control using Firebase user email for admin access
- **Security**: Firebase-managed authentication tokens and secure client-side auth state

### Database Design
- **NoSQL Database**: Firebase Firestore for real-time data synchronization
- **Collection-Based Architecture**: Uses modern collection reference pattern with `export const itemsCollection = collection(db, "items")`
- **Function-Based Operations**: Individual functions for each operation (getItems, createItem, updateItem, deleteItem)
- **Type-Safe Operations**: All functions use proper TypeScript interfaces with date conversion
- **Collections**: Document-based storage for users, dentists, services, appointments, and availability
- **Real-time Updates**: Automatic data synchronization across all connected clients
- **Date Handling**: Proper Firestore Timestamp to Date conversion in all query functions

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
- **Firebase Firestore**: NoSQL document database with real-time synchronization
- **Client SDK**: Firebase JavaScript SDK for direct client-to-database operations
- **Offline Support**: Built-in offline capabilities with automatic sync when reconnected

### Authentication Provider
- **Firebase Auth**: Google OAuth integration with secure token management
- **Real-time Auth State**: Automatic authentication state synchronization across tabs and devices

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