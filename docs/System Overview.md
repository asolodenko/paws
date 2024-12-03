## Project Summary

**The Paws** is an adoption app that is designed to streamline the pet adoption process by allowing users to view, request visits, and ultimately adopt pets. It also supports admin features for managing adoption requests and approvals.
### Main Features:
- Browse adoptable pets
- Request visits and adoption approvals
- Admin panel for handling requests and approvals

### Target Audience:
  General users and admin staff of adoption centers.

## System Architecture

###	Frontend:
-	Framework: Vue 3 (SPA with routing using Vue Router, state management with Pinia)
-	Design: Component-driven architecture with reusable UI elements
-	Authentication: Firebase Authentication for Google-based login
### Backend:
-	API: Serverless functions using Vercel for request processing
-	Database: Firestore for storing pet data, user profiles, and adoption requests
### Deployment:
-	CI/CD: Vercel integration for continuous deployment with environment-based configurations
### Environment Setup:
-	Firebase configuration, API keys, and environment variables are managed for each environment (development, staging, production).

##  Data Flow & Communication

### Frontend-Backend Communication:
- API Requests: Triggered by user actions (e.g., submitting an adoption request)
- Firebase Firestore: Direct read/write for data (pets, users) and for maintaining stateful data like requests
- Authentication: User session managed by Firebase Authentication with role-based access for admins
### User Flow:
- Users can browse pets, request visits or adoption and monitor request statuses.
- Admins log in, review requests, and can approve or reject each.

## Key Components

### User Interface:
-	Pages: Home, Login, Pets List, Pet Detail, Account, Admin Dashboard
-	Reusable Components: PetCard, RequestForm, UserAvatar
###	API Functions:
-	Request Handling: createVisitRequest, approveRequest, rejectRequest
### Store Management (Pinia):
-	Modules: User, Pets, Requests, Admin

## Security & Permissions

- Firebase Authentication: Manages user sessions and access control.
- Firestore Rules: Used to restrict access to collections based on roles (user vs admin).
- Environment Variable Management: Sensitive data like API keys are set up as environment variables through .env files and managed by Vercel’s environment configuration.

## Deployment & CI/CD

###	Vercel:
- Set up to auto-deploy on pushes to specific branches (develop, staging, master).
-	Separate Firebase projects for each environment to isolate data and access.
###	Testing:
-	Local testing and staging environments ensure reliable production releases.
###	Versioning:
-	Feature branches merged into main branches after code reviews and testing.