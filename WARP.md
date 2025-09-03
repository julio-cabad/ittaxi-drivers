# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## About This Project

This is a React Native taxi driver onboarding application for InstaTaxi, built with TypeScript and modern development practices. The app handles driver registration, document verification, vehicle information collection, and status management.

## Development Commands

### Essential Commands
```bash
# Install dependencies (first time setup)
npm install

# Start Metro bundler
npm start

# Run on Android device/emulator
npm run android

# Run on iOS device/simulator (requires CocoaPods setup)
npm run ios

# Run tests
npm test

# Lint code
npm run lint
```

### iOS-Specific Setup
```bash
# Install Ruby gems (first time only)
bundle install

# Install CocoaPods dependencies (run after npm install or native dependency updates)
bundle exec pod install
```

### Single Test Execution
```bash
# Run specific test file
npm test -- --testPathPattern="ComponentName"

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Architecture Overview

### Core Technology Stack
- **React Native 0.81** with TypeScript
- **Redux Toolkit** + RTK Query for state management and API calls
- **React Navigation** for screen navigation
- **Realm Database** for local data persistence
- **Firebase** for authentication and cloud storage
- **Formik + Yup** for form validation

### Directory Structure

```
src/
├── api/                    # API layer with RTK Query
│   ├── base/              # Base API configuration and endpoints
│   ├── external/          # External service integrations
│   └── internal/          # Internal service APIs
├── components/            # Reusable UI components
│   ├── commons/           # Generic shared components
│   ├── forms/             # Form-specific components
│   ├── layout/            # Layout components
│   ├── modern/            # Design system components
│   └── onboarding/        # Onboarding-specific components
├── config/               # App configuration files
├── constants/            # Constants and enums
├── database/             # Realm database schemas and services
├── hooks/                # Custom React hooks
├── interceptors/         # Error handling interceptors
├── navigation/           # Navigation configuration
├── screens/              # Screen components
│   ├── auth/            # Authentication screens
│   └── onboarding/      # Driver onboarding screens
├── services/            # Business logic services
├── store/               # Redux store configuration
│   └── slices/          # Redux slices
├── styles/              # Global styles and themes
├── types/               # TypeScript type definitions
└── utils/               # Utility functions and validations
```

### Key Architectural Patterns

**State Management Architecture:**
- Redux Toolkit for global UI state (onboarding progress, auth state)
- RTK Query for server state and caching
- Realm database for offline data persistence
- Firebase for cloud data synchronization

**Navigation Flow:**
- Single AuthNavigator handles both auth and onboarding screens
- Screen names defined in `constants/navigation.ts`
- Type-safe navigation with TypeScript parameter lists

**Data Layer:**
- `RealmService` singleton manages local database operations
- `baseApi` provides common RTK Query configuration
- Error interceptors handle consistent error reporting
- Sync status tracking for offline-first functionality

**Component Architecture:**
- Modern design system in `components/modern/`
- Form components with Formik integration
- Reusable layout components
- Screen-specific component organization

## Key Files and Services

### Database Layer
- `src/database/RealmService.ts` - Main database service singleton
- `src/database/schemas/` - Realm object schemas
- Handles onboarding data persistence, file uploads, and sync status

### API Layer  
- `src/api/base/baseApi.ts` - RTK Query base configuration
- Common headers, authentication, error handling
- Tag-based cache invalidation system

### Navigation
- `src/navigation/AuthNavigator.tsx` - Main navigation stack
- `src/constants/navigation.ts` - Screen names and type definitions

### State Management
- `src/store/index.ts` - Redux store configuration
- `src/store/slices/` - Feature-specific state slices
- Integrates RTK Query with regular Redux slices

## Development Guidelines

### Testing
- Jest configuration in `jest.config.js`
- Test files located alongside components in `__tests__` directories
- Run `npm test` for all tests or target specific files

### Code Style
- ESLint configuration in `.eslintrc.js`
- Prettier configuration in `.prettierrc.js`
- TypeScript strict mode enabled

### iOS Development
- Always run `bundle exec pod install` after updating native dependencies
- Use physical devices for testing camera and file upload features
- Check iOS-specific permissions in Info.plist

### Android Development
- Ensure proper permissions in AndroidManifest.xml
- Test file upload functionality on various Android versions
- Use Android Studio for native debugging when needed

### Database Operations
- Always initialize Realm service before app renders (handled in App.tsx)
- Use RealmService methods for all database operations
- Implement proper error handling for database failures

### API Integration
- Use RTK Query for all external API calls
- Inject endpoints into baseApi for consistent error handling
- Implement proper loading states and error boundaries

### Form Handling
- Use Formik + Yup for all forms
- Implement proper validation schemas
- Handle offline form submission with local storage
