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
const updatePetModule = await import('../../api/updatePet.js')
const updatePet = updatePetModule.default

describe('updatePet API Handler', () => {
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
        name: 'Original Name',
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

      await updatePet(req, res)

      expect(res.statusCode).toBe(405)
      expect(res.data).toEqual({ message: 'Only POST requests are allowed' })
    })

    it('should reject PUT requests with 405', async () => {
      req.method = 'PUT'

      await updatePet(req, res)

      expect(res.statusCode).toBe(405)
    })

    it('should reject DELETE requests with 405', async () => {
      req.method = 'DELETE'

      await updatePet(req, res)

      expect(res.statusCode).toBe(405)
    })

    it('should accept POST requests', async () => {
      req.method = 'POST'
      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(res.statusCode).not.toBe(405)
    })
  })

  describe('Authentication', () => {
    it('should reject requests without authorization header', async () => {
      req.headers.authorization = null

      await updatePet(req, res)

      expect(res.statusCode).toBe(401)
      expect(res.data).toEqual({ error: 'Unauthorized' })
    })

    it('should reject requests with empty authorization header', async () => {
      req.headers.authorization = ''

      await updatePet(req, res)

      expect(res.statusCode).toBe(401)
    })

    it('should verify token with Firebase Auth', async () => {
      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(mockAuth.verifyIdToken).toHaveBeenCalledWith('mock-id-token')
    })

    it('should reject requests with invalid token', async () => {
      mockAuth.verifyIdToken.mockRejectedValue(new Error('Invalid token'))

      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await expect(updatePet(req, res)).rejects.toThrow('Invalid token')
    })
  })

  describe('Admin Authorization', () => {
    it('should reject requests from non-admin users', async () => {
      mockAuth.getUser.mockResolvedValue(mockUser)

      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toEqual({ message: 'Forbidden: User is not an admin' })
    })

    it('should reject requests from users without customClaims', async () => {
      mockAuth.getUser.mockResolvedValue({
        uid: 'user-id',
        email: 'user@example.com',
      })

      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(403)
    })

    it('should reject requests from users with admin: false', async () => {
      mockAuth.getUser.mockResolvedValue({
        uid: 'user-id',
        email: 'user@example.com',
        customClaims: { admin: false },
      })

      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(403)
    })

    it('should accept requests from admin users', async () => {
      mockAuth.getUser.mockResolvedValue(mockAdminUser)

      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(200)
    })
  })

  describe('Request Body Validation', () => {
    it('should reject request without petId', async () => {
      req.body = {
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data).toEqual({ message: 'Invalid request parameters' })
    })

    it('should reject request without petData', async () => {
      req.body = {
        petId: 'pet123',
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should reject request with null petId', async () => {
      req.body = {
        petId: null,
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should reject request with empty string petId', async () => {
      req.body = {
        petId: '',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should reject request with null petData', async () => {
      req.body = {
        petId: 'pet123',
        petData: null,
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should accept valid petId and petData', async () => {
      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(200)
    })
  })

  describe('Pet Existence Validation', () => {
    it('should return 404 if pet does not exist', async () => {
      mockDocRef.get.mockResolvedValue({
        exists: false,
      })

      req.body = {
        petId: 'non-existent',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(404)
      expect(res.data).toEqual({ message: 'Pet not found' })
    })

    it('should query Firestore with correct petId', async () => {
      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(mockFirestore.collection).toHaveBeenCalledWith('paws')
    })

    it('should get pet document before updating', async () => {
      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(mockDocRef.get).toHaveBeenCalled()
    })
  })

  describe('Pet Update', () => {
    it('should update pet in Firestore', async () => {
      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(mockDocRef.update).toHaveBeenCalled()
    })

    it('should add updatedAt timestamp', async () => {
      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          updatedAt: expect.any(String),
        }),
      )
    })

    it('should add updatedBy field with admin user ID', async () => {
      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          updatedBy: 'admin-user-id',
        }),
      )
    })

    it('should preserve petData fields', async () => {
      req.body = {
        petId: 'pet123',
        petData: {
          name: 'Updated Name',
          breed: 'Poodle',
          age: 5,
        },
      }

      await updatePet(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Updated Name',
          breed: 'Poodle',
          age: 5,
        }),
      )
    })

    it('should return success response', async () => {
      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual({
        success: true,
        message: 'Pet updated successfully',
      })
    })
  })

  describe('Partial Updates', () => {
    it('should update only name field', async () => {
      req.body = {
        petId: 'pet123',
        petData: { name: 'New Name' },
      }

      await updatePet(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Name',
        }),
      )
    })

    it('should update only breed field', async () => {
      req.body = {
        petId: 'pet123',
        petData: { breed: 'Beagle' },
      }

      await updatePet(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          breed: 'Beagle',
        }),
      )
    })

    it('should update multiple fields', async () => {
      req.body = {
        petId: 'pet123',
        petData: {
          name: 'New Name',
          breed: 'Beagle',
          temperament: 'playful',
          adoptionStatus: 'pending',
        },
      }

      await updatePet(req, res)

      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Name',
          breed: 'Beagle',
          temperament: 'playful',
          adoptionStatus: 'pending',
        }),
      )
    })

    it('should allow empty petData object', async () => {
      req.body = {
        petId: 'pet123',
        petData: {},
      }

      await updatePet(req, res)

      // Should still include updatedAt and updatedBy
      expect(mockDocRef.update).toHaveBeenCalledWith(
        expect.objectContaining({
          updatedAt: expect.any(String),
          updatedBy: 'admin-user-id',
        }),
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle Firestore read errors', async () => {
      mockDocRef.get.mockRejectedValue(new Error('Database read failed'))

      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toEqual({ message: 'Internal server error' })
    })

    it('should handle Firestore update errors', async () => {
      mockDocRef.update.mockRejectedValue(new Error('Update failed'))

      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(500)
    })

    it('should log errors to console', async () => {
      mockDocRef.update.mockRejectedValue(new Error('Test error'))

      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(console.error).toHaveBeenCalled()
    })

    it('should handle database connection errors', async () => {
      mockDocRef.get.mockRejectedValue(new Error('Connection timeout'))

      req.body = {
        petId: 'pet123',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(500)
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long pet name', async () => {
      const longName = 'A'.repeat(1000)
      req.body = {
        petId: 'pet123',
        petData: { name: longName },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle special characters in pet data', async () => {
      req.body = {
        petId: 'pet123',
        petData: {
          name: 'Buddy\'s Friend #1',
          description: '<script>alert("XSS")</script>',
        },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle Unicode characters', async () => {
      req.body = {
        petId: 'pet123',
        petData: {
          name: '日本犬',
          breed: 'Shiba Inu',
        },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle numeric values', async () => {
      req.body = {
        petId: 'pet123',
        petData: {
          age: 5,
          weight: 25.5,
        },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle boolean values', async () => {
      req.body = {
        petId: 'pet123',
        petData: {
          isVaccinated: true,
          isNeutered: false,
        },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle array values', async () => {
      req.body = {
        petId: 'pet123',
        petData: {
          photos: ['photo1.jpg', 'photo2.jpg'],
          tags: ['friendly', 'active'],
        },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle nested objects', async () => {
      req.body = {
        petId: 'pet123',
        petData: {
          medical: {
            vaccinations: ['rabies', 'distemper'],
            lastCheckup: '2024-01-01',
          },
        },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle null values in petData', async () => {
      req.body = {
        petId: 'pet123',
        petData: {
          temperament: null,
          notes: null,
        },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle updating to empty string', async () => {
      req.body = {
        petId: 'pet123',
        petData: {
          description: '',
        },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle very long petId', async () => {
      const longId = 'a'.repeat(1000)
      req.body = {
        petId: longId,
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle special characters in petId', async () => {
      req.body = {
        petId: 'pet-123_abc',
        petData: { name: 'Updated Name' },
      }

      await updatePet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should preserve updatedBy across multiple updates', async () => {
      req.body = {
        petId: 'pet123',
        petData: { name: 'First Update' },
      }

      await updatePet(req, res)

      req.body = {
        petId: 'pet123',
        petData: { name: 'Second Update' },
      }

      await updatePet(req, res)

      expect(mockDocRef.update).toHaveBeenLastCalledWith(
        expect.objectContaining({
          updatedBy: 'admin-user-id',
        }),
      )
    })
  })
})
