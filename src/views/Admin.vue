<template>
  <VContainer fluid>
    <VRow justify="center">
      <VCol cols="12">
        <h1 class="text-h3 mb-4">
          Admin Panel
        </h1>
        <VDivider class="my-6" />
        
        <VTabs v-model="activeTab" color="primary" grow>
          <VTab>
            <VIcon left>
              mdi-view-dashboard
            </VIcon>
            Dashboard
          </VTab>
          <VTab>
            <VIcon left>
              mdi-file-document-multiple
            </VIcon>
            Requests
          </VTab>
          <VTab>
            <VIcon left>
              mdi-paw
            </VIcon>
            Pet Inventory
          </VTab>
          <VTab>
            <VIcon left>
              mdi-book-open-variant
            </VIcon>
            Admin Guide
          </VTab>
        </VTabs>
        
        <VTabsWindow v-model="activeTab" class="mt-4">
          <!-- Dashboard Tab -->
          <VTabsWindowItem :value="0">
            <AdminDashboard
              :requests="allRequests"
              :total-pets="totalPets"
            />
          </VTabsWindowItem>
          
          <!-- Requests Tab -->
          <VTabsWindowItem :value="1">
            <AdminRequests
              :visit-requests="visitRequests"
              :archive-visit-requests="archiveVisitRequests"
              :adoption-requests="adoptionRequests"
              :archive-adoption-requests="archiveAdoptionRequests"
              @request-update="handleRequestUpdated"
            />
          </VTabsWindowItem>
          
          <!-- Pet Inventory Tab -->
          <VTabsWindowItem :value="2">
            <PetInventory
              :pets="pets"
              :loading="petsLoading"
              @create="openCreatePetDialog"
              @edit="openEditPetDialog"
              @delete="handleDeletePet"
              @renew="handleRenewPet"
            />
          </VTabsWindowItem>
          
          <!-- Admin Guide Tab -->
          <VTabsWindowItem :value="3">
            <AdminGuide />
          </VTabsWindowItem>
        </VTabsWindow>
      </VCol>
    </VRow>
    
    <!-- Pet Form Dialog -->
    <PetForm
      v-model="petFormDialog"
      :pet="selectedPet"
      :loading="petFormLoading"
      @submit="handlePetFormSubmit"
    />
  </VContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Request } from '@/model/Request.model'
import { Paw } from '@/model/Paw.model'
import { collection, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/firebase'
import AdminDashboard from '@/components/AdminDashboard.vue'
import AdminRequests from '@/components/AdminRequests.vue'
import PetInventory from '@/components/PetInventory.vue'
import PetForm from '@/components/PetForm.vue'
import AdminGuide from '@/components/AdminGuide.vue'
import { FULFILLED, UNFULFILLED } from '@/constants'
import { sendPOST } from '../plugins/axios'
import { usePetManagementStore } from '@/store/petManagement'
import { storeToRefs } from 'pinia'

const visitRequests = ref([] as Request[])
const archiveVisitRequests = ref([] as Request[])
const adoptionRequests = ref([] as Request[])
const archiveAdoptionRequests = ref([] as Request[])
const activeTab = ref(0)
const unsubscribeFunctions: Array<() => void> = []

// Pet management
const petManagementStore = usePetManagementStore()
const { pets, loading: petsLoading } = storeToRefs(petManagementStore)
const petFormDialog = ref(false)
const selectedPet = ref<Paw | null>(null)
const petFormLoading = ref(false)

const allRequests = computed(() => [
  ...visitRequests.value,
  ...archiveVisitRequests.value,
  ...adoptionRequests.value,
  ...archiveAdoptionRequests.value,
])

const totalPets = computed(() => pets.value.length)

onMounted(() => {
  const fetchRequests = async () => {
    try {
      const collectionRef = collection(firestore, 'requests')
      const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
        const allReqs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Request))

        visitRequests.value = allReqs.filter((request) => request.type === 'visit' && !isArchived(request))
        archiveVisitRequests.value = allReqs.filter((request) => request.type === 'visit' && isArchived(request))
        adoptionRequests.value = allReqs.filter((request) => request.type === 'adopt' && !isArchived(request))
        archiveAdoptionRequests.value = allReqs.filter((request) => request.type === 'adopt' && isArchived(request))
      })
      unsubscribeFunctions.push(unsubscribe)
    } catch (error) {
      console.error('Error fetching requests:', error)
    }
  }

  fetchRequests()
  petManagementStore.fetchPets()
})

onUnmounted(() => {
  unsubscribeFunctions.forEach(unsubscribe => unsubscribe())
  unsubscribeFunctions.length = 0
  petManagementStore.cleanup()
})

const isArchived = (request: Request) => {
  return request.status === FULFILLED || request.status === UNFULFILLED
}

const handleRequestUpdated = async (updatedRequest: Request, action: string) => {
  await sendPOST('handleRequestTransition', { requestId: updatedRequest.id, action })
}

// Pet management handlers
const openCreatePetDialog = () => {
  selectedPet.value = null
  petFormDialog.value = true
}

const openEditPetDialog = (pet: Paw) => {
  selectedPet.value = pet
  petFormDialog.value = true
}

const handlePetFormSubmit = async (petData: Partial<Paw> & { id?: string }) => {
  petFormLoading.value = true
  try {
    let success = false
    if (petData.id) {
      // Update existing pet
      const { id, ...updateData } = petData
      success = await petManagementStore.updatePet(id, updateData)
    } else {
      // Create new pet
      const { id: _id, ...createData } = petData
      success = await petManagementStore.createPet(createData as Omit<Paw, 'id'>)
    }
    
    if (success) {
      petFormDialog.value = false
      selectedPet.value = null
    }
  } finally {
    petFormLoading.value = false
  }
}

const handleDeletePet = async (petId: string) => {
  await petManagementStore.deletePet(petId)
}

const handleRenewPet = async (petId: string) => {
  await petManagementStore.renewPet(petId)
}
</script>

<style scoped>
.v-tabs-window {
  min-height: 400px;
}
</style>