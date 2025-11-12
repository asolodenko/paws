<template>
  <VContainer class="paw-detail-container">
    <!-- Back Button -->
    <VRow>
      <VCol cols="12">
        <VBtn
          prepend-icon="mdi-arrow-left"
          variant="text"
          color="primary"
          to="/paws"
          class="mb-4 text-none back-btn"
        >
          Back to All Cats
        </VBtn>
      </VCol>
    </VRow>

    <VRow>
      <!-- Image Section -->
      <VCol
        cols="12"
        md="6"
      >
        <VCard
          elevation="4"
          rounded="xl"
          class="image-card"
        >
          <VImg
            :src="currentPaw.img || './../assets/00001.jpg'"
            :alt="`Photo of ${currentPaw.name}`"
            aspect-ratio="1"
            cover
            class="paw-detail-image"
          >
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <VProgressCircular
                  indeterminate
                  color="primary"
                  size="64"
                />
              </div>
            </template>
            <template #error>
              <div class="d-flex align-center justify-center fill-height bg-surface-variant">
                <VIcon
                  size="80"
                  color="primary"
                >
                  mdi-cat
                </VIcon>
              </div>
            </template>
          </VImg>
        </VCard>
      </VCol>

      <!-- Details Section -->
      <VCol
        cols="12"
        md="6"
        class="d-flex flex-column"
      >
        <!-- Visit Counter -->
        <VisitCounter
          v-if="isAuth"
          :visit-count="visitCount"
          :is-eligible-for-adoption="isEligibleForAdoption"
          class="mb-4"
        />

        <!-- Main Info Card -->
        <VCard
          elevation="2"
          rounded="xl"
          class="flex-grow-1 detail-card"
        >
          <VCardTitle class="text-h4 font-weight-bold pa-6 pb-4">
            {{ currentPaw.name }}
            <VChip
              :color="currentPaw.gender === 'Male' ? 'blue' : 'pink'"
              class="ml-3"
              variant="flat"
            >
              <VIcon
                :icon="currentPaw.gender === 'Male' ? 'mdi-gender-male' : 'mdi-gender-female'"
                start
              />
              {{ currentPaw.gender }}
            </VChip>
          </VCardTitle>

          <VDivider class="mx-6" />

          <VCardText class="pa-6">
            <!-- Quick Stats -->
            <VRow class="mb-4">
              <VCol
                cols="6"
                sm="4"
              >
                <div class="stat-item">
                  <VIcon
                    color="accent"
                    size="small"
                    class="mb-1"
                  >
                    mdi-cake
                  </VIcon>
                  <div class="text-caption text-medium-emphasis">
                    Age
                  </div>
                  <div class="text-body-1 font-weight-medium">
                    {{ currentPaw.birthDate }}
                  </div>
                </div>
              </VCol>
              <VCol
                cols="6"
                sm="4"
              >
                <div class="stat-item">
                  <VIcon
                    color="accent"
                    size="small"
                    class="mb-1"
                  >
                    mdi-shape
                  </VIcon>
                  <div class="text-caption text-medium-emphasis">
                    Breed
                  </div>
                  <div class="text-body-1 font-weight-medium">
                    {{ currentPaw.breed }}
                  </div>
                </div>
              </VCol>
              <VCol
                cols="6"
                sm="4"
              >
                <div class="stat-item">
                  <VIcon
                    color="accent"
                    size="small"
                    class="mb-1"
                  >
                    mdi-weight
                  </VIcon>
                  <div class="text-caption text-medium-emphasis">
                    Weight
                  </div>
                  <div class="text-body-1 font-weight-medium">
                    {{ currentPaw.weight }} kg
                  </div>
                </div>
              </VCol>
            </VRow>

            <VDivider class="my-4" />

            <!-- Detailed Information -->
            <div class="info-grid">
              <div class="info-row">
                <div class="info-label">
                  <VIcon
                    color="accent"
                    size="small"
                  >
                    mdi-palette
                  </VIcon>
                  <span>Color</span>
                </div>
                <div class="info-value">
                  {{ currentPaw.coatColor }}
                </div>
              </div>

              <div class="info-row">
                <div class="info-label">
                  <VIcon
                    color="accent"
                    size="small"
                  >
                    mdi-emoticon-happy
                  </VIcon>
                  <span>Temperament</span>
                </div>
                <div class="info-value">
                  {{ currentPaw.temperament }}
                </div>
              </div>

              <div class="info-row">
                <div class="info-label">
                  <VIcon
                    color="accent"
                    size="small"
                  >
                    mdi-heart-pulse
                  </VIcon>
                  <span>Health</span>
                </div>
                <div class="info-value">
                  {{ currentPaw.healthCondition }}
                </div>
              </div>

              <div class="info-row">
                <div class="info-label">
                  <VIcon
                    color="accent"
                    size="small"
                  >
                    mdi-run
                  </VIcon>
                  <span>Activity Level</span>
                </div>
                <div class="info-value">
                  {{ currentPaw.activityLevel }}
                </div>
              </div>

              <div class="info-row">
                <div class="info-label">
                  <VIcon
                    color="accent"
                    size="small"
                  >
                    mdi-content-cut
                  </VIcon>
                  <span>Grooming</span>
                </div>
                <div class="info-value">
                  {{ currentPaw.groomingNeeds }}
                </div>
              </div>

              <div class="info-row">
                <div class="info-label">
                  <VIcon
                    color="accent"
                    size="small"
                  >
                    mdi-food
                  </VIcon>
                  <span>Favorite Food</span>
                </div>
                <div class="info-value">
                  {{ currentPaw.foodFlavor }}
                </div>
              </div>

              <div class="info-row">
                <div class="info-label">
                  <VIcon
                    color="accent"
                    size="small"
                  >
                    mdi-toys
                  </VIcon>
                  <span>Favorite Toy</span>
                </div>
                <div class="info-value">
                  {{ currentPaw.toyType }}
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>

        <!-- Action Buttons -->
        <VCard
          v-if="isAuth"
          elevation="2"
          rounded="xl"
          class="mt-4 action-card"
        >
          <VCardText class="pa-4">
            <VRow>
              <VCol
                cols="12"
                sm="6"
              >
                <VBtn
                  color="primary"
                  variant="flat"
                  size="large"
                  block
                  rounded="lg"
                  class="text-none action-btn"
                  @click="openModal('visit')"
                >
                  <VIcon start>
                    mdi-calendar-heart
                  </VIcon>
                  Schedule a Visit
                </VBtn>
              </VCol>
              <VCol
                cols="12"
                sm="6"
              >
                <VBtn
                  color="secondary"
                  variant="flat"
                  size="large"
                  block
                  rounded="lg"
                  :disabled="!isEligibleForAdoption"
                  class="text-none action-btn"
                  @click="openModal('adopt')"
                >
                  <VIcon start>
                    mdi-heart
                  </VIcon>
                  Adopt {{ currentPaw.name }}
                </VBtn>
              </VCol>
            </VRow>
            <p
              v-if="!isEligibleForAdoption"
              class="text-caption text-center text-medium-emphasis mt-3 mb-0"
            >
              Visit at least 5 times to unlock adoption
            </p>
          </VCardText>
        </VCard>

        <!-- Login Prompt -->
        <VCard
          v-else
          elevation="2"
          rounded="xl"
          class="mt-4 text-center pa-6"
          variant="tonal"
        >
          <VIcon
            size="48"
            color="primary"
            class="mb-3"
          >
            mdi-login
          </VIcon>
          <h3 class="text-h6 mb-2">
            Sign in to continue
          </h3>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Please login to schedule visits or adopt this cat
          </p>
          <VBtn
            to="/login"
            color="primary"
            variant="flat"
            rounded="lg"
            class="text-none"
          >
            Sign In
          </VBtn>
        </VCard>
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
import { onMounted, ref, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePawStore } from '@/store/paw'
import { storeToRefs } from 'pinia'
import MakeRequestDialog from '@/components/MakeRequestDialog.vue'
import VisitCounter from '@/components/VisitCounter.vue'
import { useUserStore } from '@/store/user'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/firebase'
import { FULFILLED } from '@/constants'

const route = useRoute()
const pawId = route.params.id as string
const { fetchPawData } = usePawStore()
const pawStore = usePawStore()
const userStore = useUserStore()
const { currentPaw } = storeToRefs(pawStore)
const { isAuth, user } = storeToRefs(userStore)
const isModalOpen = ref(false)
const modalAction = ref<'visit' | 'adopt'>('visit')
const visitCount = ref(0)
const isEligibleForAdoption = ref(false)
let unsubscribe: (() => void) | null = null

onMounted(async () => {
  await fetchPawData(pawId)
  if (isAuth.value && user.value) {
    subscribeToVisitCount()
  }
})

// Watch for auth changes to fetch visit count when user logs in
watch(isAuth, async (newIsAuth) => {
  if (newIsAuth && user.value) {
    subscribeToVisitCount()
  } else {
    // Clean up subscription when user logs out
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    visitCount.value = 0
    isEligibleForAdoption.value = false
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

const subscribeToVisitCount = () => {
  if (!user.value) {
    return
  }
  
  // Clean up existing subscription
  if (unsubscribe) {
    unsubscribe()
  }
  
  try {
    const requestsRef = collection(firestore, 'requests')
    const q = query(
      requestsRef,
      where('userId', '==', user.value.uid),
      where('pawId', '==', pawId),
      where('type', '==', 'visit'),
      where('status', '==', FULFILLED),
    )
    
    unsubscribe = onSnapshot(q, (snapshot) => {
      visitCount.value = snapshot.size
      isEligibleForAdoption.value = snapshot.size >= 5
    })
  } catch (error) {
    console.error('Error subscribing to visit count:', error)
  }
}

const openModal = (action: 'visit' | 'adopt') => {
  modalAction.value = action
  isModalOpen.value = true
}
</script>

<style scoped>
.paw-detail-container {
  max-width: 1400px;
  padding-top: 2rem;
  padding-bottom: 4rem;
}

.back-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-btn:hover {
  transform: translateX(-4px);
}

.image-card {
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-card:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.paw-detail-image {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-card:hover .paw-detail-image {
  transform: scale(1.02);
}

.detail-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: rgba(var(--v-theme-primary), 0.05);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-item:hover {
  background: rgba(var(--v-theme-primary), 0.1);
  transform: translateY(-2px);
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-row:hover {
  background: rgba(var(--v-theme-surface-variant), 0.5);
  transform: translateX(4px);
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.info-value {
  font-weight: 600;
  text-align: right;
}

.action-card {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.action-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

@media (max-width: 960px) {
  .paw-detail-container {
    padding-top: 1rem;
    padding-bottom: 2rem;
  }
}
</style>
