<template>
  <VContainer>
    <VRow justify="center">
      <VCol cols="12" md="10">
        <h1>Account page</h1>
        <div class="py-4">
          <VRow>
            <VCol cols="12" md="4">
              <div>{{ user?.displayName }}</div>
            </VCol>
            <VCol cols="12" md="4">
              <div>{{ user?.email }}</div>
            </VCol>
            <VCol cols="12" md="4">
              <VBtn
                color="primary"
                class="mb-4"
                @click="logout"
              >
                Logout
              </VBtn>
            </VCol>
          </VRow>
        </div>
        <VDivider class="my-2" />
      </VCol>
    </VRow>
    <VRow justify="center">
      <VCol cols="12" md="10">
        <VTabs v-model="activeTab">
          <VTab>Visit Requests</VTab>
          <VTab>Adoption Requests</VTab>
        </VTabs>
        <VTabsWindow v-model="activeTab">
          <VTabsWindowItem :value="0">
            <RequestsTable :requests="visitRequests" :table-type="'Visit Requests'" />
            <RequestsTable :requests="archiveVisitRequests" :table-type="'Archive'" />
          </VTabsWindowItem>
          <VTabsWindowItem :value="1">
            <RequestsTable :requests="adoptionRequests" :table-type="'Adoption Requests'" />
            <RequestsTable :requests="archiveAdoptionRequests" :table-type="'Archive'" />
          </VTabsWindowItem>
        </VTabsWindow>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script lang="ts" setup>
  import { handleSignOut } from '@/auth'
  import { useUserStore } from '@/store/user'
  import { storeToRefs } from 'pinia'
  import { Request } from '@/model/Request.model'
  import { collection, onSnapshot } from 'firebase/firestore'
  import { firestore } from '@/firebase'
  import { onMounted, onUnmounted, ref } from 'vue'
  import RequestsTable from '@/components/RequestsTable.vue'
  import { FULFILLED, UNFULFILLED } from '@/constants'

  const userStore = useUserStore()
  const { user } = storeToRefs(userStore)

  const logout = async () => {
    handleSignOut()
    visitRequests.value = []
    archiveVisitRequests.value = []
    adoptionRequests.value = []
    archiveAdoptionRequests.value = []
  }

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
          } as Request)).filter((request) => request.userId === user.value?.uid)

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
</script>
