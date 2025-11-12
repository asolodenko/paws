import { ref } from 'vue'
import { defineStore } from 'pinia'
import { doc, getDoc } from 'firebase/firestore'
import { Paw } from '@/model/Paw.model'
import { firestore } from '@/firebase'

export const usePawStore = defineStore('paw', () => {
  const currentPaw = ref({} as Paw)
  const loading = ref(false)
  const error = ref('')

  async function fetchPawData(id: string) {
    loading.value = true
    try {
      const pawRef = doc(firestore, 'paws', id)
      const pawSnapshot = await getDoc(pawRef)
      loading.value = false
      if (pawSnapshot.exists()) {
        currentPaw.value = {
          id: pawSnapshot.id,
          ...pawSnapshot.data(),
        } as Paw
      } else {
        error.value = 'Pet not found'
      }
    } catch (err) {
      console.error('Error fetching paw:', err)
    } finally {
      loading.value = false
    }
  }

  return { loading, currentPaw, fetchPawData }
})
