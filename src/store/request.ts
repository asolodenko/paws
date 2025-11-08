// Utilities
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { Request } from '@/model/Request.model'
import { VISIT, FULFILLED } from '@/constants'

export const useRequestStore = defineStore('request', () => {
  const requests = ref<Request[]>([])
  const unsubscribe = ref<(() => void) | null>(null)

  // Fetch all requests for a specific user
  function subscribeToUserRequests(userId: string) {
    if (unsubscribe.value) {
      unsubscribe.value()
    }

    const collectionRef = collection(firestore, 'requests')
    const q = query(collectionRef, where('userId', '==', userId))
    
    unsubscribe.value = onSnapshot(q, (snapshot) => {
      requests.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Request))
    })
  }

  // Get fulfilled visit count for a specific paw and user
  function getFulfilledVisitCount(userId: string, pawId: string): number {
    return requests.value.filter(
      (request) =>
        request.userId === userId &&
        request.pawId === pawId &&
        request.type === VISIT &&
        request.status === FULFILLED,
    ).length
  }

  // Check if user is eligible to adopt a specific paw (has 5+ fulfilled visits)
  function isEligibleToAdopt(userId: string, pawId: string): boolean {
    return getFulfilledVisitCount(userId, pawId) >= 5
  }

  // Cleanup subscription
  function cleanup() {
    if (unsubscribe.value) {
      unsubscribe.value()
      unsubscribe.value = null
    }
    requests.value = []
  }

  return {
    requests,
    subscribeToUserRequests,
    getFulfilledVisitCount,
    isEligibleToAdopt,
    cleanup,
  }
})
