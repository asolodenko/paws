# updatePet API - Test Summary

## Overview
The `updatePet` API function allows admin users to modify existing pet records. It supports partial updates, validates pet existence, and tracks update history with timestamps and admin IDs.

## Test Coverage

### Total Test Cases: 64

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

### 4. Request Body Validation (6 tests)
- ✅ Rejects request without petId
- ✅ Rejects request without petData
- ✅ Rejects request with null petId
- ✅ Rejects request with empty string petId
- ✅ Rejects request with null petData
- ✅ Accepts valid petId and petData

### 5. Pet Existence Validation (3 tests)
- ✅ Returns 404 if pet does not exist
- ✅ Queries Firestore with correct petId
- ✅ Gets pet document before updating

### 6. Pet Update (5 tests)
- ✅ Updates pet in Firestore
- ✅ Adds updatedAt timestamp
- ✅ Adds updatedBy field with admin user ID
- ✅ Preserves petData fields
- ✅ Returns success response

### 7. Partial Updates (5 tests)
- ✅ Updates only name field
- ✅ Updates only breed field
- ✅ Updates multiple fields
- ✅ Allows empty petData object (only adds metadata)
- ✅ Supports selective field updates

### 8. Error Handling (4 tests)
- ✅ Handles Firestore read errors
- ✅ Handles Firestore update errors
- ✅ Logs errors to console
- ✅ Handles database connection errors

### 9. Edge Cases (13 tests)
- ✅ Handles very long pet name
- ✅ Handles special characters in pet data
- ✅ Handles Unicode characters
- ✅ Handles numeric values
- ✅ Handles boolean values
- ✅ Handles array values
- ✅ Handles nested objects
- ✅ Handles null values in petData
- ✅ Handles updating to empty string
- ✅ Handles very long petId
- ✅ Handles special characters in petId
- ✅ Preserves updatedBy across multiple updates
- ✅ Handles various data types

## Update Behavior

### Partial Update Support
- Can update any subset of fields
- Can update a single field
- Empty petData object only adds metadata (updatedAt, updatedBy)
- Original fields not included in update remain unchanged

### Auto-Generated Fields
- **updatedAt** (ISO timestamp) - When the pet was last updated
- **updatedBy** (string) - Admin user ID who made the update

### Supported Field Types
- **Strings**: name, breed, description, etc.
- **Numbers**: age, weight, etc.
- **Booleans**: isVaccinated, isNeutered, etc.
- **Arrays**: photos, tags, etc.
- **Objects**: medical records, etc.
- **Null**: Can set fields to null

## Key Business Rules Tested

1. **Admin-Only Access**: Only users with admin custom claims can update pets
2. **Pet Existence**: Validates pet exists before attempting update
3. **Partial Updates**: Supports updating any subset of fields
4. **Audit Trail**: Tracks who updated the pet and when
5. **Flexible Updates**: Accepts any field types and structures
6. **Metadata Preservation**: Always adds updatedAt and updatedBy

## Error Scenarios Covered

- Missing authentication token
- Invalid authentication token
- Non-admin user access attempts
- Missing petId or petData
- Null or empty parameters
- Pet not found (404)
- Firestore read failures
- Firestore update failures
- Database connection errors

## Edge Cases Covered

- Very long strings (1000+ characters)
- Special characters, XSS attempts
- Unicode characters
- Various data types (numbers, booleans, arrays, objects)
- Null values
- Empty strings
- Nested complex objects
- Multiple consecutive updates
- Empty petData (metadata-only update)

## Potential Issues & Recommendations

1. **No input sanitization**: Accepts unvalidated content including XSS vectors
2. **No data type validation**: Could change field types unintentionally
3. **No field protection**: Could accidentally update critical system fields
4. **No validation rules**: Can update to invalid states (e.g., negative age)
5. **No change tracking**: Overwrites previous values without history
6. **Empty petData**: While allowed, adds overhead with no content changes
7. **Concurrent updates**: No optimistic locking or conflict detection

## Response Format

### Success (200)
```json
{
  "success": true,
  "message": "Pet updated successfully"
}
```

### Error (400/401/403/404/500)
```json
{
  "message": "Error description"
}
```

## Update Examples

### Single Field Update
```json
{
  "petId": "pet123",
  "petData": {
    "name": "New Name"
  }
}
```

### Multiple Fields Update
```json
{
  "petId": "pet123",
  "petData": {
    "name": "Updated Name",
    "breed": "Beagle",
    "temperament": "playful",
    "adoptionStatus": "pending"
  }
}
```

### Complex Data Update
```json
{
  "petId": "pet123",
  "petData": {
    "medical": {
      "vaccinations": ["rabies", "distemper"],
      "lastCheckup": "2024-01-01"
    },
    "photos": ["photo1.jpg", "photo2.jpg"]
  }
}
```

## Running the Tests

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run only updatePet tests
npm test updatePet
```
