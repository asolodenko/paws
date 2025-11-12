# Adoption Eligibility Check Feature

## Original Prompt
Implement the adoption eligibility check feature for a user. Also implement displaying visit counter on a paw page. I don't have exact design for the counter, but I want it to be a progress bar.

### Round 2:
Make the next updates:
- fix the data flow for visit count, it should not send api request, but read data directly from Firestore as described in instructions
- I find eligibility check in the request dialog redundant as the button opening it is disabled until user is eligible to adopt.

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
- Added `subscribeToVisitCount()` function that creates a real-time Firestore listener
- Queries Firestore directly for fulfilled visit requests:
  ```typescript
  query(
    collection(firestore, 'requests'),
    where('userId', '==', user.value.uid),
    where('pawId', '==', pawId),
    where('type', '==', 'visit'),
    where('status', '==', 'fulfilled')
  )
  ```
- Real-time updates via `onSnapshot()` - automatically reflects new fulfilled visits
- Subscription established on mount if user is authenticated
- Watches `isAuth` to subscribe when user logs in and unsubscribe when user logs out
- Updated "Adopt Pet" button:
  - Disabled when `!isEligibleForAdoption`
  - Provides visual feedback that adoption requires prerequisites
- Cleanup: Unsubscribes from Firestore listener on component unmount

#### 3. Component: `MakeRequestDialog.vue`
**Modified:** Request modal simplified
- Props remain minimal:
  - `action: 'visit' | 'adopt'`
  - `paw: Paw`
  - `user: User | null`
- Adoption request UI shows standard instructions
- "Send" button disabled only for visit requests without time selection
- No eligibility check in dialog since "Adopt Pet" button in parent is already disabled when not eligible
- Simpler user experience - eligibility enforcement handled at the page level

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
   - Modal shows standard adoption instructions

4. **Attempting to adopt without eligibility**
   - "Adopt Pet" button remains disabled (cannot open modal)
   - If somehow bypassed (direct API call), backend rejects with 403
   - Frontend shows error via snackbar notification

5. **After admin fulfills a visit request**
   - Real-time Firestore listener automatically updates visit count
   - Progress bar updates to reflect new state
   - "Adopt Pet" button enables when 5th visit is fulfilled

### Technical Notes

- **Authentication Required:** Both frontend component display and backend API endpoints require authenticated user
- **Real-time Updates:** Uses Firestore `onSnapshot()` for live visit count updates
- **Direct Firestore Access:** Frontend reads fulfilled visits directly (no API endpoint needed) following project's read pattern
- **Write Operations via API:** Adoption requests still validated server-side in `sendRequest.js`
- **Firestore Queries:** Uses compound queries with 4 conditions (userId, pawId, type='visit', status='fulfilled')
- **Error Handling:** Backend returns descriptive error messages that frontend displays via existing snackbar system
- **State Management:** Visit count is component-level state (not in Pinia store) as it's page-specific data
- **Memory Management:** Firestore subscription properly cleaned up on unmount and logout

### Future Enhancements (Not Implemented)
- Caching visit count to reduce Firestore reads (though onSnapshot is efficient)
- Admin interface to configure required visit threshold (currently hardcoded to 5)
- Badge/achievement system for reaching milestones
- Email notification when user becomes eligible

### Files Modified/Created

**Created:**
- `/src/components/VisitCounter.vue` - New component

**Modified:**
- `/api/sendRequest.js` - Added eligibility check
- `/src/views/Paw.vue` - Integrated counter with Firestore subscription
- `/src/components/MakeRequestDialog.vue` - Simplified (removed redundant eligibility UI)

### Testing Checklist
- [ ] Unauthenticated users don't see visit counter
- [ ] Authenticated users see visit counter with correct count
- [ ] Progress bar displays correct percentage and color
- [ ] Adopt button disabled when visitCount < 5
- [ ] Adopt button enabled when visitCount >= 5
- [ ] Backend rejects adoption request when visitCount < 5
- [ ] Backend allows adoption request when visitCount >= 5
- [ ] Error message displays correct visit count
- [ ] Visit counter updates in real-time when admin fulfills a visit
- [ ] Firestore subscription cleanup on logout and unmount
- [ ] Modal shows standard adoption instructions (no eligibility warning needed)
