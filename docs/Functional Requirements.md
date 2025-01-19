## Functional Requirements

### Authentication
- A user should be able to authenticate in the app via Google authentication.

### Browse adoptable pets
- An auth-ed & non-auth-ed user should be able to browse list of pets.
- An auth-ed & non-auth-ed user should be able to view detailed information of a specific pet.

### Request visits
- An auth-ed user should be able to make a visit request to see a pet, entering date and time.
- Non-auth-ed user shouldn't be able to make a visit request to see a pet. Instead, a request for login should be shown.

### Request adoption
- An auth-ed user should be able to make an adoption request to adopt a pet.
  - Adoption should be allowed for users that visited (has approved visit requests) the pet 5 times.
  - A pet page shows a counter of visits for logged in user.
- Non-auth-ed user shouldn't be able to make an adoption request to adopt a pet.

### User page
- An auth-ed user should be able to see a list of requests he made.
  - List should display information about requests: type (visit/adoption), pet name, date, status (pending/approved/rejected/fulfilled/unfulfilled), comment.
 
### Admin page
- Admin user should be able to see a list of requests.
  - The list of requests.
  - The list of archive (fulfilled/unfulfilled/rejected) requests.
- Admin should be able to perform the next actions with requests:
  - Approve pending request.
  - Reject pending request, adding a comment.
  - Mark approved request fulfilled in case if visit happened/successful adoption.
  - Mark approved request unfulfilled in case if visit didn't happen/adoption didn't happen.
  - Move a request of status fulfilled/unfulfilled/rejected to archive list.
- Admin should be able to manage list of pets: create, update, delete. (not inclided in MVP)
- Admin should have a way to renew a pet in the system, due to the pet's returning to the shelter. (not inclided in MVP)
