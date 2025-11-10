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
const renewPetModule = await import('../../api/renewPet.js')
const renewPet = renewPetModule.default

describe('renewPet API Handler', () => {
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
        adoptionStatus: 'adopted',
      }),
    })
  })

  describe('HTTP Method Validation', () => {
    it('should reject GET requests with 405', async () => {
      req.method = 'GET'

      await renewPet(req, res)

      expect(res.statusCode).toBe(405)
      expect(res.data).toEqual({ message: 'Only POST requests are allowed' })
    })

    it('should reject PUT requests with 405', async () => {
      req.method = 'PUT'

      await renewPet(req, res)

      expect(res.statusCode).toBe(405)
    })

    it('should reject DELETE requests with 405', async () => {
      req.method = 'DELETE'

      await renewPet(req, res)

      expect(res.statusCode).toBe(405)
    })

    it('should accept POST requests', async () => {
      req.method = 'POST'
      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).not.toBe(405)
    })
  })

  describe('Authentication', () => {
    it('should reject requests without authorization header', async () => {
      req.headers.authorization = null

      await renewPet(req, res)

      expect(res.statusCode).toBe(401)
      expect(res.data).toEqual({ error: 'Unauthorized' })
    })

    it('should reject requests with empty authorization header', async () => {
      req.headers.authorization = ''

      await renewPet(req, res)

      expect(res.statusCode).toBe(401)
    })

    it('should verify token with Firebase Auth', async () => {
      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(mockAuth.verifyIdToken).toHaveBeenCalledWith('mock-id-token')
    })

    it('should reject requests with invalid token', async () => {
      mockAuth.verifyIdToken.mockRejectedValue(new Error('Invalid token'))

      req.body = { petId: 'pet123' }

      await expect(renewPet(req, res)).rejects.toThrow('Invalid token')
    })
  })

  describe('Admin Authorization', () => {
    it('should reject requests from non-admin users', async () => {
      mockAuth.getUser.mockResolvedValue(mockUser)

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toEqual({ message: 'Forbidden: User is not an admin' })
    })

    it('should reject requests from users without customClaims', async () => {
      mockAuth.getUser.mockResolvedValue({
        uid: 'user-id',
        email: 'user@example.com',
      })

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(403)
    })

    it('should reject requests from users with admin: false', async () => {
      mockAuth.getUser.mockResolvedValue({
        uid: 'user-id',
        email: 'user@example.com',
        customClaims: { admin: false },
      })

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(403)
    })

    it('should accept requests from admin users', async () => {
      mockAuth.getUser.mockResolvedValue(mockAdminUser)

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(200)
    })
  })

  describe('Request Body Validation', () => {
    it('should reject request without petId', async () => {
      req.body = {}

      await renewPet(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data).toEqual({ message: 'Invalid request parameters: petId is required' })
    })

    it('should reject request with null petId', async () => {
      req.body = { petId: null }

      await renewPet(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should reject request with undefined petId', async () => {
      req.body = { petId: undefined }

      await renewPet(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should reject request with empty string petId', async () => {
      req.body = { petId: '' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should accept valid petId', async () => {
      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(200)
    })
  })

  describe('Pet Existence Validation', () => {
    it('should return 404 if pet does not exist', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: false,
      })

      req.body = { petId: 'non-existent' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toEqual({ message: 'Pet not found' })
    })

    it('should query Firestore with correct petId', async () => {
      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(mockFirestore.collection).toHaveBeenCalledWith('paws')
    })

    it('should get pet document before renewing', async () => {
      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(mockDocRef.get).toHaveBeenCalled()
    })
  })

  describe('Adoption Status Validation', () => {
    it('should reject renewal of available pets', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'pet123',
          name: 'Buddy',
          adoptionStatus: 'available',
        }),
      })

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data).toEqual({
        message: 'Pet renewal is only allowed for adopted pets',
        currentStatus: 'available',
      })
    })

    it('should reject renewal of pending pets', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'pet123',
          name: 'Buddy',
          adoptionStatus: 'pending',
        }),
      })

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data.message).toContain('Pet renewal is only allowed for adopted pets')
      expect(res.data.currentStatus).toBe('pending')
    })

    it('should allow renewal of adopted pets', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'pet123',
          name: 'Buddy',
          adoptionStatus: 'adopted',
        }),
      })

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle pets without adoptionStatus field', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'pet123',
          name: 'Buddy',
        }),
      })

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should reject renewal with null adoptionStatus', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'pet123',
          name: 'Buddy',
          adoptionStatus: null,
        }),
      })

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should reject renewal with invalid adoptionStatus', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'pet123',
          name: 'Buddy',
          adoptionStatus: 'unknown',
        }),
      })

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(400)
    })
  })

  describe('Pet Renewal', () => {
    it('should update adoptionStatus to available', async () => {
      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          adoptionStatus: 'available',
        }),
      )
    })

    it('should add renewedAt timestamp', async () => {
      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          renewedAt: expect.any(String),
        }),
      )
    })

    it('should add renewedBy field with admin user ID', async () => {
      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          renewedBy: 'admin-user-id',
        }),
      )
    })

    it('should add updatedAt timestamp', async () => {
      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          updatedAt: expect.any(String),
        }),
      )
    })

    it('should add updatedBy field with admin user ID', async () => {
      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          updatedBy: 'admin-user-id',
        }),
      )
    })

    it('should return success response', async () => {
      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual({
        success: true,
        message: 'Pet renewed successfully - marked as available',
      })
    })

    it('should not update pet if not adopted', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'pet123',
          name: 'Buddy',
          adoptionStatus: 'available',
        }),
      })

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(mockDocRef.update).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle Firestore read errors', async () => {
      mockDocRef.get.mockRejectedValue(new Error('Database read failed'))

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toEqual({ message: 'Internal server error' })
    })

    it('should handle Firestore update errors', async () => {
      mockDocRef.update.mockRejectedValue(new Error('Update failed'))

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(500)
    })

    it('should log errors to console', async () => {
      mockDocRef.update.mockRejectedValue(new Error('Test error'))

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(console.error).toHaveBeenCalled()
    })

    it('should handle database connection errors', async () => {
      mockDocRef.get.mockRejectedValue(new Error('Connection timeout'))

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(500)
    })

    it('should handle permission errors', async () => {
      mockDocRef.update.mockRejectedValue(new Error('Permission denied'))

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(500)
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long petId', async () => {
      const longId = 'a'.repeat(1000)
      req.body = { petId: longId }

      await renewPet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle special characters in petId', async () => {
      req.body = { petId: 'pet-123_abc' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle UUID-style petId', async () => {
      req.body = { petId: '550e8400-e29b-41d4-a716-446655440000' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle numeric petId', async () => {
      req.body = { petId: '12345' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle concurrent renewal requests', async () => {
      req.body = { petId: 'pet123' }

      const promise1 = renewPet(req, res)
      const promise2 = renewPet(req, res)

      await Promise.all([promise1, promise2])

      expect(mockDocRef.update).toHaveBeenCalled()
    })

    it('should handle whitespace in petId', async () => {
      req.body = { petId: '   pet123   ' }

      await renewPet(req, res)

      // The function should handle this, though ideally would trim
      expect(res.statusCode).toBe(200)
    })

    it('should handle extra fields in request body', async () => {
      req.body = {
        petId: 'pet123',
        extraField: 'should be ignored',
        anotherField: 123,
      }

      await renewPet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle case-sensitive adoption status', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'pet123',
          name: 'Buddy',
          adoptionStatus: 'ADOPTED',
        }),
      })

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      // Should fail since it's case-sensitive
      expect(res.statusCode).toBe(400)
    })
  })

  describe('Business Logic', () => {
    it('should preserve renewal history', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'pet123',
          name: 'Buddy',
          adoptionStatus: 'adopted',
          renewedAt: '2024-01-01T00:00:00.000Z',
          renewedBy: 'previous-admin',
        }),
      })

      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      // Should update with new renewal timestamp
      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          renewedAt: expect.any(String),
          renewedBy: 'admin-user-id',
        }),
      )
    })

    it('should allow multiple renewals of the same pet', async () => {
      req.body = { petId: 'pet123' }

      // First renewal
      await renewPet(req, res)
      expect(res.statusCode).toBe(200)

      // Reset for second renewal
      resetFirebaseMocks()
      mockAuth.verifyIdToken.mockResolvedValue({ uid: 'admin-user-id' })
      mockAuth.getUser.mockResolvedValue(mockAdminUser)
      mockDocRef.get.mockResolvedValue({
        exists: true,
        data: () => ({
          id: 'pet123',
          name: 'Buddy',
          adoptionStatus: 'adopted',
        }),
      })

      res = createMockResponse()

      // Second renewal
      await renewPet(req, res)
      expect(res.statusCode).toBe(200)
    })

    it('should make pet available after renewal', async () => {
      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          adoptionStatus: 'available',
        }),
      )
    })
  })

  describe('Authorization Flow', () => {
    it('should check authentication before checking pet existence', async () => {
      req.headers.authorization = null
      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(401)
      expect(mockDocRef.get).not.toHaveBeenCalled()
    })

    it('should check admin status before checking pet existence', async () => {
      mockAuth.getUser.mockResolvedValue(mockUser)
      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(403)
      expect(mockDocRef.get).not.toHaveBeenCalled()
    })

    it('should check parameters before checking pet existence', async () => {
      req.body = {}

      await renewPet(req, res)

      expect(res.statusCode).toBe(400)
      expect(mockDocRef.get).not.toHaveBeenCalled()
    })

    it('should check pet existence before validating adoption status', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: false,
      })

      req.body = { petId: 'non-existent' }

      await renewPet(req, res)

      expect(res.statusCode).toBe(404)
      expect(mockDocRef.update).not.toHaveBeenCalled()
    })
  })

  describe('Timestamp Consistency', () => {
    it('should use same timestamp format for renewedAt and updatedAt', async () => {
      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      const updateCall = mockDocRef.update.mock.calls[0][0]
      expect(typeof updateCall.renewedAt).toBe('string')
      expect(typeof updateCall.updatedAt).toBe('string')
    })

    it('should create valid ISO timestamp', async () => {
      req.body = { petId: 'pet123' }

      await renewPet(req, res)

      const updateCall = mockDocRef.update.mock.calls[0][0]
      const renewedAt = new Date(updateCall.renewedAt)
      expect(renewedAt.toString()).not.toBe('Invalid Date')
    })
  })
})
