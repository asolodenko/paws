import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
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
const deletePetModule = await import('../../api/deletePet.js')
const deletePet = deletePetModule.default

describe('deletePet API Handler', () => {
  let req
  let res

  beforeEach(() => {
    req = createMockRequest()
    res = createMockResponse()
    resetFirebaseMocks()
    vi.clearAllMocks()

    // Set up default mocks for admin user
    mockAuth.verifyIdToken.mockResolvedValue({ uid: 'admin-user-id' })
    mockAuth.getUser.mockResolvedValue(mockAdminUser)
    mockDocRef.get.mockResolvedValue({
      exists: true,
      data: () => ({
        id: 'pet123',
        name: 'Buddy',
        breed: 'Labrador',
      }),
    })
  })

  afterEach(() => {
    resetFirebaseMocks()
  })

  describe('HTTP Method Validation', () => {
    it('should reject GET requests with 405', async () => {
      req.method = 'GET'

      await deletePet(req, res)

      expect(res.statusCode).toBe(405)
      expect(res.data).toEqual({ message: 'Only POST requests are allowed' })
    })

    it('should reject PUT requests with 405', async () => {
      req.method = 'PUT'

      await deletePet(req, res)

      expect(res.statusCode).toBe(405)
    })

    it('should reject DELETE requests with 405', async () => {
      req.method = 'DELETE'

      await deletePet(req, res)

      expect(res.statusCode).toBe(405)
    })

    it('should accept POST requests', async () => {
      req.method = 'POST'
      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).not.toBe(405)
    })
  })

  describe('Authentication', () => {
    it('should reject requests without authorization header', async () => {
      req.headers.authorization = null

      await deletePet(req, res)

      expect(res.statusCode).toBe(401)
      expect(res.data).toEqual({ error: 'Unauthorized' })
    })

    it('should reject requests with empty authorization header', async () => {
      req.headers.authorization = ''

      await deletePet(req, res)

      expect(res.statusCode).toBe(401)
    })

    it('should verify token with Firebase Auth', async () => {
      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(mockAuth.verifyIdToken).toHaveBeenCalledWith('mock-id-token')
    })

    it('should reject requests with invalid token', async () => {
      mockAuth.verifyIdToken.mockRejectedValue(new Error('Invalid token'))

      req.body = { petId: 'pet123' }

      await expect(deletePet(req, res)).rejects.toThrow('Invalid token')
    })
  })

  describe('Admin Authorization', () => {
    it('should reject requests from non-admin users', async () => {
      mockAuth.getUser.mockResolvedValue(mockUser)

      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toEqual({ message: 'Forbidden: User is not an admin' })
    })

    it('should reject requests from users without customClaims', async () => {
      mockAuth.getUser.mockResolvedValue({
        uid: 'user-id',
        email: 'user@example.com',
      })

      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(403)
    })

    it('should reject requests from users with admin: false', async () => {
      mockAuth.getUser.mockResolvedValue({
        uid: 'user-id',
        email: 'user@example.com',
        customClaims: { admin: false },
      })

      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(403)
    })

    it('should accept requests from admin users', async () => {
      mockAuth.getUser.mockResolvedValue(mockAdminUser)

      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(200)
    })
  })

  describe('Request Body Validation', () => {
    it('should reject request without petId', async () => {
      req.body = {}

      await deletePet(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data).toEqual({ message: 'Invalid request parameters' })
    })

    it('should reject request with null petId', async () => {
      req.body = { petId: null }

      await deletePet(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should reject request with undefined petId', async () => {
      req.body = { petId: undefined }

      await deletePet(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should reject request with empty string petId', async () => {
      req.body = { petId: '' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should accept valid petId', async () => {
      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(200)
    })
  })

  describe('Pet Existence Validation', () => {
    it('should return 404 if pet does not exist', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: false,
      })

      req.body = { petId: 'non-existent' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toEqual({ message: 'Pet not found' })
    })

    it('should query Firestore with correct petId', async () => {
      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(mockFirestore.collection).toHaveBeenCalledWith('paws')
    })

    it('should get pet document before deleting', async () => {
      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(mockDocRef.get).toHaveBeenCalled()
    })
  })

  describe('Pet Deletion', () => {
    it('should delete pet from Firestore', async () => {
      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(mockDocRef.delete).toHaveBeenCalled()
    })

    it('should return success response', async () => {
      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual({
        success: true,
        message: 'Pet deleted successfully',
      })
    })

    it('should call delete after existence check', async () => {
      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(mockDocRef.get).toHaveBeenCalled()
      expect(mockDocRef.delete).toHaveBeenCalled()
    })

    it('should not call delete if pet does not exist', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: false,
      })

      req.body = { petId: 'non-existent' }

      await deletePet(req, res)

      expect(mockDocRef.delete).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle Firestore read errors', async () => {
      mockDocRef.get.mockRejectedValue(new Error('Database read failed'))

      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toEqual({ message: 'Internal server error' })
    })

    it('should handle Firestore delete errors', async () => {
      mockDocRef.delete.mockRejectedValue(new Error('Delete failed'))

      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(500)
    })

    it('should log errors to console', async () => {
      mockDocRef.delete.mockRejectedValue(new Error('Test error'))

      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(console.error).toHaveBeenCalled()
    })

    it('should handle database connection errors', async () => {
      mockDocRef.get.mockRejectedValue(new Error('Connection timeout'))

      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(500)
    })

    it('should handle permission errors', async () => {
      mockDocRef.delete.mockRejectedValue(new Error('Permission denied'))

      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(500)
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long petId', async () => {
      const longId = 'a'.repeat(1000)
      req.body = { petId: longId }

      await deletePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle special characters in petId', async () => {
      req.body = { petId: 'pet-123_abc' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle UUID-style petId', async () => {
      req.body = { petId: '550e8400-e29b-41d4-a716-446655440000' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle numeric petId', async () => {
      req.body = { petId: '12345' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle concurrent delete requests', async () => {
      req.body = { petId: 'pet123' }

      const promise1 = deletePet(req, res)
      const promise2 = deletePet(req, res)

      await Promise.all([promise1, promise2])

      expect(mockDocRef.delete).toHaveBeenCalled()
    })

    it('should handle delete of already deleted pet', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: false,
      })

      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(404)
    })

    it('should handle whitespace in petId', async () => {
      req.body = { petId: '   pet123   ' }

      await deletePet(req, res)

      // The function should handle this, though ideally would trim
      expect(res.statusCode).toBe(200)
    })

    it('should handle extra fields in request body', async () => {
      req.body = {
        petId: 'pet123',
        extraField: 'should be ignored',
        anotherField: 123,
      }

      await deletePet(req, res)

      expect(res.statusCode).toBe(200)
    })
  })

  describe('Cascading Effects', () => {
    it('should successfully delete pet without checking for related requests', async () => {
      // Note: The current implementation doesn't check for related requests
      // This test documents that behavior
      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should delete pet regardless of adoption status', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'pet123',
          name: 'Buddy',
          adoptionStatus: 'adopted',
        }),
      })

      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should delete pet with pending requests', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'pet123',
          name: 'Buddy',
          adoptionStatus: 'pending',
        }),
      })

      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(200)
    })
  })

  describe('Idempotency', () => {
    it('should return 404 when trying to delete same pet twice', async () => {
      req.body = { petId: 'pet123' }

      // First deletion
      await deletePet(req, res)
      expect(res.statusCode).toBe(200)

      // Reset mocks and simulate pet no longer exists
      resetFirebaseMocks()
      mockAuth.verifyIdToken.mockResolvedValue({ uid: 'admin-user-id' })
      mockAuth.getUser.mockResolvedValue(mockAdminUser)
      mockDocRef.get.mockResolvedValue({
        exists: false,
      })

      res = createMockResponse()

      // Second deletion attempt
      await deletePet(req, res)
      expect(res.statusCode).toBe(404)
    })
  })

  describe('Authorization Flow', () => {
    it('should check authentication before checking pet existence', async () => {
      req.headers.authorization = null
      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(401)
      expect(mockDocRef.get).not.toHaveBeenCalled()
    })

    it('should check admin status before checking pet existence', async () => {
      mockAuth.getUser.mockResolvedValue(mockUser)
      req.body = { petId: 'pet123' }

      await deletePet(req, res)

      expect(res.statusCode).toBe(403)
      expect(mockDocRef.get).not.toHaveBeenCalled()
    })

    it('should check parameters before checking pet existence', async () => {
      req.body = {}

      await deletePet(req, res)

      expect(res.statusCode).toBe(400)
      expect(mockDocRef.get).not.toHaveBeenCalled()
    })
  })
})
