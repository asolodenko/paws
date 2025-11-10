import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  createFirebaseAdminMocks,
  createMockRequest,
  createMockResponse,
  resetFirebaseMocks,
  mockAuth,
  mockFirestore,
  mockCollectionRef,
  mockUser,
  mockAdminUser,
} from '../helpers/firebase-mocks.js'

// Apply Firebase mocks
createFirebaseAdminMocks()

// Import the handler after mocks are set up
const createPetModule = await import('../../api/createPet.js')
const createPet = createPetModule.default

describe('createPet API Handler', () => {
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
  })

  afterEach(() => {
    resetFirebaseMocks()
  })

  describe('HTTP Method Validation', () => {
    it('should reject GET requests with 405', async () => {
      req.method = 'GET'

      await createPet(req, res)

      expect(res.statusCode).toBe(405)
      expect(res.data).toEqual({ message: 'Only POST requests are allowed' })
    })

    it('should reject PUT requests with 405', async () => {
      req.method = 'PUT'

      await createPet(req, res)

      expect(res.statusCode).toBe(405)
    })

    it('should reject DELETE requests with 405', async () => {
      req.method = 'DELETE'

      await createPet(req, res)

      expect(res.statusCode).toBe(405)
    })

    it('should accept POST requests', async () => {
      req.method = 'POST'
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).not.toBe(405)
    })
  })

  describe('Authentication', () => {
    it('should reject requests without authorization header', async () => {
      req.headers.authorization = null

      await createPet(req, res)

      expect(res.statusCode).toBe(401)
      expect(res.data).toEqual({ error: 'Unauthorized' })
    })

    it('should reject requests with empty authorization header', async () => {
      req.headers.authorization = ''

      await createPet(req, res)

      expect(res.statusCode).toBe(401)
    })

    it('should verify token with Firebase Auth', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(mockAuth.verifyIdToken).toHaveBeenCalledWith('mock-id-token')
    })

    it('should reject requests with invalid token', async () => {
      mockAuth.verifyIdToken.mockRejectedValue(new Error('Invalid token'))

      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await expect(createPet(req, res)).rejects.toThrow('Invalid token')
    })
  })

  describe('Admin Authorization', () => {
    it('should reject requests from non-admin users', async () => {
      mockAuth.getUser.mockResolvedValue(mockUser)

      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(403)
      expect(res.data).toEqual({ message: 'Forbidden: User is not an admin' })
    })

    it('should reject requests from users without customClaims', async () => {
      mockAuth.getUser.mockResolvedValue({
        uid: 'user-id',
        email: 'user@example.com',
      })

      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(403)
    })

    it('should reject requests from users with admin: false', async () => {
      mockAuth.getUser.mockResolvedValue({
        uid: 'user-id',
        email: 'user@example.com',
        customClaims: { admin: false },
      })

      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(403)
    })

    it('should accept requests from admin users', async () => {
      mockAuth.getUser.mockResolvedValue(mockAdminUser)

      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
    })
  })

  describe('Request Body Validation', () => {
    it('should reject request without petData', async () => {
      req.body = {}

      await createPet(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data).toEqual({ message: 'Invalid request parameters' })
    })

    it('should reject request with null petData', async () => {
      req.body = { petData: null }

      await createPet(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should reject request with undefined petData', async () => {
      req.body = { petData: undefined }

      await createPet(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should reject request with empty petData object', async () => {
      req.body = { petData: {} }

      await createPet(req, res)

      expect(res.statusCode).toBe(400)
    })
  })

  describe('Required Fields Validation', () => {
    it('should reject pet without name', async () => {
      req.body = {
        petData: {
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data.message).toContain('Missing required field: name')
    })

    it('should reject pet without breed', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data.message).toContain('Missing required field: breed')
    })

    it('should reject pet without gender', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data.message).toContain('Missing required field: gender')
    })

    it('should reject pet without coatColor', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(400)
      expect(res.data.message).toContain('Missing required field: coatColor')
    })

    it('should reject pet with empty name', async () => {
      req.body = {
        petData: {
          name: '',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should reject pet with null required field', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: null,
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(400)
    })

    it('should accept pet with all required fields', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
    })
  })

  describe('Pet Creation', () => {
    it('should create pet in Firestore', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(mockFirestore.collection).toHaveBeenCalledWith('paws')
      expect(mockCollectionRef.add).toHaveBeenCalled()
    })

    it('should add createdAt timestamp', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(mockCollectionRef.add).toHaveBeenCalledWith(
        expect.objectContaining({
          createdAt: expect.any(String),
        }),
      )
    })

    it('should add createdBy field with admin user ID', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(mockCollectionRef.add).toHaveBeenCalledWith(
        expect.objectContaining({
          createdBy: 'admin-user-id',
        }),
      )
    })

    it('should preserve all petData fields', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
          age: 3,
          temperament: 'friendly',
        },
      }

      await createPet(req, res)

      expect(mockCollectionRef.add).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
          age: 3,
          temperament: 'friendly',
        }),
      )
    })

    it('should return success with document ID', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
      expect(res.data).toEqual({
        success: true,
        id: 'mock-doc-id',
        message: 'Pet created successfully',
      })
    })
  })

  describe('Optional Fields', () => {
    it('should accept pet with optional birthDate', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
          birthDate: '2020-01-01',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
      expect(mockCollectionRef.add).toHaveBeenCalledWith(
        expect.objectContaining({
          birthDate: '2020-01-01',
        }),
      )
    })

    it('should accept pet with optional temperament', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
          temperament: 'calm',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should accept pet with optional activityLevel', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
          activityLevel: 'high',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should accept pet with optional groomingNeeds', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
          groomingNeeds: 'moderate',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should accept pet with optional healthCondition', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
          healthCondition: 'excellent',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should accept pet with all fields', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
          birthDate: '2020-01-01',
          temperament: 'friendly',
          activityLevel: 'high',
          groomingNeeds: 'moderate',
          healthCondition: 'excellent',
          adoptionStatus: 'available',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
    })
  })

  describe('Error Handling', () => {
    it('should handle Firestore write errors', async () => {
      mockCollectionRef.add.mockRejectedValue(new Error('Firestore write failed'))

      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(500)
      expect(res.data).toEqual({ message: 'Internal server error' })
    })

    it('should log errors to console', async () => {
      mockCollectionRef.add.mockRejectedValue(new Error('Test error'))

      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(console.error).toHaveBeenCalled()
    })

    it('should handle database connection errors', async () => {
      mockCollectionRef.add.mockRejectedValue(new Error('Connection timeout'))

      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(500)
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long pet name', async () => {
      const longName = 'A'.repeat(1000)
      req.body = {
        petData: {
          name: longName,
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle special characters in pet name', async () => {
      req.body = {
        petData: {
          name: 'Buddy\'s Friend #1',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle Unicode characters in pet name', async () => {
      req.body = {
        petData: {
          name: '日本犬',
          breed: 'Shiba Inu',
          gender: 'male',
          coatColor: 'red',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle numeric values in string fields', async () => {
      req.body = {
        petData: {
          name: 'Buddy 123',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle extra fields not in schema', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
          customField: 'custom value',
          anotherField: 123,
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
      expect(mockCollectionRef.add).toHaveBeenCalledWith(
        expect.objectContaining({
          customField: 'custom value',
          anotherField: 123,
        }),
      )
    })

    it('should handle whitespace-only required fields', async () => {
      req.body = {
        petData: {
          name: '   ',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
        },
      }

      await createPet(req, res)

      // Whitespace-only strings are truthy in JavaScript, so this should pass
      expect(res.statusCode).toBe(200)
    })

    it('should handle boolean values in required fields', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
          isVaccinated: true,
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle array values in petData', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
          photos: ['photo1.jpg', 'photo2.jpg'],
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
    })

    it('should handle nested object in petData', async () => {
      req.body = {
        petData: {
          name: 'Buddy',
          breed: 'Golden Retriever',
          gender: 'male',
          coatColor: 'golden',
          medical: {
            vaccinations: ['rabies', 'distemper'],
            lastCheckup: '2024-01-01',
          },
        },
      }

      await createPet(req, res)

      expect(res.statusCode).toBe(200)
    })
  })
})
