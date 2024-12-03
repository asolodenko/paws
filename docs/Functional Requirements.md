## Functional Requirements

### Authentication
- A user should be able to authenticate in the app via Google authentication.

### Browse adoptable pets
- An auth-ed & non-auth-ed user should be able to browse list of pets
- An auth-ed & non-auth-ed user should be able to view detailed information of a specific pet

### Request visits
- An auth-ed user should be able to make a visit request to see a pet, entering date and time
- Non-auth-ed user shouldn't be able to make a visit request to see a pet. Instead, a request for login should be shown.

### Request adoption
- An auth-ed user should be able to make an adoption request to adopt a pet.
  - Adoption should be allowed for users that visited the pet 5 times, i.e. adoption functionality is not allowed. 
  - A pet page shows a counter of visits for logged in user.
- Non-auth-ed user shouldn't be able to make an adoption request to adopt a pet.