<template>
  <VContainer>
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
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { usePawStore } from '@/store/paw'
import { storeToRefs } from 'pinia'
import MakeRequestDialog from '@/components/MakeRequestDialog.vue'
import { useUserStore } from '@/store/user'

const route = useRoute()
const pawId = route.params.id as string
const { fetchPawData } = usePawStore()
const pawStore = usePawStore()
const userStore = useUserStore()
const { currentPaw } = storeToRefs(pawStore)
const { isAuth, user } = storeToRefs(userStore)
const isModalOpen = ref(false)
const modalAction = ref<'visit' | 'adopt'>('visit')

onMounted(async () => {
  await fetchPawData(pawId)
})

const openModal = (action: 'visit' | 'adopt') => {
  modalAction.value = action
  isModalOpen.value = true
}
</script>
