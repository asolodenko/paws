import { defineStore } from 'pinia'
import { ref } from 'vue'
import { sendPOST } from '@/plugins/axios'
import { Paw } from '@/model/Paw.model'
import { collection, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/firebase'

export const usePetManagementStore = defineStore('petManagement', () => {
  const pets = ref<Paw[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  let unsubscribe: (() => void) | null = null

  // Fetch all pets with real-time updates
  const fetchPets = () => {
    const collectionRef = collection(firestore, 'paws')
    
    unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        pets.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Paw))
        loading.value = false
      },
      (err) => {
        console.error('Error fetching pets:', err)
        error.value = 'Failed to fetch pets'
        loading.value = false
      },
    )
  }

  // Create new pet
  const createPet = async (petData: Omit<Paw, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      await sendPOST('createPet', { petData })
      return true
    } catch (err) {
      console.error('Error creating pet:', err)
      error.value = 'Failed to create pet'
      return false
    } finally {
      loading.value = false
    }
  }

  // Update existing pet
  const updatePet = async (petId: string, petData: Partial<Paw>) => {
    loading.value = true
    error.value = null
    try {
      await sendPOST('updatePet', { petId, petData })
      return true
    } catch (err) {
      console.error('Error updating pet:', err)
      error.value = 'Failed to update pet'
      return false
    } finally {
      loading.value = false
    }
  }

  // Delete pet
  const deletePet = async (petId: string) => {
    loading.value = true
    error.value = null
    try {
      await sendPOST('deletePet', { petId })
      return true
    } catch (err) {
      console.error('Error deleting pet:', err)
      error.value = 'Failed to delete pet'
      return false
    } finally {
      loading.value = false
    }
  }

  // Cleanup subscription
  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  return {
    pets,
    loading,
    error,
    fetchPets,
    createPet,
    updatePet,
    deletePet,
    cleanup,
  }
})
