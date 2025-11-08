<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <VBtn prepend-icon="mdi-arrow-left" variant="plain" to="/paws">
          Back to Paws List
        </VBtn>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12" md="6">
        <VImg 
          src="./../assets/00001.jpg"
          alt="Pet Image" 
          class="rounded"
          max-height="400"
          max-width="100%"
        />
      </VCol>

      <VCol cols="12" md="6" class="d-flex flex-column justify-space-between">
        <!-- Pet Details -->
        <VCard class="pa-4">
          <VCardTitle class="text-h5">
            {{ currentPaw.name }}
          </VCardTitle>
          <VCardText>
            <VList dense>
              <VListItem>
                <VListItemTitle>Gender:</VListItemTitle>
                <VListItemSubtitle>{{ currentPaw.gender }}</VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Age:</VListItemTitle>
                <VListItemSubtitle>{{ currentPaw.birthDate }} years</VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Breed:</VListItemTitle>
                <VListItemSubtitle>{{ currentPaw.breed }}</VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Color:</VListItemTitle>
                <VListItemSubtitle>{{ currentPaw.coatColor }}</VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Temperament:</VListItemTitle>
                <VListItemSubtitle>{{ currentPaw.temperament }}</VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Weight:</VListItemTitle>
                <VListItemSubtitle>{{ currentPaw.weight }} kg</VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Health condition:</VListItemTitle>
                <VListItemSubtitle>{{ currentPaw.healthCondition }}</VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Activity level:</VListItemTitle>
                <VListItemSubtitle>{{ currentPaw.activityLevel }}</VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Grooming needs:</VListItemTitle>
                <VListItemSubtitle>{{ currentPaw.groomingNeeds }}</VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Favorite food flavor:</VListItemTitle>
                <VListItemSubtitle>{{ currentPaw.foodFlavor }}</VListItemSubtitle>
              </VListItem>
              <VListItem>
                <VListItemTitle>Toy type:</VListItemTitle>
                <VListItemSubtitle>{{ currentPaw.toyType }}</VListItemSubtitle>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>

        <!-- Visit Counter Progress Bar -->
        <VCard v-if="isAuth" class="pa-4 mt-4">
          <VCardTitle class="text-subtitle-1">
            Your Visit Progress
          </VCardTitle>
          <VCardText>
            <div class="d-flex align-center mb-2">
              <span class="text-body-2 mr-2">{{ visitCount }} / 5 visits completed</span>
            </div>
            <VProgressLinear
              :model-value="(visitCount / 5) * 100"
              :color="visitCount >= 5 ? 'success' : 'primary'"
              height="20"
              rounded
            >
              <template #default>
                <strong class="text-white">{{ Math.round((visitCount / 5) * 100) }}%</strong>
              </template>
            </VProgressLinear>
            <div v-if="visitCount >= 5" class="text-success text-caption mt-2">
              <VIcon icon="mdi-check-circle" size="small" /> You're eligible to adopt {{ currentPaw.name }}!
            </div>
            <div v-else class="text-caption mt-2">
              Complete {{ 5 - visitCount }} more visit{{ 5 - visitCount > 1 ? 's' : '' }} to become eligible for adoption
            </div>
          </VCardText>
        </VCard>

        <!-- Actions -->
        <VRow v-if="isAuth" class="mt-4">
          <VCol cols="6">
            <VBtn
              color="primary" 
              block 
              @click="openModal('visit')"
            >
              Request to Visit
            </VBtn>
          </VCol>
          <VCol cols="6">
            <VBtn
              color="secondary" 
              block 
              @click="openModal('adopt')"
            >
              Adopt Pet
            </VBtn>
          </VCol>
        </VRow>

        <div v-else>
          Please login to send requests
        </div>
      </VCol>
    </VRow>

    <!-- Modal -->
    <MakeRequestDialog
      v-model="isModalOpen"
      :action="modalAction"
      :paw="currentPaw"
      :user="user"
    />
  </VContainer>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePawStore } from '@/store/paw'
import { useRequestStore } from '@/store/request'
import { storeToRefs } from 'pinia'
import MakeRequestDialog from '@/components/MakeRequestDialog.vue'
import { useUserStore } from '@/store/user'

const route = useRoute()
const pawId = route.params.id as string
const { fetchPawData } = usePawStore()
const pawStore = usePawStore()
const userStore = useUserStore()
const requestStore = useRequestStore()
const { currentPaw } = storeToRefs(pawStore)
const { isAuth, user } = storeToRefs(userStore)
const isModalOpen = ref(false)
const modalAction = ref<'visit' | 'adopt'>('visit')

// Computed property for visit count
const visitCount = computed(() => {
  if (!user.value || !pawId) {
    return 0
  }
  return requestStore.getFulfilledVisitCount(user.value.uid, pawId)
})

onMounted(async () => {
  await fetchPawData(pawId)
  
  // Subscribe to user requests if authenticated
  if (user.value) {
    requestStore.subscribeToUserRequests(user.value.uid)
  }
})

onUnmounted(() => {
  requestStore.cleanup()
})

const openModal = (action: 'visit' | 'adopt') => {
  modalAction.value = action
  isModalOpen.value = true
}
</script>
