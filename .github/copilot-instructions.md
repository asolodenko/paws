# Copilot Instructions: The Paws - Pet Adoption App

## Project Architecture

This is a Vue 3 + Vuetify pet adoption SPA with serverless Vercel backend functions. The app uses Firebase for authentication (Google OAuth) and Firestore for data persistence.

**Key architectural patterns:**
- **Frontend:** Vue 3 Composition API, Pinia stores, Vue Router with layout-based routing
- **Backend:** Vercel serverless functions (`/api`) using Firebase Admin SDK
- **Auth flow:** Firebase handles auth, custom claims determine admin role (`user.customClaims.admin`)
- **API communication:** Axios interceptor in `src/plugins/axios.ts` auto-injects Firebase ID token in Authorization header

## Critical Development Workflows

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Frontend only (port 3000)
vercel dev           # Frontend + serverless functions (requires Vercel CLI)
npm run lint:fix     # Fix linting issues
```

**Important:** Use `vercel dev` when testing API functions (`/api/*.js`). Regular `npm run dev` won't serve the serverless endpoints.

### Environment Setup
- Frontend Firebase config: `VITE_FIREBASE_*` vars in `.env`
- Backend Firebase Admin: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` in Vercel env
- API base URL: `VITE_API_URL` points to Vercel functions

See `docs/deployment/env-vars.md` for complete list.

## Code Style & Conventions

### Linting Rules (eslint.config.mjs)
- **No semicolons:** `semi: ["error", "never"]`
- **Single quotes:** `quotes: ["error", "single"]`
- **Component naming:** PascalCase in templates (`<VCard>`, `<PawCard />`)
- **Vue rules:** Self-closing for void/components, 2-space indent, max 3 attrs per line (single-line)
- **Console:** Only `console.warn` and `console.error` allowed (warn on others)

### File Organization
- **Layouts:** Two layouts in `src/layouts/` - `BigPawLayout` (home/about) and `SmallPawLayout` (app pages)
- **Stores:** Pinia stores in `src/store/` - composition API pattern with `defineStore(() => {...})`
- **Models:** TypeScript interfaces in `src/model/` - `Paw.model.ts`, `Request.model.ts`, `User.model.ts`
- **Constants:** Status/type constants in `src/constants.ts` (PENDING, APPROVED, REJECTED, etc.)

## State Management Patterns

### User Store (`src/store/user.ts`)
```typescript
const { user, isAdmin, isAuth, setCurrentUser, setIsAdmin } = useUserStore()
```
- `isAuth` computed: `!!user.value && !isLoading.value`
- Admin status set via Firebase custom claims (see `src/auth/index.ts`)

### Paw Store (`src/store/paw.ts`)
- Fetches single pet from Firestore: `fetchPawData(id)`
- Used in detail view (`/paws/:id`)

### Snackbar Store (`src/store/useSnackbarStore.ts`)
- Global notification system
- Auto-triggered by Axios interceptor on errors

## API & Backend Patterns

### Serverless Functions (`/api`)
All functions:
1. Check `req.method === 'POST'`
2. Verify Firebase ID token from `req.headers.authorization`
3. Initialize Firebase Admin SDK if not initialized (`!getApps().length`)

**Key functions:**
- `sendRequest.js`: Create visit/adopt requests (requires `userId`, `pawId`, `type`; optionally `date`/`time` for visits)
- `handleRequestTransition.js`: Admin-only approve/reject/fulfill actions (checks `user.customClaims.admin`)

### Frontend API Calls (`src/plugins/axios.ts`)
```typescript
import { sendPOST } from '@/plugins/axios'
await sendPOST('sendRequest', { userId, pawId, type: 'visit', date, time })
```
- Axios instance auto-injects Firebase auth token
- Triggers snackbar on success/error
- Base URL from `VITE_API_URL`

## Authentication Flow

1. User signs in via Google OAuth (`handleSignIn()` in `src/auth/index.ts`)
2. `onAuthStateChanged` monitors auth state changes
3. User data synced to Firestore `users/{uid}` collection
4. Custom claims fetched via `user.getIdTokenResult()` to determine admin status
5. `useUserStore` updated with user info and admin flag

**Admin assignment:** Use `setCustomClaims.js` script (root) to set admin custom claims manually.

## Router Structure

Two-level nesting with layout components:
```
/ (BigPawLayout)
  ├─ / (Home.vue)
  └─ /about (About.vue)
/paws (SmallPawLayout)
  ├─ /paws (Paws.vue - list)
  └─ /paws/:id (Paw.vue - detail)
/account (SmallPawLayout > Account.vue)
/admin (SmallPawLayout > Admin.vue)
```

Note: Route guards not implemented (commented in `src/router/index.ts`).

## Data Flow & Firestore Access

### Read Operations (Direct Firestore Access)
Frontend reads directly from Firestore collections:
- **Paws list:** Query `paws` collection for browsing pets
- **Paw details:** Get single document from `paws/{id}` (see `usePawStore.fetchPawData()`)
- **User requests:** Query `requests` collection filtered by `userId` or admin view

### Write Operations (Serverless Functions Only)
All mutations go through `/api` functions for authentication & authorization:
- **Send request:** `sendRequest.js` - creates visit/adopt requests in `requests` collection
- **Handle transitions:** `handleRequestTransition.js` - approve/reject/fulfill/unfulfill requests (admin-only)

**Why this pattern:** Firestore rules alone can't validate complex business logic. Serverless functions verify Firebase auth tokens and custom claims before writing data.

## Data Models

### Request Lifecycle
```typescript
type Status = 'pending' | 'approved' | 'rejected' | 'fulfilled' | 'unfulfilled'
type RequestType = 'visit' | 'adopt'
```
Flow: `pending` → `approved`/`rejected` → `fulfilled`/`unfulfilled`

Both visit and adopt requests follow the same status progression.

### Paw (Pet) Model
Key fields: `id`, `name`, `breed`, `birthDate`, `gender`, `temperament`, `activityLevel`, `groomingNeeds`, `healthCondition`

See `src/model/*.ts` for complete schemas.

## Vuetify Usage

- Auto-imported components via `vite-plugin-vuetify`
- Custom SCSS settings: `src/styles/settings.scss`
- Use MDI icons: `@mdi/font` package
- Component examples: `PawCard.vue`, `RequestsTable.vue`, `MakeRequestDialog.vue`

## Common Pitfalls

1. **Forgot to await Firebase token:** Axios interceptor handles this automatically
2. **Running npm dev for API testing:** Use `vercel dev` instead
3. **Missing admin check:** Admin functions must verify `customClaims.admin` (see `handleRequestTransition.js`)
4. **Firestore rules:** Not in repo - ensure rules match app logic on Firebase Console
5. **Private key formatting:** `FIREBASE_PRIVATE_KEY` needs `.replace(/\\n/g, '\n')` in serverless functions

## Testing & Deployment

- **Deployment:** Vercel auto-deploys from git branches (develop/staging/master)
- **Environments:** Separate Firebase projects per environment
- **Docs:** See `docs/deployment/` for deployment guides, `docs/development/` for dev workflows

## MCP Servers

This project uses Model Context Protocol servers for enhanced AI assistance:

### vuetify-mcp
Get up-to-date Vuetify component API documentation:
```typescript
// AI can query component props, events, slots dynamically
// Useful when working with VCard, VBtn, VDialog, etc.
```

### github-mcp-server
Interact with GitHub directly:
- Create/update issues and PRs
- Search code and repositories
- Manage branches and reviews

These MCPs provide AI agents with real-time access to Vuetify docs and GitHub operations without manual lookups.
