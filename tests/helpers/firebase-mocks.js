import { vi } from 'vitest'

/**
 * Mock Firebase Admin SDK
 * Provides mock implementations for all Firebase Admin functions used in API handlers
 */

// Mock Firestore document reference
export const mockDocRef = {
  id: 'mock-doc-id',
  set: vi.fn().mockResolvedValue({}),
  get: vi.fn().mockResolvedValue({
    exists: true,
    data: () => ({ id: 'mock-doc-id', name: 'Test' }),
  }),
  update: vi.fn().mockResolvedValue({}),
  delete: vi.fn().mockResolvedValue({}),
}

// Mock Firestore collection reference
export const mockCollectionRef = {
  doc: vi.fn((id) => {
    if (id) {
      return { ...mockDocRef, id }
    }
    return mockDocRef
  }),
  add: vi.fn().mockResolvedValue(mockDocRef),
  where: vi.fn().mockReturnThis(),
  get: vi.fn().mockResolvedValue({
    size: 5,
    docs: [],
    empty: false,
  }),
}

// Mock Firestore
export const mockFirestore = {
  collection: vi.fn(() => mockCollectionRef),
  doc: vi.fn(() => mockDocRef),
}

// Mock Auth user
export const mockUser = {
  uid: 'test-user-id',
  email: 'test@example.com',
  customClaims: { admin: false },
}

export const mockAdminUser = {
  uid: 'admin-user-id',
  email: 'admin@example.com',
  customClaims: { admin: true },
}

// Mock decoded token
export const mockDecodedToken = {
  uid: 'test-user-id',
  email: 'test@example.com',
}

// Mock Auth
export const mockAuth = {
  verifyIdToken: vi.fn().mockResolvedValue(mockDecodedToken),
  getUser: vi.fn().mockResolvedValue(mockUser),
}

// Mock App
export const mockApp = {}

// Create Firebase Admin mocks
export const createFirebaseAdminMocks = () => {
  vi.mock('firebase-admin/app', () => ({
    initializeApp: vi.fn(),
    getApps: vi.fn(() => []),
    cert: vi.fn((config) => config),
    getApp: vi.fn(() => mockApp),
  }))

  vi.mock('firebase-admin/auth', () => ({
    getAuth: vi.fn(() => mockAuth),
  }))

  vi.mock('firebase-admin/firestore', () => ({
    getFirestore: vi.fn(() => mockFirestore),
  }))
}

/**
 * Create mock Express request object
 */
export const createMockRequest = (overrides = {}) => ({
  method: 'POST',
  headers: {
    authorization: 'mock-id-token',
    ...overrides.headers,
  },
  body: {},
  ...overrides,
})

/**
 * Create mock Express response object
 */
export const createMockResponse = () => {
  const res = {
    statusCode: 200,
    data: null,
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
  }

  res.status.mockImplementation((code) => {
    res.statusCode = code
    return res
  })

  res.json.mockImplementation((data) => {
    res.data = data
    return res
  })

  res.send.mockImplementation((data) => {
    res.data = data
    return res
  })

  return res
}

/**
 * Reset all Firebase Admin mocks to their default state
 * This should be called in afterEach to prevent state pollution between tests
 */
export const resetFirebaseMocks = () => {
  // Clear all mock call history and instances
  vi.clearAllMocks()
  
  // Reset mockDocRef to default implementations
  mockDocRef.set.mockResolvedValue({})
  mockDocRef.get.mockResolvedValue({
    exists: true,
    data: () => ({ id: 'mock-doc-id', name: 'Test' }),
  })
  mockDocRef.update.mockResolvedValue({})
  mockDocRef.delete.mockResolvedValue({})
  
  // Reset mockCollectionRef to default implementations
  mockCollectionRef.doc.mockImplementation((id) => {
    if (id) {
      return { ...mockDocRef, id }
    }
    return mockDocRef
  })
  mockCollectionRef.add.mockResolvedValue(mockDocRef)
  mockCollectionRef.where.mockReturnThis()
  mockCollectionRef.get.mockResolvedValue({
    size: 5,
    docs: [],
    empty: false,
  })
  
  // Reset mockAuth to default implementations
  mockAuth.verifyIdToken.mockResolvedValue(mockDecodedToken)
  mockAuth.getUser.mockResolvedValue(mockUser)
  
  // Reset mockFirestore to default implementations
  mockFirestore.collection.mockReturnValue(mockCollectionRef)
  mockFirestore.doc.mockReturnValue(mockDocRef)
}
