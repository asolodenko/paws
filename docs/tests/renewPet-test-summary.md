# renewPet API - Test Summary

## Overview
The `renewPet` API function allows admin users to return adopted pets back to available status, making them adoptable again. This is specifically for pets that have been adopted but are being returned to the system.

## Test Coverage

### Total Test Cases: 66

## Test Categories

### 1. HTTP Method Validation (4 tests)
- ✅ Rejects GET requests with 405
- ✅ Rejects PUT requests with 405
- ✅ Rejects DELETE requests with 405
- ✅ Accepts POST requests

### 2. Authentication (4 tests)
- ✅ Rejects requests without authorization header
- ✅ Rejects requests with empty authorization header
- ✅ Verifies token with Firebase Auth
- ✅ Rejects requests with invalid token

### 3. Admin Authorization (4 tests)
- ✅ Rejects requests from non-admin users
- ✅ Rejects requests from users without customClaims
- ✅ Rejects requests from users with admin: false
- ✅ Accepts requests from admin users

### 4. Request Body Validation (5 tests)
- ✅ Rejects request without petId
- ✅ Rejects request with null petId
- ✅ Rejects request with undefined petId
- ✅ Rejects request with empty string petId
- ✅ Accepts valid petId

### 5. Pet Existence Validation (3 tests)
- ✅ Returns 404 if pet does not exist
- ✅ Queries Firestore with correct petId
- ✅ Gets pet document before renewing

### 6. Adoption Status Validation (7 tests)
- ✅ Rejects renewal of available pets
- ✅ Rejects renewal of pending pets
- ✅ Allows renewal of adopted pets
- ✅ Handles pets without adoptionStatus field
- ✅ Rejects renewal with null adoptionStatus
- ✅ Rejects renewal with invalid adoptionStatus
- ✅ Status validation is case-sensitive

### 7. Pet Renewal (6 tests)
- ✅ Updates adoptionStatus to available
- ✅ Adds renewedAt timestamp
- ✅ Adds renewedBy field with admin user ID
- ✅ Adds updatedAt timestamp
- ✅ Adds updatedBy field with admin user ID
- ✅ Returns success response
- ✅ Does not update pet if not adopted

### 8. Error Handling (5 tests)
- ✅ Handles Firestore read errors
- ✅ Handles Firestore update errors
- ✅ Logs errors to console
- ✅ Handles database connection errors
- ✅ Handles permission errors

### 9. Edge Cases (9 tests)
- ✅ Handles very long petId
- ✅ Handles special characters in petId
- ✅ Handles UUID-style petId
- ✅ Handles numeric petId
- ✅ Handles concurrent renewal requests
- ✅ Handles whitespace in petId
- ✅ Handles extra fields in request body
- ✅ Case-sensitive adoption status check
- ✅ Various petId formats

### 10. Business Logic (3 tests)
- ✅ Preserves renewal history
- ✅ Allows multiple renewals of the same pet
- ✅ Makes pet available after renewal

### 11. Authorization Flow (4 tests)
- ✅ Checks authentication before checking pet existence
- ✅ Checks admin status before checking pet existence
- ✅ Checks parameters before checking pet existence
- ✅ Checks pet existence before validating adoption status

### 12. Timestamp Consistency (2 tests)
- ✅ Uses same timestamp format for renewedAt and updatedAt
- ✅ Creates valid ISO timestamp

## Key Business Rules Tested

1. **Admin-Only Access**: Only users with admin custom claims can renew pets
2. **Adopted-Only Renewal**: Can only renew pets with `adoptionStatus: 'adopted'`
3. **Status Transition**: adopted → available
4. **Audit Trail**: Tracks renewal history with timestamps and admin IDs
5. **Repeatable**: Same pet can be renewed multiple times
6. **Case-Sensitive**: Adoption status must exactly match 'adopted'

## Renewal Behavior

### Status Requirements
- ✅ **Allowed**: adoptionStatus === 'adopted'
- ❌ **Blocked**: adoptionStatus === 'available'
- ❌ **Blocked**: adoptionStatus === 'pending'
- ❌ **Blocked**: adoptionStatus === null
- ❌ **Blocked**: adoptionStatus === undefined
- ❌ **Blocked**: adoptionStatus === 'ADOPTED' (wrong case)

### Status Transition
```
Before Renewal: adoptionStatus = 'adopted'
After Renewal:  adoptionStatus = 'available'
```

### Fields Updated
- **adoptionStatus** → 'available'
- **renewedAt** → Current ISO timestamp
- **renewedBy** → Admin user ID
- **updatedAt** → Current ISO timestamp
- **updatedBy** → Admin user ID

### Previous Values
- Previous `renewedAt` and `renewedBy` are overwritten
- No history of previous renewals is maintained

## Error Scenarios Covered

- Missing authentication token
- Invalid authentication token
- Non-admin user access attempts
- Missing or invalid petId
- Pet not found (404)
- Wrong adoption status (400)
- Missing adoption status
- Firestore read/write failures
- Database connection errors
- Permission errors

## Edge Cases Covered

- Very long petId (1000+ characters)
- Special characters in petId
- UUID and numeric formats
- Whitespace handling
- Extra request fields
- Concurrent renewals
- Case sensitivity
- Multiple renewals
- Timestamp format validation

## Potential Issues & Recommendations

1. **⚠️ No Adoption History Check**: Doesn't verify if pet was actually adopted
   - **Recommendation**: Validate adoption request history before renewal

2. **⚠️ No Related Request Handling**: Doesn't update or cancel related requests
   - **Recommendation**: Auto-unfulfill or cancel the adoption request when pet is renewed

3. **⚠️ No Renewal Reason**: No field to document why pet is being returned
   - **Recommendation**: Add optional `renewalReason` parameter

4. **⚠️ No Notification**: Original adopter isn't notified
   - **Recommendation**: Send notification to adopter

5. **⚠️ History Overwritten**: Previous renewal data is lost
   - **Recommendation**: Maintain array of renewal history

6. **⚠️ Case-Sensitive Status**: 'ADOPTED' won't match 'adopted'
   - **Recommendation**: Use case-insensitive comparison or normalize status

7. **No Validation Rules**: Can renew immediately after adoption
   - **Recommendation**: Add time-based rules or confirmation requirements

## Response Format

### Success (200)
```json
{
  "success": true,
  "message": "Pet renewed successfully - marked as available"
}
```

### Error - Wrong Status (400)
```json
{
  "message": "Pet renewal is only allowed for adopted pets",
  "currentStatus": "available"
}
```

### Error - Not Found (404)
```json
{
  "message": "Pet not found"
}
```

### Error - Unauthorized (401/403)
```json
{
  "error": "Unauthorized"
}
// or
{
  "message": "Forbidden: User is not an admin"
}
```

## Use Cases

### Valid Renewal Scenario
1. Pet was adopted (adoptionStatus = 'adopted')
2. Adoption didn't work out
3. Admin renews pet
4. Pet becomes available again

### Renewal Flow
```
User adopts pet
  ↓ (adoption fulfilled)
Pet status = 'adopted'
  ↓ (return/renewal)
Admin renews pet
  ↓
Pet status = 'available'
  ↓
Pet available for new adoption
```

## Authorization Flow

The function follows this validation sequence:
1. Check HTTP method (POST only)
2. Verify authentication token
3. Verify admin custom claims
4. Validate petId parameter
5. Check pet existence
6. Validate adoption status = 'adopted'
7. Perform renewal update

## Running the Tests

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run only renewPet tests
npm test renewPet
```

## Recommended Enhancements

1. Add renewal reason tracking
2. Maintain renewal history array
3. Update related adoption requests
4. Send notifications to adopters
5. Add time-based renewal rules
6. Implement case-insensitive status check
7. Log renewals to audit trail
8. Add confirmation requirement for recent adoptions
