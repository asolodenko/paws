# Adoption Eligibility and Visit Counter Implementation

## User Request

> Implement the adoption eligibility check feature for a user. Also implement displaying visit counter on a paw page. I don't have exact design for the counter, but I want it to be a progress bar.

## Implementation Summary

This feature implements a visit-based adoption eligibility system where users must complete 5 fulfilled visits before being allowed to adopt a pet. A visual progress bar tracks their progress.

### Changes Made

#### 1. New Request Store (`src/store/request.ts`)
Created a new Pinia store to manage request-related data and eligibility logic:
- **`subscribeToUserRequests(userId)`**: Subscribes to real-time updates of user's requests from Firestore
- **`getFulfilledVisitCount(userId, pawId)`**: Counts fulfilled visit requests for a specific user and pet
- **`isEligibleToAdopt(userId, pawId)`**: Returns `true` if user has ≥5 fulfilled visits for the pet
- **`cleanup()`**: Unsubscribes from Firestore listeners and clears state

#### 2. Paw Detail Page (`src/views/Paw.vue`)
Enhanced the pet detail page to display visit progress:
- Added a **progress bar card** showing:
  - Current visit count out of 5 (e.g., "3 / 5 visits completed")
  - Visual progress bar using `VProgressLinear` (green when complete, primary color otherwise)
  - Percentage completion displayed on the bar
  - Success message when eligible: "You're eligible to adopt [Pet Name]!"
  - Helper text indicating remaining visits needed
- Integrated `useRequestStore()` to fetch and subscribe to user request data
- Added cleanup on component unmount to prevent memory leaks

#### 3. Make Request Dialog (`src/components/MakeRequestDialog.vue`)
Updated the adoption request dialog to enforce eligibility:
- **Disabled "Send" button** when requesting adoption if user has <5 fulfilled visits
- Added **warning message** showing current visit count when not eligible: 
  - "To adopt [Pet Name], you need to complete 5 visits first. You currently have X fulfilled visit(s)."
- Added **success message** when eligible:
  - "You're eligible to adopt [Pet Name]!"
- Computed properties for real-time eligibility checks using the request store

#### 4. Documentation Updates
- Updated `docs/system/functional-requirements.md` to mark the following as completed:
  - "Adoption should be allowed for users that visited (has fulfilled visit requests) the pet 5 times" ✅
  - "A pet page shows a counter of visits for logged in user" ✅

### Technical Details

**Data Flow:**
1. User authenticates → Request store subscribes to their requests in Firestore
2. On Paw page load → Store calculates fulfilled visit count for current pet
3. Progress bar renders based on count (0-5 range)
4. MakeRequestDialog checks eligibility before allowing adoption requests

**State Management:**
- Uses Firestore real-time listeners for instant updates when requests change status
- Properly cleans up subscriptions to prevent memory leaks
- Computed properties ensure UI reactivity to data changes

**UI/UX:**
- Progress bar provides clear visual feedback (Vuetify `VProgressLinear`)
- Color coding: Primary (blue/green theme) for progress, Success (green) when complete
- Informative messages guide users on what's required
- Disabled state prevents invalid adoption requests

### Files Modified
- `src/store/request.ts` (new file)
- `src/views/Paw.vue`
- `src/components/MakeRequestDialog.vue`
- `docs/system/functional-requirements.md`

### Future Enhancements
- Consider adding a historical view of fulfilled visits
- Add notification when user reaches 5 visits
- Allow admins to configure the required visit threshold
