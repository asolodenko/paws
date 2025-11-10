import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  createFirebaseAdminMocks,
  createMockRequest,
  createMockResponse,
  resetFirebaseMocks,
  mockAuth,
  mockFirestore,
  mockCollectionRef,
  mockDocRef,
  mockUser,
} from '../helpers/firebase-mocks.js'

// Apply Firebase mocks
createFirebaseAdminMocks()

// Import the handler after mocks are set up
const sendRequestModule = await import('../../api/sendRequest.js')
const sendRequest = sendRequestModule.default

describe('sendRequest API Handler', () => {
  let req
  let res

  beforeEach(() => {
    req = createMockRequest()
    res = createMockResponse()
    resetFirebaseMocks()
    vi.clearAllMocks()

    // Set up default successful mocks
    mockAuth.verifyIdToken.mockResolvedValue({ uid: 'test-user-id' })
    mockAuth.getUser.mockResolvedValue(mockUser)
    mockDocRef.get.mockResolvedValue({
      exists: true,
      data: () => ({ id: 'test-user-id', email: 'test@example.com' }),
    })
  })

  afterEach(() => {
    resetFirebaseMocks()
  })

  describe('HTTP Method Validation', () => {
    it('should reject GET requests with 405', async () => {
      req.method = 'GET'

      await sendRequest(req, res)

      expect(res.statusCode).toBe(405)
      expect(res.data).toEqual({ error: 'Method Not Allowed' })
    })

    it('should reject PUT requests with 405', async () => {
      req.method = 'PUT'

      await sendRequest(req, res)

      expect(res.statusCode).toBe(405)
      expect(res.data).toEqual({ error: 'Method Not Allowed' })
    })

    it('should reject DELETE requests with 405', async () => {
      req.method = 'DELETE'

      await sendRequest(req, res)

      expect(res.statusCode).toBe(405)
      expect(res.data).toEqual({ error: 'Method Not Allowed' })
    })

    it('should accept POST requests', async () => {
      req.method = 'POST'
      req.body = { userId: 'user1', pawId: 'paw1', type: 'adopt' }

      // Mock fulfilled visits check
      mockCollectionRef.get.mockResolvedValue({ size: 5 })

      await sendRequest(req, res)

      expect(res.statusCode).not.toBe(405)
    })
  })

  describe('Authentication', () => {
    it('should reject requests without authorization header', async () => {
      req.headers.authorization = null

      await sendRequest(req, res)

      expect(res.statusCode).toBe(401)
      expect(res.data).toEqual({ error: 'Unauthorized' })
    })

    it('should reject requests with empty authorization header', async () => {
      req.headers.authorization = ''

      await sendRequest(req, res)

      expect(res.statusCode).toBe(401)
      expect(res.data).toEqual({ error: 'Unauthorized' })
    })

    it('should reject requests with invalid token', async () => {
      mockAuth.verifyIdToken.mockRejectedValue(new Error('Invalid token'))

      req.body = { userId: 'user1', pawId: 'paw1', type: 'visit', date: '2025-01-01', time: '10:00' }

      await expect(sendRequest(req, res)).rejects.toThrow('Invalid token')
    })

    it('should verify token with Firebase Auth', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'adopt' }
      mockCollectionRef.get.mockResolvedValue({ size: 5 })

      await sendRequest(req, res)

      expect(mockAuth.verifyIdToken).toHaveBeenCalledWith('mock-id-token')
    })
  })

  describe('User Validation', () => {
    it('should reject request if user does not exist in Firestore', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: false,
      })

      req.body = { userId: 'user1', pawId: 'paw1', type: 'visit', date: '2025-01-01', time: '10:00' }

      await sendRequest(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toEqual({ error: 'Forbidden: User not found' })
    })

    it('should check user document in Firestore', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'adopt' }
      mockCollectionRef.get.mockResolvedValue({ size: 5 })

      await sendRequest(req, res)

      expect(mockFirestore.doc).toHaveBeenCalledWith('users/test-user-id')
    })
  })

  describe('Request Parameter Validation', () => {
    it('should reject request without userId', async () => {
      req.body = { pawId: 'paw1', type: 'visit', date: '2025-01-01', time: '10:00' }

      await sendRequest(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data).toEqual({ error: 'Missing one of the required parameters' })
    })

    it('should reject request without pawId', async () => {
      req.body = { userId: 'user1', type: 'visit', date: '2025-01-01', time: '10:00' }

      await sendRequest(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data).toEqual({ error: 'Missing one of the required parameters' })
    })

    it('should reject request without type', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', date: '2025-01-01', time: '10:00' }

      await sendRequest(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data).toEqual({ error: 'Missing one of the required parameters' })
    })

    it('should reject request with null userId', async () => {
      req.body = { userId: null, pawId: 'paw1', type: 'visit', date: '2025-01-01', time: '10:00' }

      await sendRequest(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data).toEqual({ error: 'Missing one of the required parameters' })
    })

    it('should reject request with empty string userId', async () => {
      req.body = { userId: '', pawId: 'paw1', type: 'visit', date: '2025-01-01', time: '10:00' }

      await sendRequest(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data).toEqual({ error: 'Missing one of the required parameters' })
    })
  })

  describe('Visit Request Validation', () => {
    it('should reject visit request without date', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'visit', time: '10:00' }

      await sendRequest(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data).toEqual({ error: 'Missing one of the required parameters' })
    })

    it('should reject visit request without time', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'visit', date: '2025-01-01' }

      await sendRequest(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data).toEqual({ error: 'Missing one of the required parameters' })
    })

    it('should reject visit request with empty date', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'visit', date: '', time: '10:00' }

      await sendRequest(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data).toEqual({ error: 'Missing one of the required parameters' })
    })

    it('should reject visit request with null time', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'visit', date: '2025-01-01', time: null }

      await sendRequest(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data).toEqual({ error: 'Missing one of the required parameters' })
    })

    it('should accept valid visit request', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'visit', date: '2025-01-01', time: '10:00' }

      await sendRequest(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data.message).toBe('Request received successfully')
    })
  })

  describe('Adoption Eligibility', () => {
    it('should reject adoption with 0 fulfilled visits', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'adopt' }

      mockCollectionRef.get.mockResolvedValue({ size: 0 })

      await sendRequest(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data.error).toContain('Adoption not allowed')
      expect(res.data.error).toContain('Current visits: 0/5')
    })

    it('should reject adoption with 1 fulfilled visit', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'adopt' }

      mockCollectionRef.get.mockResolvedValue({ size: 1 })

      await sendRequest(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data.error).toContain('Current visits: 1/5')
    })

    it('should reject adoption with 4 fulfilled visits', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'adopt' }

      mockCollectionRef.get.mockResolvedValue({ size: 4 })

      await sendRequest(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data.error).toContain('Current visits: 4/5')
    })

    it('should allow adoption with exactly 5 fulfilled visits', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'adopt' }

      mockCollectionRef.get.mockResolvedValue({ size: 5 })

      await sendRequest(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should allow adoption with more than 5 fulfilled visits', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'adopt' }

      mockCollectionRef.get.mockResolvedValue({ size: 10 })

      await sendRequest(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should query for fulfilled visits with correct filters', async () => {
      req.body = { userId: 'user123', pawId: 'paw456', type: 'adopt' }

      mockCollectionRef.get.mockResolvedValue({ size: 5 })

      await sendRequest(req, res)

      expect(mockFirestore.collection).toHaveBeenCalledWith('requests')
      expect(mockCollectionRef.where).toHaveBeenCalledWith('userId', '==', 'user123')
      expect(mockCollectionRef.where).toHaveBeenCalledWith('pawId', '==', 'paw456')
      expect(mockCollectionRef.where).toHaveBeenCalledWith('type', '==', 'visit')
      expect(mockCollectionRef.where).toHaveBeenCalledWith('status', '==', 'fulfilled')
    })

    it('should handle error when checking adoption eligibility', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'adopt' }

      mockCollectionRef.get.mockRejectedValue(new Error('Database error'))

      await sendRequest(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toEqual({ error: 'Error checking adoption eligibility' })
    })
  })

  describe('Request Creation', () => {
    it('should create request with pending status by default', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'visit', date: '2025-01-01', time: '10:00' }

      await sendRequest(req, res)

      expect(mockDocRef.set).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'pending',
        }),
      )
    })

    it('should use custom status if provided', async () => {
      req.body = {
        userId: 'user1',
        pawId: 'paw1',
        type: 'adopt',
        status: 'approved',
      }

      mockCollectionRef.get.mockResolvedValue({ size: 5 })

      await sendRequest(req, res)

      expect(mockDocRef.set).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'approved',
        }),
      )
    })

    it('should add document ID to request data', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'visit', date: '2025-01-01', time: '10:00' }

      await sendRequest(req, res)

      expect(mockDocRef.set).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'mock-doc-id',
        }),
      )
    })

    it('should add createdAt timestamp if not provided', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'visit', date: '2025-01-01', time: '10:00' }

      await sendRequest(req, res)

      expect(mockDocRef.set).toHaveBeenCalledWith(
        expect.objectContaining({
          createdAt: expect.any(String),
        }),
      )
    })

    it('should use custom createdAt if provided', async () => {
      const customDate = '2024-12-01T00:00:00.000Z'
      req.body = {
        userId: 'user1',
        pawId: 'paw1',
        type: 'visit',
        date: '2025-01-01',
        time: '10:00',
        createdAt: customDate,
      }

      await sendRequest(req, res)

      expect(mockDocRef.set).toHaveBeenCalledWith(
        expect.objectContaining({
          createdAt: customDate,
        }),
      )
    })

    it('should preserve all request body fields', async () => {
      req.body = {
        userId: 'user1',
        pawId: 'paw1',
        type: 'visit',
        date: '2025-01-01',
        time: '10:00',
        note: 'Special request',
      }

      await sendRequest(req, res)

      expect(mockDocRef.set).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 'user1',
          pawId: 'paw1',
          type: 'visit',
          date: '2025-01-01',
          time: '10:00',
          note: 'Special request',
        }),
      )
    })

    it('should return success with document ID', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'visit', date: '2025-01-01', time: '10:00' }

      await sendRequest(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual({
        message: 'Request received successfully',
        id: 'mock-doc-id',
      })
    })

    it('should set CORS header', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'visit', date: '2025-01-01', time: '10:00' }

      await sendRequest(req, res)

      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*')
    })
  })

  describe('Error Handling', () => {
    it('should handle Firestore write errors', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'visit', date: '2025-01-01', time: '10:00' }

      mockDocRef.set.mockRejectedValue(new Error('Firestore write failed'))

      await sendRequest(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toEqual({ error: 'Internal Server Error' })
    })

    it('should log errors to console', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'visit', date: '2025-01-01', time: '10:00' }

      mockDocRef.set.mockRejectedValue(new Error('Test error'))

      await sendRequest(req, res)

      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle request type other than visit or adopt', async () => {
      req.body = { userId: 'user1', pawId: 'paw1', type: 'unknown' }

      await sendRequest(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle adoption for different pet than visited', async () => {
      req.body = { userId: 'user1', pawId: 'paw-different', type: 'adopt' }

      mockCollectionRef.get.mockResolvedValue({ size: 5 })

      await sendRequest(req, res)

      expect(mockCollectionRef.where).toHaveBeenCalledWith('pawId', '==', 'paw-different')
    })

    it('should handle very long userId', async () => {
      const longId = 'a'.repeat(1000)
      req.body = { userId: longId, pawId: 'paw1', type: 'adopt' }

      mockCollectionRef.get.mockResolvedValue({ size: 5 })

      await sendRequest(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle special characters in IDs', async () => {
      req.body = {
        userId: 'user@#$%',
        pawId: 'paw-123_abc',
        type: 'visit',
        date: '2025-01-01',
        time: '10:00',
      }

      await sendRequest(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle date and time for adopt requests even if provided', async () => {
      req.body = {
        userId: 'user1',
        pawId: 'paw1',
        type: 'adopt',
        date: '2025-01-01',
        time: '10:00',
      }

      mockCollectionRef.get.mockResolvedValue({ size: 5 })

      await sendRequest(req, res)

      expect(res.statusCode).toBe(200)
      expect(mockDocRef.set).toHaveBeenCalledWith(
        expect.objectContaining({
          date: '2025-01-01',
          time: '10:00',
        }),
      )
    })
  })
})
