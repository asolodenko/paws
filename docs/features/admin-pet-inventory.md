# Admin Pet Inventory Management

## Original Prompt
Implement the admin pet inventory functionality. For UI create a professional admin dashboard. Add statistics to the dashboard displayed as cards, see an example on the screenshot. Feel free to introduce new colours to the theme. As admin already has a dashboard for requests managing, consider modifying the whole UX for administration.
This is a very long task, so it may be beneficial to plan out your work clearly.

### Round 2:
remove excessive documentation files WHATS_NEW, IMPLEMENTATION_SUMMARY and admin-quick-start, keep the admin-pet-inventory file as the one to update with the latest information.

### Round 3:
Make the next changes on the UI:
- only the next fields should be required in pet form: name, breed, gender, coat color
- implement image upload instead of URL

### Round 4:
Fix axios error when sending a POST request. The message: "timeout of 5000ms exceeded". The error happens from time to time and to all the requests, not specific ones.

### Round 5:
The pet inventory table appears to miss a pet's adoption status.

### Round 6:
The adoption status issue seems to be broader than just UI inconsistency. There should be adopted pets as the dashboard shows 2 successful adoptions, but the inventory table doesn't reflect their adoption status. Investigate and fix the issue.

### Round 7:
Implement missing functionality of pet's renewal in the system.

## Overview

The admin panel has been completely redesigned with a professional dashboard interface. It now features three main sections accessible via tabs:

1. **Dashboard** - Statistics and overview
2. **Requests** - Visit and adoption request management (existing functionality)
3. **Pet Inventory** - CRUD operations for managing pets in the system

## Files Created

### Frontend Components
- `src/components/AdminDashboard.vue` - Statistics dashboard with metric cards
- `src/components/AdminRequests.vue` - Extracted requests management component
- `src/components/PetInventory.vue` - Pet table with search and actions
- `src/components/PetForm.vue` - Modal form for create/edit operations

### Backend API
- `api/createPet.js` - Create new pet endpoint
- `api/updatePet.js` - Update existing pet endpoint
- `api/deletePet.js` - Delete pet endpoint
- `api/renewPet.js` - Renew pet endpoint (mark adopted pets as available when returned to shelter)

### State Management
- `src/store/petManagement.ts` - Pinia store for pet CRUD operations

### Modified Files
- `src/views/Admin.vue` - Restructured with 3-tab navigation
- `src/plugins/vuetify.ts` - Added 4 new dashboard theme colors

## Features

### Dashboard

The dashboard provides real-time statistics through colorful card widgets:

- **Total Pets** - Count of all pets in the system
- **Pending Requests** - Number of requests awaiting admin review
- **Approved Requests** - Number of approved requests
- **Fulfilled Adoptions** - Number of successful adoptions

Additional statistics panels show:
- Request breakdown by type (visit vs. adoption)
- Rejection counts
- Total requests (all time)
- Fulfilled visits
- Active user count

### Pet Inventory Management

The Pet Inventory tab provides full CRUD functionality for managing pets:

#### Features:
- **Search/Filter** - Search pets by name, breed, or other attributes
- **Sortable Table** - Click column headers to sort
- **Add New Pet** - Create new pet entries with all required fields
- **Edit Pet** - Update existing pet information
- **Delete Pet** - Remove pets from the system (with confirmation dialog)
- **Renew Pet** - Mark adopted pets as available when they return to the shelter (visible only for adopted pets)

#### Pet Fields:
**Required fields:**
- Name* (required)
- Breed* (required)
- Gender* (required)
- Coat Color* (required)

**Optional fields:**
- Birth Date, Weight, Image (uploaded file)
- Temperament, Activity Level, Grooming Needs
- Health Condition, Food Flavor, Toy Type
- Adoption Status (available, pending, adopted - defaults to 'available')

### New Components

#### `AdminDashboard.vue`
Statistics dashboard with cards displaying key metrics. Uses new theme colors for visual appeal.

#### `AdminRequests.vue`
Extracted requests management into a separate component for better code organization.

#### `PetInventory.vue`
Table view of all pets with action buttons (edit/delete) and search functionality. Displays:
- Pet image, name, gender, breed
- Birth date, weight, health condition
- **Adoption status** with color-coded chips (green=available, amber=pending, blue=adopted)
- Edit and delete actions

#### `PetForm.vue`
Modal dialog form for creating and editing pets. Includes:
- Validation for required fields (name, breed, gender, coat color)
- Image upload with preview (converts to base64 data URL)
- Adoption status selector (available, pending, adopted)
- Dynamic mode (create vs. edit)
- Organized layout with icons
- Date picker for birth date
- Dropdowns for constrained fields (gender, health condition, adoption status)

### Backend API

Four serverless functions in `/api`:

#### `createPet.js`
- **Method:** POST
- **Auth:** Admin only (verified via custom claims)
- **Payload:** `{ petData: {...} }`
- **Validates:** Required fields (name, breed, gender, coatColor) before creation
- **Returns:** Success status and new pet ID
- **Note:** Image is stored as base64 data URL in the `img` field

#### `updatePet.js`
- **Method:** POST
- **Auth:** Admin only
- **Payload:** `{ petId: string, petData: {...} }`
- **Validates:** Pet exists before updating
- **Returns:** Success status

#### `deletePet.js`
- **Method:** POST
- **Auth:** Admin only
- **Payload:** `{ petId: string }`
- **Validates:** Pet exists before deletion
- **Returns:** Success status

#### `renewPet.js`
- **Method:** POST
- **Auth:** Admin only
- **Payload:** `{ petId: string }`
- **Validates:** Pet exists and has 'adopted' status
- **Action:** Updates pet's `adoptionStatus` to 'available', logs renewal timestamp
- **Returns:** Success status
- **Use Case:** When an adopted pet is returned to the shelter
- **Note:** Only works for pets with `adoptionStatus === 'adopted'`

All functions follow the existing pattern:
1. Verify POST request
2. Extract and verify Firebase ID token
3. Check admin custom claims
4. Validate request parameters
5. Perform database operation
6. Return success/error response

### State Management

#### `petManagement.ts` Store
New Pinia store for pet CRUD operations:

**State:**
- `pets` - Array of all pets (real-time)
- `loading` - Loading state for UI feedback
- `error` - Error messages

**Actions:**
- `fetchPets()` - Subscribe to Firestore real-time updates
- `createPet(petData)` - Create new pet via API
- `updatePet(petId, petData)` - Update pet via API
- `deletePet(petId)` - Delete pet via API
- `renewPet(petId)` - Renew pet (mark as available) via API
- `cleanup()` - Unsubscribe from Firestore listeners

### Theme Updates

New dashboard-specific colors added to `vuetify.ts`:
- `dashboardPrimary` - Blue (#1976D2)
- `dashboardSuccess` - Green (#43A047)
- `dashboardWarning` - Amber (#FFB300)
- `dashboardInfo` - Cyan (#00ACC1)

These provide visual distinction for the statistics cards.

## Usage

### Quick Start

**Prerequisites:**
- Admin user account with custom claims set (use `setCustomClaims.js`)
- Local development: Run `vercel dev` to enable API functions

**Accessing the Admin Panel:**
1. Log in as an admin user
2. Navigate to `/admin` route
3. You'll see three tabs: Dashboard, Requests, Pet Inventory

### For Administrators

1. **Navigate to Admin Panel** - Access via `/admin` route
2. **View Dashboard** - See statistics at a glance on the Dashboard tab
3. **Manage Requests** - Use the Requests tab (unchanged functionality)
4. **Manage Pets:**
   - Click "Pet Inventory" tab
   - Use "Add New Pet" button to create pets
   - Click edit icon to modify existing pets
   - Click delete icon to remove pets (confirmation required)
   - Use search bar to filter pets

### Common Tasks

**Adding a New Pet:**
1. Click "Add New Pet" button
2. Fill in required fields: Name, Breed, Gender, Coat Color
3. Optionally upload an image and fill other fields
4. Click "Create" to save

**Editing a Pet:**
1. Find the pet in the table
2. Click the pencil icon (✏️)
3. Modify fields and click "Update"

**Deleting a Pet:**
1. Click the trash icon (🗑️)
2. Confirm deletion in the dialog
3. Pet is permanently removed

**Renewing an Adopted Pet:**
1. Find the adopted pet in the table (marked with blue "Adopted" status)
2. Click the green refresh icon (🔄) - only visible for adopted pets
3. Confirm renewal in the dialog
4. Pet status changes to "Available" and can be adopted again

### Troubleshooting

**"Forbidden: User is not an admin" Error:**
Ensure your user has admin custom claims set:
```bash
node setCustomClaims.js YOUR_USER_UID
```

**API Functions Not Working Locally:**
Use `vercel dev` instead of `npm run dev`

**Form Won't Submit:**
Only name, breed, gender, and coat color are required. Fill in at least these fields before submitting.

### For Developers

**Adding Pet Validation:**
Edit validation in `api/createPet.js` and `PetForm.vue`

**Modifying Statistics:**
Edit computed properties in `AdminDashboard.vue`

**Changing Table Columns:**
Modify `headers` array in `PetInventory.vue`

**Extending Pet Model:**
1. Update `Paw.model.ts` interface
2. Add field to `PetForm.vue`
3. Update validation in `createPet.js`

## Security

- All pet CRUD operations require admin authentication
- Firebase Admin SDK verifies user tokens server-side
- Custom claims ensure only admins can modify data
- Firestore rules should restrict write access to admin users only (client-side validation)

## Round 6: Adoption Status Synchronization (Bug Fix)

### Problem Identified
The dashboard showed "2 Fulfilled Adoptions" based on request status, but the pet inventory table showed all pets as "Available". This revealed a data synchronization issue:
- **Request status** (pending → approved → fulfilled) was tracked in the `requests` collection
- **Pet adoption status** (available → pending → adopted) was tracked in the `paws` collection
- These two states were **not synchronized** - when an adoption request was fulfilled, the pet's `adoptionStatus` field was never updated

### Root Cause
The `handleRequestTransition.js` API function updated the request's status but didn't update the corresponding pet's `adoptionStatus` field.

### Solution Implemented
Modified `api/handleRequestTransition.js` to automatically sync pet adoption status when adoption requests change state:

**Adoption Request State Transitions → Pet Status Updates:**
- `approve` action → pet `adoptionStatus` = `'pending'`
- `reject` action → pet `adoptionStatus` = `'available'`
- `fulfill` action → pet `adoptionStatus` = `'adopted'`
- `unfulfill` action → pet `adoptionStatus` = `'available'`

**Implementation Details:**
1. Extract request data to check if it's an adoption request (`type === 'adopt'`)
2. Get the `pawId` from the request
3. Determine appropriate pet status based on the action
4. Update both the request status and pet's `adoptionStatus` in the database

**Code Changes:**
- Added logic to read request data before updating
- Created `petStatusUpdate` variable to track desired pet status
- Conditionally update pet document in Firestore after request update
- Only applies to adoption requests (visit requests don't affect pet status)

### Impact
- **Dashboard accuracy:** "Fulfilled Adoptions" count now matches pets marked as "adopted"
- **Data integrity:** Request state and pet state remain synchronized
- **User experience:** Pet inventory accurately reflects which pets are available, pending adoption, or already adopted
- **Admin workflow:** No manual intervention needed to update pet status after processing adoption requests

### Testing Recommendations
1. Verify that approving an adoption request marks the pet as "pending"
2. Verify that fulfilling an adoption request marks the pet as "adopted"
3. Verify that rejecting an adoption request marks the pet as "available"
4. Verify that unfulfilling an adoption request marks the pet back to "available"
5. Confirm visit requests don't affect pet adoption status

## Round 7: Pet Renewal Functionality

### Requirement
According to functional requirements: "Admin should have a way to renew a pet in the system, due to the pet's returning to the shelter."

When an adopted pet is returned to the shelter, admins need a way to make it available for adoption again without manually editing the pet's adoption status.

### Implementation

#### UI Changes (`src/components/PetInventory.vue`)
- Added **Renew button** to the actions column
- Button is **conditionally rendered** - only visible for pets with `adoptionStatus === 'adopted'`
- Uses green color and refresh icon (`mdi-refresh`)
- Tooltip: "Renew (Return to shelter)"
- Clicking opens a confirmation dialog before renewal

#### Confirmation Dialog
- Title: "Confirm Pet Renewal"
- Message: Explains that renewal will mark the pet as available again
- Actions: Cancel (grey) or Renew (green, with loading state)
- Prevents accidental renewals

#### Backend API (`api/renewPet.js`)
New serverless function that:
1. Verifies admin authentication via Firebase ID token
2. Validates that `petId` is provided
3. Checks that the pet exists in Firestore
4. **Validates adoption status** - only allows renewal for pets with `adoptionStatus === 'adopted'`
5. Updates pet document with:
   - `adoptionStatus`: 'available'
   - `renewedAt`: timestamp of renewal
   - `renewedBy`: admin user ID who performed the renewal
   - `updatedAt`: timestamp
   - `updatedBy`: admin user ID
6. Returns success/error response

**Error Handling:**
- Returns 400 if trying to renew a non-adopted pet
- Returns 404 if pet not found
- Returns 403 if user is not admin

#### Store Action (`src/store/petManagement.ts`)
Added `renewPet(petId)` action that:
- Sets loading state
- Calls `sendPOST('renewPet', { petId })`
- Handles success/error states
- Returns boolean success flag

#### Parent Component Integration (`src/views/Admin.vue`)
- Added `@renew` event handler to `PetInventory` component
- Created `handleRenewPet(petId)` function that calls store action
- Real-time updates reflect changes immediately (via Firestore subscription)

### User Flow
1. Admin views pet inventory table
2. Adopted pets show a green refresh button
3. Admin clicks refresh button
4. Confirmation dialog appears
5. Admin confirms renewal
6. Backend validates and updates pet status
7. Pet instantly appears as "Available" (real-time sync)
8. Success notification shown via snackbar

### Data Tracking
The renewal action logs:
- `renewedAt`: ISO timestamp when pet was renewed
- `renewedBy`: UID of admin who renewed the pet
- Enables audit trail of pet returns to shelter

### Business Logic
- **Only adopted pets can be renewed** - prevents status confusion
- Renewal resets adoption status to "available"
- Preserves all other pet data (name, breed, characteristics)
- Does not delete adoption history (requests remain in database)

### Security
- Admin-only operation (verified server-side via custom claims)
- Cannot be bypassed by direct Firestore access (Firestore rules should enforce this)
- Validates pet state before allowing renewal

## Future Enhancements

Potential improvements marked as "not in MVP" in requirements:
- ~~Image upload instead of URL input~~ ✅ Implemented (Round 3)
- ~~Pet availability status management~~ ✅ Implemented (Round 6 - auto-synced with request transitions)
- ~~Pet renewal system~~ ✅ Implemented (Round 7)
- Cloud storage for images (currently using base64 data URLs)
- Batch operations (delete multiple pets, bulk renewal)
- Pet history/audit trail (detailed view of renewals and adoptions)
- Export pet inventory to CSV
- Analytics charts for dashboard
- Email notifications when pets are renewed
