## Project Summary

**The Paws** is an adoption app that is designed to streamline the pet adoption process by allowing users to view, request visits, and ultimately adopt pets. It also supports admin features for managing adoption requests and approvals.
### Main Features:
- Browse adoptable pets
- Request visits and adoption approvals
- Admin panel for handling requests and approvals
- Target Audience: General users and admin staff of adoption centers.

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