# Adoption Eligibility Check Feature

## Original Prompt
Implement the adoption eligibility check feature for a user. Also implement displaying visit counter on a paw page. I don't have exact design for the counter, but I want it to be a progress bar.

## Feature Overview
This feature enforces a requirement that users must complete 5 fulfilled visit requests to a specific pet before they are eligible to submit an adoption request for that pet. It includes visual feedback via a progress bar showing the user's visit count.

## Implementation Details

### Backend Changes

#### 1. API Endpoint: `sendRequest.js`
**Modified:** Added adoption eligibility validation
- Before creating an adoption request, the endpoint queries Firestore to count fulfilled visit requests for the specific user and pet combination
- If the user has fewer than 5 fulfilled visits, the request is rejected with a 403 status and a descriptive error message
- Error message format: `"Adoption not allowed. You need 5 fulfilled visits to adopt this pet. Current visits: {count}/5"`

**Query Logic:**
```javascript
db.collection('requests')
  .where('userId', '==', userId)
  .where('pawId', '==', pawId)
  .where('type', '==', 'visit')
  .where('status', '==', 'fulfilled')
  .get()
```

#### 2. New API Endpoint: `getVisitCount.js`
**Created:** New serverless function to fetch visit count for frontend display
- Accepts `userId` and `pawId` in POST request body
- Verifies Firebase ID token for authentication
- Returns JSON with:
  - `visitCount`: Number of fulfilled visits (0-5+)
  - `isEligibleForAdoption`: Boolean indicating if user has ≥5 visits

### Frontend Changes

#### 1. Component: `VisitCounter.vue`
**Created:** New component to display visit progress
- **Props:**
  - `visitCount: number` - Current number of fulfilled visits
  - `isEligibleForAdoption: boolean` - Whether user can adopt

**Visual Design:**
- Card with paw icon and title "Your Visit Progress"
- Progress bar (VProgressLinear) showing percentage completion (visitCount / 5 * 100%)
- Progress bar colors:
  - Primary (blue): 0-2 visits
  - Warning (orange): 3-4 visits
  - Success (green): 5+ visits
- Striped progress bar with percentage displayed inside
- Status message:
  - If eligible: Green checkmark with "You're eligible to adopt this pet!"
  - If not eligible: Text showing "Complete X more visit(s) to become eligible for adoption"

#### 2. View: `Paw.vue`
**Modified:** Pet detail page with visit counter integration
- Added `VisitCounter` component display (visible only for authenticated users)
- Added reactive state:
  - `visitCount` - Stores current visit count
  - `isEligibleForAdoption` - Stores eligibility status
- Added `fetchVisitCount()` function that calls `getVisitCount` API
- Calls `fetchVisitCount()` on mount if user is authenticated
- Watches `isAuth` to fetch count when user logs in
- Updated "Adopt Pet" button:
  - Disabled when `!isEligibleForAdoption`
  - Provides visual feedback that adoption requires prerequisites
- Passes visit count data to `MakeRequestDialog` component
- Refetches visit count after a request is sent (via `@request-sent` event)

#### 3. Component: `MakeRequestDialog.vue`
**Modified:** Request modal with eligibility enforcement
- Added new props:
  - `visitCount: number`
  - `isEligibleForAdoption: boolean`
- Added `requestSent` emit event to notify parent after successful request
- Updated adoption request UI:
  - Shows warning alert (VAlert) when not eligible
  - Alert displays: Required visits remaining, current progress (X/5)
  - "Send" button disabled when `action === 'adopt' && !isEligibleForAdoption`
  - Only shows adoption instructions when user is eligible
- Emits `requestSent` event after successful request submission to trigger parent refresh

### User Experience Flow

1. **User visits pet detail page (Paw.vue)**
   - If authenticated, system fetches and displays visit count
   - Progress bar shows visual representation of eligibility progress

2. **User with 0-4 fulfilled visits**
   - Progress bar shows incomplete status (< 100%)
   - "Adopt Pet" button is disabled
   - Clicking the button does nothing (disabled state)
   - Message states: "Complete X more visit(s) to become eligible"

3. **User with 5+ fulfilled visits**
   - Progress bar shows 100% completion in green
   - "Adopt Pet" button is enabled
   - Success message: "You're eligible to adopt this pet!"
   - Can click "Adopt Pet" to open modal and submit request

4. **Attempting to adopt without eligibility**
   - If somehow bypassed (direct API call), backend rejects with 403
   - Frontend shows error via snackbar notification

5. **After submitting a visit request**
   - Visit count refreshes automatically
   - Progress bar updates to reflect new state

### Technical Notes

- **Authentication Required:** Both frontend component display and backend API endpoints require authenticated user
- **Real-time Updates:** Visit count refetches after each request submission
- **Firestore Queries:** Backend uses compound queries with 4 conditions (userId, pawId, type, status)
- **Error Handling:** Backend returns descriptive error messages that frontend displays via existing snackbar system
- **State Management:** Visit count is component-level state (not in Pinia store) as it's page-specific data
- **Props Flow:** `Paw.vue` → `MakeRequestDialog.vue` → validation logic

### Future Enhancements (Not Implemented)
- Real-time visit count updates via Firestore listeners
- Caching visit count to reduce API calls
- Admin interface to configure required visit threshold (currently hardcoded to 5)
- Badge/achievement system for reaching milestones
- Email notification when user becomes eligible

### Files Modified/Created

**Created:**
- `/api/getVisitCount.js` - New API endpoint
- `/src/components/VisitCounter.vue` - New component

**Modified:**
- `/api/sendRequest.js` - Added eligibility check
- `/src/views/Paw.vue` - Integrated counter and fetch logic
- `/src/components/MakeRequestDialog.vue` - Added eligibility props and validation

### Testing Checklist
- [ ] Unauthenticated users don't see visit counter
- [ ] Authenticated users see visit counter with correct count
- [ ] Progress bar displays correct percentage and color
- [ ] Adopt button disabled when visitCount < 5
- [ ] Adopt button enabled when visitCount >= 5
- [ ] Backend rejects adoption request when visitCount < 5
- [ ] Backend allows adoption request when visitCount >= 5
- [ ] Error message displays correct visit count
- [ ] Visit counter updates after submitting visit request
- [ ] Modal shows warning when trying to adopt without eligibility
