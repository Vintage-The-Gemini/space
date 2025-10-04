# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Space Explorer is a full-stack application for space mission monitoring and NASA data visualization. It consists of:
- **Web Frontend**: React (Vite) with real-time telemetry monitoring
- **Mobile App**: React Native (Expo) with native mobile experience
- **Backend**: Node.js/Express that integrates with NASA APIs and manages space instrument/discovery data

## Development Commands

### Frontend Web (Vite + React)
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Mobile (React Native + Expo)
```bash
cd mobile
npm start            # Start Expo development server
npm run android      # Run on Android device/emulator
npm run ios          # Run on iOS device/simulator (macOS only)
```

### Backend (Node.js + Express)
```bash
cd backend
npm run dev          # Start with nodemon (auto-reload)
```

## Architecture

### Web Frontend Structure
- **Pages** (`src/pages/`): Top-level route components
  - `HomePage`: Landing page
  - `InstrumentsList`, `InstrumentDetails`: Instrument management
  - `DiscoveriesPage`: Space discoveries catalog
  - `LaunchesPage`: Launch tracking
  - `UpdatesPage`: Mission updates

- **Components** (`src/components/`): Reusable UI components organized by feature:
  - `nasa/`: NASA data components (MarsExplorer, NeoTracker, NasaDashboard)
  - `mission/`: Mission-specific components (TelemetryDashboard)
  - `instruments/`: Instrument-related components
  - Shared: Navbar, Footer, ErrorBoundary, etc.

- **State Management**: React Query (`@tanstack/react-query`) for server state with 5-minute stale time
- **Routing**: React Router DOM with routes defined in `App.jsx`
- **Styling**: Tailwind CSS
- **API Client**: Custom `fetchAPI` helper in `src/config/api.js` with centralized error handling

### Mobile App Structure
- **Screens** (`src/screens/`): Full-screen components for each route
  - `HomeScreen`: Landing screen with feature cards
  - `InstrumentsListScreen`, `InstrumentDetailScreen`: Instrument management
  - `DiscoveriesScreen`: Space discoveries catalog
  - `NasaScreen`, `MarsExplorerScreen`, `NeoTrackerScreen`: NASA data exploration
  - `TelemetryScreen`: Real-time telemetry dashboard

- **Navigation** (`src/navigation/`): React Navigation setup
  - Bottom Tab Navigator for main features
  - Stack Navigators for hierarchical navigation (Instruments, NASA)
  - Dark theme with consistent styling across screens

- **Services** (`src/services/`):
  - `api.js`: API service functions using axios (instruments, NASA, discoveries, updates)
  - `websocket.js`: WebSocket service for real-time telemetry with auto-reconnect

- **Configuration** (`src/config/`):
  - `api.js`: Axios instance with interceptors for logging and error handling
  - `queryClient.js`: React Query configuration (5-minute stale time, 2 retries)

- **State Management**: React Query for server state (same config as web)
- **Styling**: React Native StyleSheet with dark theme (#000 background, #3b82f6 accents)
- **Icons**: Expo vector icons (Ionicons)

### Backend Structure
- **Routes** (`routes/`): Express route definitions
  - `/api/instruments`: CRUD operations for space instruments
  - `/api/nasa`: NASA API proxy endpoints (APOD, Mars photos, NEO data)

- **Controllers** (`controllers/`): Business logic for route handlers

- **Models** (`models/`): Mongoose schemas
  - `Instrument`: Space instruments with telemetry data and status
  - `Discovery`: Space discoveries linked to instruments (Exoplanets, Stars, Galaxies, etc.)
  - `Update`: Mission updates

- **Services** (`services/`): External API integrations
  - `nasaApi.js`: NASA API service wrapper (APOD, Mars Rover, NEO Feed, Earth Imagery)

- **Real-time Communication**: WebSocket server integrated with Express
  - Sends telemetry updates every 1 second to connected clients
  - Message types: `TELEMETRY_UPDATE`, `SUBSCRIBE_MISSION`, `REQUEST_HISTORICAL_DATA`

### Database
- MongoDB Atlas via Mongoose ODM
- Indexed queries on Discovery model for type, date, and distance
- Automatic instrument discovery count updates via post-save middleware

### Key Integration Points
1. **Web/Mobile-Backend**:
   - Web: API calls use `VITE_API_URL` environment variable
   - Mobile: API calls use `EXPO_PUBLIC_API_URL` environment variable
   - Both default to Render deployment URL

2. **NASA Integration**: Backend proxies NASA API requests to avoid exposing API key in clients

3. **WebSocket**:
   - Web: Real-time telemetry in TelemetryDashboard component
   - Mobile: Real-time telemetry in TelemetryScreen with auto-reconnect
   - Both connect to same WebSocket server endpoint

4. **Error Handling**:
   - Web: ErrorBoundary component catches React errors
   - Mobile: ActivityIndicator loading states and error text displays
   - Backend: Global error middleware in `server.js`
   - API calls: Centralized error handling in axios interceptors

5. **Shared Architecture**:
   - Both web and mobile use React Query with identical configuration
   - Same API endpoints and data structures
   - Consistent dark theme and UX patterns

### Environment Variables
- **Backend** (`.env`):
  - `MONGO_URI`: MongoDB connection string
  - `NASA_API_KEY`: NASA API key
  - `PORT`: Server port (default 5000)
  - `NODE_ENV`: Environment mode

- **Web Frontend** (`.env`):
  - `VITE_API_URL`: Backend API URL

- **Mobile App** (`.env`):
  - `EXPO_PUBLIC_API_URL`: Backend API URL

## Important Notes
- **Web**: Uses Vite (not CRA) - access env variables with `import.meta.env.VITE_*`
- **Mobile**: Uses Expo - access env variables with `process.env.EXPO_PUBLIC_*`
- All NASA API calls go through backend to protect the API key
- WebSocket connection managed separately from HTTP routes in both clients
- Mobile app uses native navigation with React Navigation (Tab + Stack navigators)
- Both apps share same backend API and data models
- Discovery model has complex nested schema for astronomical data (coordinates, characteristics, publications)
- Instrument status enum: Active, Inactive, Maintenance, Retired
- Discovery type enum: Exoplanet, Star, Galaxy, Nebula, BlackHole, Asteroid, Comet, Other
