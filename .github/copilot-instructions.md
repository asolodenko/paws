# The Paws - AI Coding Agent Instructions

## Project Overview
The Paws is a pet adoption app using Vue 3 + Vuetify 3 (frontend), Firebase Auth/Firestore (database), and Vercel serverless functions (backend API). The app manages two user roles: regular users who request pet visits/adoptions, and admins who approve/reject requests.

## MCP Servers Available
This project has access to Model Context Protocol (MCP) servers for enhanced AI assistance:
- **vuetify-mcp** - Get real-time Vuetify 3 component API documentation, props, events, and slots
- **github-mcp-server** - Interact with GitHub repos, issues, PRs, and workflows directly from the editor

## Architecture

### Frontend Stack
- **Vue 3** with TypeScript, Composition API, and `<script setup>` syntax
- **Vuetify 3** for UI components with custom theme (`primary: #365738ff`)
- **Pinia** for state management (stores in `src/store/`)
- **Vue Router** with nested layouts (`BigPawLayout` for home/about, `SmallPawLayout` for all other pages)
- **Vite** dev server runs on port 3000

### Backend Architecture
- **Serverless Functions**: Located in `api/` directory, deployed to Vercel
- `api/sendRequest.js` - Creates visit/adoption requests (requires auth)
- `api/handleRequestTransition.js` - Admin-only endpoint for request state transitions (approve/reject/fulfill/unfulfill)
- Both use Firebase Admin SDK with service account credentials from environment variables

### Data Models
- **Request** (`src/model/Request.model.ts`): Visit or adoption requests with state machine: `pending` → `approved/rejected` → `fulfilled/unfulfilled`
- **Paw** (`src/model/Paw.model.ts`): Pet profiles with breed, temperament, health info
- **User** (`src/model/User.model.ts`): Firebase user + custom claims for admin role

### Authentication Flow
1. Firebase Auth with Google Sign-In (`src/auth/index.ts`)
2. `onAuthStateChanged` monitors auth state, syncs user data to Firestore `users` collection
3. Admin role stored as custom claim on Firebase user (set via `setCustomClaims.js` script)
4. Axios interceptor (`src/plugins/axios.ts`) auto-attaches Firebase ID token to API requests

### Data Flow Pattern
**Read Operations** (Direct Firestore Access):
- Pet data: Read from `paws` collection with real-time listeners in `usePawStore()`
- Request lists: Read from `requests` collection filtered by user or status
- No authentication required for reading pet data; user-specific data requires auth

**Write Operations** (Via Serverless Functions):
- All writes go through Vercel serverless functions (`api/sendRequest.js`, `api/handleRequestTransition.js`)
- Functions verify Firebase ID tokens and check custom claims for admin actions
- This ensures proper authentication and role-based access control at the API level
- Never write directly to Firestore from the frontend

## Key Conventions

### State Management Pattern
- Use Pinia stores with Composition API style (see `src/store/user.ts`)
- Auth state in `useUserStore()` - use `isAuth` computed, not direct `user` check
- Pet data in `usePawStore()` with Firestore real-time listeners
- Global notifications via `useSnackbarStore()` (triggered in axios interceptors)

### Request State Machine
Follow strict state transitions defined in `docs/system/functional-requirements.md`:
- `pending` → admin can `approve` or `reject` (with comment)
- `approved` → admin can `fulfill` or `unfulfill`
- `rejected` → admin can only `unfulfill` (to archive)
- End states: `fulfilled`, `unfulfilled`

### Component Patterns
- **Status Display**: Use `getStatusColor()` and `getStatusIcon()` helpers (see `RequestsTable.vue`)
- **Date Handling**: Use `dayjs` with UTC plugin for consistent date formatting
- **Icons**: Material Design Icons (`mdi-*` prefix) via Vuetify
- **Forms**: Vuetify dialogs (`v-dialog`) with form validation

### Environment Variables
Required in `.env` (see `docs/deployment/env-vars.md`):
- Frontend: `VITE_FIREBASE_*` for Firebase config, `VITE_API_URL` for API base
- Backend (Vercel): `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

### Routing
- No route guards implemented yet (commented in `src/router/index.ts`)
- Use `router.go(-1)` after login to return to previous page
- Layouts wrap routes: `BigPawLayout` for landing pages, `SmallPawLayout` for app pages

## Development Workflow

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (port 3000)
vercel dev           # Test with serverless functions locally
npm run lint:fix     # Auto-fix linting issues
```

### Building
```bash
npm run build        # TypeScript check + Vite build
npm run preview      # Preview production build
```

### Testing
The project uses **Vitest** as the testing framework (setup pending). When writing tests:
- Unit tests for components, stores, and utilities
- Integration tests for API functions and auth flows
- Follow Vue 3 + Composition API testing patterns

### Admin Role Setup
To grant admin access, run `setCustomClaims.js` with Firebase Admin SDK credentials:
```javascript
admin.auth().setCustomUserClaims(uid, { admin: true })
```

## Critical Files

- `src/firebase.ts` - Firebase app initialization
- `src/auth/index.ts` - Auth handlers and user data sync
- `src/plugins/axios.ts` - API client with auth interceptors
- `src/constants.ts` - Request status/type constants (use these, not string literals)
- `src/router/index.ts` - Route definitions with nested layouts
- `docs/system/functional-requirements.md` - Complete request state machine documentation

## Common Pitfalls

- **Admin Auth**: Backend functions verify admin role via custom claims, not Firestore user doc
- **Date Handling**: Visit requests require both `date` (ISO string) and `time` (HH:MM) fields
- **CORS**: `signInWithPopup` logs CORS errors but works (ignore console warnings)
- **API Responses**: `sendPOST()` shows snackbar notifications automatically, don't duplicate
- **Request Types**: Use `VISIT` and `ADOPT` constants from `src/constants.ts`, not hardcoded strings
- **Vuetify Auto-import**: Components auto-imported via `vite-plugin-vuetify`, no manual imports needed
