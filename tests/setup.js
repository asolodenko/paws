import { vi } from 'vitest'

// Set up environment variables for testing
process.env.FIREBASE_PROJECT_ID = 'test-project-id'
process.env.FIREBASE_CLIENT_EMAIL = 'test@test-project.iam.gserviceaccount.com'
process.env.FIREBASE_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC\n-----END PRIVATE KEY-----\n'

// Global test setup
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
}
