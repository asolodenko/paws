<template>
  <VContainer>
    <VRow justify="center">
      <VCol cols="12" md="10">
        <h1>Admin</h1>
        <VDivider class="my-6" />
        <VTabs v-model="activeTab">
          <VTab>Visit Requests</VTab>
          <VTab>Adoption Requests</VTab>
        </VTabs>
        <VTabsWindow v-model="activeTab">
          <VTabsWindowItem :value="0">
            <RequestsTable :requests="visitRequests" :table-type="'Visit Requests'" @request-update="handleRequestUpdated" />
            <RequestsTable :requests="archiveVisitRequests" :table-type="'Archive'" />
          </VTabsWindowItem>
          <VTabsWindowItem :value="1">
            <RequestsTable :requests="adoptionRequests" :table-type="'Adoption Requests'" @request-update="handleRequestUpdated" />
            <RequestsTable :requests="archiveAdoptionRequests" :table-type="'Archive'" />
          </VTabsWindowItem>
        </VTabsWindow>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Request } from '@/model/Request.model'
import { collection, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { onMounted, onUnmounted } from 'vue'
import RequestsTable from '@/components/RequestsTable.vue'
import { FULFILLED, UNFULFILLED } from '@/constants'
import { sendPOST } from '../plugins/axios'

const visitRequests = ref([] as Request[])
const archiveVisitRequests = ref([] as Request[])
const adoptionRequests = ref([] as Request[])
const archiveAdoptionRequests = ref([] as Request[])
const activeTab = ref(0)
const unsubscribeFunctions: Array<() => void> = []

onMounted(() => {
  const fetchRequests = async () => {
    try {
      const collectionRef = collection(firestore, 'requests')
      const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
        const allRequests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Request))

        visitRequests.value = allRequests.filter((request) => request.type === 'visit' && !isArchived(request))
        archiveVisitRequests.value = allRequests.filter((request) => request.type === 'visit' && isArchived(request))
        adoptionRequests.value = allRequests.filter((request) => request.type === 'adopt' && !isArchived(request))
        archiveAdoptionRequests.value = allRequests.filter((request) => request.type === 'adopt' && isArchived(request))
      })
      unsubscribeFunctions.push(unsubscribe)
    } catch (error) {
      console.error('Error fetching requests:', error)
    }
  }

  fetchRequests()
})

onUnmounted(() => {
  unsubscribeFunctions.forEach(unsubscribe => unsubscribe())
  unsubscribeFunctions.length = 0
})

const isArchived = (request: Request) => {
  return request.status === FULFILLED || request.status === UNFULFILLED
}

const handleRequestUpdated = async (updatedRequest: Request, action: string) => {
  await sendPOST('handleRequestTransition', { requestId: updatedRequest.id, action })
}
</script>
