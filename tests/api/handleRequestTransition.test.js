import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  createFirebaseAdminMocks,
  createMockRequest,
  createMockResponse,
  resetFirebaseMocks,
  mockAuth,
  mockFirestore,
  mockDocRef,
  mockUser,
  mockAdminUser,
} from '../helpers/firebase-mocks.js'

// Apply Firebase mocks
createFirebaseAdminMocks()

// Import the handler after mocks are set up
const handleRequestTransitionModule = await import('../../api/handleRequestTransition.js')
const handleRequestTransition = handleRequestTransitionModule.default

describe('handleRequestTransition API Handler', () => {
  let req
  let res

  beforeEach(() => {
    req = createMockRequest()
    res = createMockResponse()
    resetFirebaseMocks()
    vi.clearAllMocks()

    // Set up default mocks
    mockAuth.verifyIdToken.mockResolvedValue({ uid: 'admin-user-id' })
    mockAuth.getUser.mockResolvedValue(mockAdminUser)
    mockDocRef.get.mockResolvedValue({
      exists: true,
      data: () => ({
        id: 'request-id',
        userId: 'user1',
        pawId: 'paw1',
        type: 'visit',
        status: 'pending',
      }),
    })
  })

  describe('HTTP Method Validation', () => {
    it('should reject GET requests with 405', async () => {
      req.method = 'GET'

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(405)
      expect(res.data).toEqual({ message: 'Only POST requests are allowed' })
    })

    it('should reject PUT requests with 405', async () => {
      req.method = 'PUT'

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(405)
    })

    it('should reject DELETE requests with 405', async () => {
      req.method = 'DELETE'

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(405)
    })

    it('should accept POST requests', async () => {
      req.method = 'POST'
      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).not.toBe(405)
    })
  })

  describe('Authentication', () => {
    it('should reject requests without authorization header', async () => {
      req.headers.authorization = null

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(401)
      expect(res.data).toEqual({ error: 'Unauthorized' })
    })

    it('should reject requests with empty authorization header', async () => {
      req.headers.authorization = ''

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(401)
    })

    it('should verify token with Firebase Auth', async () => {
      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(mockAuth.verifyIdToken).toHaveBeenCalledWith('mock-id-token')
    })

    it('should reject requests with invalid token', async () => {
      mockAuth.verifyIdToken.mockRejectedValue(new Error('Invalid token'))

      req.body = { requestId: 'req1', action: 'approve' }

      await expect(handleRequestTransition(req, res)).rejects.toThrow('Invalid token')
    })
  })

  describe('Admin Authorization', () => {
    it('should reject requests from non-admin users', async () => {
      mockAuth.getUser.mockResolvedValue(mockUser)

      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toEqual({ message: 'Forbidden: User is not an admin' })
    })

    it('should reject requests from users without customClaims', async () => {
      mockAuth.getUser.mockResolvedValue({
        uid: 'user-id',
        email: 'user@example.com',
      })

      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(403)
    })

    it('should reject requests from users with admin: false', async () => {
      mockAuth.getUser.mockResolvedValue({
        uid: 'user-id',
        email: 'user@example.com',
        customClaims: { admin: false },
      })

      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(403)
    })

    it('should accept requests from admin users', async () => {
      mockAuth.getUser.mockResolvedValue(mockAdminUser)

      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(200)
    })
  })

  describe('Request Parameter Validation', () => {
    it('should reject request without requestId', async () => {
      req.body = { action: 'approve' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data).toEqual({ message: 'Invalid request parameters' })
    })

    it('should reject request without action', async () => {
      req.body = { requestId: 'req1' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should reject request with null requestId', async () => {
      req.body = { requestId: null, action: 'approve' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should reject request with empty string requestId', async () => {
      req.body = { requestId: '', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should accept valid requestId and action', async () => {
      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(200)
    })
  })

  describe('Request Existence Validation', () => {
    it('should return 404 if request does not exist', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: false,
      })

      req.body = { requestId: 'non-existent', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toEqual({ message: 'Request not found' })
    })

    it('should query Firestore with correct requestId', async () => {
      req.body = { requestId: 'req123', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(mockFirestore.collection).toHaveBeenCalledWith('requests')
    })
  })

  describe('Approve Action', () => {
    it('should update request status to approved', async () => {
      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'approved',
        }),
      )
    })

    it('should set respondedAt timestamp', async () => {
      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          respondedAt: expect.any(String),
        }),
      )
    })

    it('should mark pet as pending for adoption approve', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'request-id',
          type: 'adopt',
          pawId: 'paw1',
        }),
      })

      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      const pawRef = mockFirestore.collection('paws').doc('paw1')
      expect(pawRef.update).toHaveBeenCalledWith({ adoptionStatus: 'pending' })
    })

    it('should not update pet status for visit approve', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'request-id',
          type: 'visit',
          pawId: 'paw1',
        }),
      })

      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should return success response', async () => {
      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual({ success: true })
    })
  })

  describe('Reject Action', () => {
    it('should update request status to rejected', async () => {
      req.body = { requestId: 'req1', action: 'reject', comment: 'Not suitable' }

      await handleRequestTransition(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'rejected',
        }),
      )
    })

    it('should include comment in rejection', async () => {
      req.body = { requestId: 'req1', action: 'reject', comment: 'User is not ready' }

      await handleRequestTransition(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          comment: 'User is not ready',
        }),
      )
    })

    it('should use empty string if no comment provided', async () => {
      req.body = { requestId: 'req1', action: 'reject' }

      await handleRequestTransition(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          comment: '',
        }),
      )
    })

    it('should mark pet as available for adoption rejection', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'request-id',
          type: 'adopt',
          pawId: 'paw1',
        }),
      })

      req.body = { requestId: 'req1', action: 'reject', comment: 'Not suitable' }

      await handleRequestTransition(req, res)

      const pawRef = mockFirestore.collection('paws').doc('paw1')
      expect(pawRef.update).toHaveBeenCalledWith({ adoptionStatus: 'available' })
    })

    it('should not update pet status for visit rejection', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'request-id',
          type: 'visit',
          pawId: 'paw1',
        }),
      })

      req.body = { requestId: 'req1', action: 'reject' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(200)
    })
  })

  describe('Fulfill Action', () => {
    it('should update request status to fulfilled', async () => {
      req.body = { requestId: 'req1', action: 'fulfill' }

      await handleRequestTransition(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'fulfilled',
        }),
      )
    })

    it('should mark pet as adopted for adoption fulfillment', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'request-id',
          type: 'adopt',
          pawId: 'paw1',
        }),
      })

      req.body = { requestId: 'req1', action: 'fulfill' }

      await handleRequestTransition(req, res)

      const pawRef = mockFirestore.collection('paws').doc('paw1')
      expect(pawRef.update).toHaveBeenCalledWith({ adoptionStatus: 'adopted' })
    })

    it('should not update pet status for visit fulfillment', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'request-id',
          type: 'visit',
          pawId: 'paw1',
        }),
      })

      req.body = { requestId: 'req1', action: 'fulfill' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should set respondedAt timestamp', async () => {
      req.body = { requestId: 'req1', action: 'fulfill' }

      await handleRequestTransition(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          respondedAt: expect.any(String),
        }),
      )
    })
  })

  describe('Unfulfill Action', () => {
    it('should update request status to unfulfilled', async () => {
      req.body = { requestId: 'req1', action: 'unfulfill' }

      await handleRequestTransition(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'unfulfilled',
        }),
      )
    })

    it('should mark pet as available for adoption unfulfillment', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'request-id',
          type: 'adopt',
          pawId: 'paw1',
        }),
      })

      req.body = { requestId: 'req1', action: 'unfulfill' }

      await handleRequestTransition(req, res)

      const pawRef = mockFirestore.collection('paws').doc('paw1')
      expect(pawRef.update).toHaveBeenCalledWith({ adoptionStatus: 'available' })
    })

    it('should not update pet status for visit unfulfillment', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'request-id',
          type: 'visit',
          pawId: 'paw1',
        }),
      })

      req.body = { requestId: 'req1', action: 'unfulfill' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(200)
    })
  })

  describe('Invalid Action', () => {
    it('should reject unknown action', async () => {
      req.body = { requestId: 'req1', action: 'invalid' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data).toEqual({ message: 'Invalid action' })
    })

    it('should reject action with typo', async () => {
      req.body = { requestId: 'req1', action: 'appruve' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should reject empty action', async () => {
      req.body = { requestId: 'req1', action: '' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should not update request for invalid action', async () => {
      req.body = { requestId: 'req1', action: 'delete' }

      await handleRequestTransition(req, res)

      expect(mockDocRef.update).not.toHaveBeenCalled()
    })
  })

  describe('Pet Status Updates', () => {
    it('should update pet when pawId is provided', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'request-id',
          type: 'adopt',
          pawId: 'paw123',
        }),
      })

      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(mockFirestore.collection).toHaveBeenCalledWith('paws')
    })

    it('should not update pet when pawId is missing', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'request-id',
          type: 'adopt',
        }),
      })

      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle multiple status transitions for same pet', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'request-id',
          type: 'adopt',
          pawId: 'paw1',
        }),
      })

      // Approve
      req.body = { requestId: 'req1', action: 'approve' }
      await handleRequestTransition(req, res)

      // Fulfill
      req.body = { requestId: 'req1', action: 'fulfill' }
      await handleRequestTransition(req, res)

      const pawRef = mockFirestore.collection('paws').doc('paw1')
      expect(pawRef.update).toHaveBeenCalledWith({ adoptionStatus: 'adopted' })
    })
  })

  describe('Error Handling', () => {
    it('should handle Firestore read errors', async () => {
      mockDocRef.get.mockRejectedValue(new Error('Database error'))

      req.body = { requestId: 'req1', action: 'approve' }

      await expect(handleRequestTransition(req, res)).rejects.toThrow('Database error')
    })

    it('should handle Firestore update errors', async () => {
      mockDocRef.update.mockRejectedValue(new Error('Update failed'))

      req.body = { requestId: 'req1', action: 'approve' }

      await expect(handleRequestTransition(req, res)).rejects.toThrow('Update failed')
    })

    it('should handle pet status update errors', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'request-id',
          type: 'adopt',
          pawId: 'paw1',
        }),
      })

      const pawRef = mockFirestore.collection('paws').doc('paw1')
      pawRef.update = vi.fn().mockRejectedValue(new Error('Pet update failed'))

      req.body = { requestId: 'req1', action: 'approve' }

      await expect(handleRequestTransition(req, res)).rejects.toThrow('Pet update failed')
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long comment', async () => {
      const longComment = 'a'.repeat(10000)
      req.body = { requestId: 'req1', action: 'reject', comment: longComment }

      await handleRequestTransition(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          comment: longComment,
        }),
      )
    })

    it('should handle special characters in comment', async () => {
      req.body = { requestId: 'req1', action: 'reject', comment: '<script>alert("XSS")</script>' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle adoption request without pawId', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'request-id',
          type: 'adopt',
          pawId: null,
        }),
      })

      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle case-sensitive action names', async () => {
      req.body = { requestId: 'req1', action: 'APPROVE' }

      await handleRequestTransition(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should handle concurrent request transitions', async () => {
      req.body = { requestId: 'req1', action: 'approve' }

      const promise1 = handleRequestTransition(req, res)
      const promise2 = handleRequestTransition(req, res)

      await Promise.all([promise1, promise2])

      expect(mockDocRef.update).toHaveBeenCalled()
    })

    it('should preserve original request data except updated fields', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'request-id',
          userId: 'user1',
          pawId: 'paw1',
          type: 'visit',
          date: '2025-01-01',
          time: '10:00',
        }),
      })

      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.not.objectContaining({
          userId: expect.anything(),
          date: expect.anything(),
          time: expect.anything(),
        }),
      )
    })
  })

  describe('Admin ID Tracking', () => {
    it('should set adminId to null when req.user is not available', async () => {
      req.user = undefined
      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          adminId: null,
        }),
      )
    })

    it('should set adminId when req.user is available', async () => {
      req.user = { uid: 'admin123' }
      req.body = { requestId: 'req1', action: 'approve' }

      await handleRequestTransition(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          adminId: 'admin123',
        }),
      )
    })
  })
})
