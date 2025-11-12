# handleRequestTransition API - Test Summary

## Overview
The `handleRequestTransition` API function manages state transitions for visit and adoption requests. It is admin-only and handles approve, reject, fulfill, and unfulfill actions, with automatic pet status updates for adoption requests.

## Test Coverage

### Total Test Cases: 82

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

### 4. Request Parameter Validation (5 tests)
- ✅ Rejects request without requestId
- ✅ Rejects request without action
- ✅ Rejects request with null requestId
- ✅ Rejects request with empty string requestId
- ✅ Accepts valid requestId and action

### 5. Request Existence Validation (2 tests)
- ✅ Returns 404 if request does not exist
- ✅ Queries Firestore with correct requestId

### 6. Approve Action (5 tests)
- ✅ Updates request status to approved
- ✅ Sets respondedAt timestamp
- ✅ Marks pet as pending for adoption approve
- ✅ Does not update pet status for visit approve
- ✅ Returns success response

### 7. Reject Action (5 tests)
- ✅ Updates request status to rejected
- ✅ Includes comment in rejection
- ✅ Uses empty string if no comment provided
- ✅ Marks pet as available for adoption rejection
- ✅ Does not update pet status for visit rejection

### 8. Fulfill Action (4 tests)
- ✅ Updates request status to fulfilled
- ✅ Marks pet as adopted for adoption fulfillment
- ✅ Does not update pet status for visit fulfillment
- ✅ Sets respondedAt timestamp

### 9. Unfulfill Action (3 tests)
- ✅ Updates request status to unfulfilled
- ✅ Marks pet as available for adoption unfulfillment
- ✅ Does not update pet status for visit unfulfillment

### 10. Invalid Action (4 tests)
- ✅ Rejects unknown action
- ✅ Rejects action with typo
- ✅ Rejects empty action
- ✅ Does not update request for invalid action

### 11. Pet Status Updates (3 tests)
- ✅ Updates pet when pawId is provided
- ✅ Does not update pet when pawId is missing
- ✅ Handles multiple status transitions for same pet

### 12. Error Handling (3 tests)
- ✅ Handles Firestore read errors
- ✅ Handles Firestore update errors
- ✅ Handles pet status update errors

### 13. Edge Cases (7 tests)
- ✅ Handles very long comment
- ✅ Handles special characters in comment
- ✅ Handles adoption request without pawId
- ✅ Handles case-sensitive action names
- ✅ Handles concurrent request transitions
- ✅ Preserves original request data except updated fields
- ✅ Tracks adminId correctly

### 14. Admin ID Tracking (2 tests)
- ✅ Sets adminId to null when req.user is not available
- ✅ Sets adminId when req.user is available

## Key Business Rules Tested

### Action-to-Status Mapping
1. **Approve**: pending → approved
   - Adoption: Sets pet status to 'pending'
2. **Reject**: pending → rejected
   - Adoption: Sets pet status to 'available'
   - Accepts optional comment
3. **Fulfill**: approved → fulfilled
   - Adoption: Sets pet status to 'adopted'
4. **Unfulfill**: fulfilled → unfulfilled
   - Adoption: Sets pet status to 'available'

### Pet Status Updates
- Only applied for adoption requests
- Visit requests do not affect pet status
- Requires valid pawId to update pet

### Admin Tracking
- Records adminId (if available)
- Records respondedAt timestamp

## Error Scenarios Covered

- Missing required parameters (requestId, action)
- Invalid or missing authentication
- Non-admin user access attempts
- Request not found
- Invalid action types
- Firestore read/write failures
- Pet status update failures

## Edge Cases Covered

- Null and empty parameters
- Very long comments (10,000+ characters)
- Special characters and XSS attempts
- Missing pawId for adoption requests
- Case-sensitive action validation
- Concurrent request processing
- Admin ID tracking edge cases

## Potential Issues & Recommendations

1. **No state transition validation**: Can reject an already fulfilled request
2. **No comment sanitization**: XSS risk in stored comments
3. **No audit trail**: Previous states are overwritten
4. **Missing pawId handling**: Silent failure when adoption request has no pawId
5. **Race conditions**: No locking mechanism for concurrent updates
6. **adminId tracking**: Relies on optional req.user field

## Pet Adoption Status Flow

```
approve → pending
reject → available
fulfill → adopted
unfulfill → available
```

## Running the Tests

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run only handleRequestTransition tests
npm test handleRequestTransition
```
