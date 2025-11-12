<template>
  <VContainer fluid>
    <VRow>
      <VCol cols="12">
        <h2 class="text-h4 mb-4">
          Dashboard Overview
        </h2>
      </VCol>
    </VRow>
    
    <VRow>
      <!-- Total Pets Card -->
      <VCol cols="12" sm="6" md="3">
        <VCard
          class="stat-card"
          color="dashboardPrimary"
          dark
          elevation="4"
        >
          <VCardText>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h6 text-uppercase">
                  Total Pets
                </div>
                <div class="text-h2 font-weight-bold mt-2">
                  {{ totalPets }}
                </div>
              </div>
              <VIcon size="64" class="stat-icon">
                mdi-paw
              </VIcon>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Pending Requests Card -->
      <VCol cols="12" sm="6" md="3">
        <VCard
          class="stat-card"
          color="dashboardWarning"
          dark
          elevation="4"
        >
          <VCardText>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h6 text-uppercase">
                  Pending Requests
                </div>
                <div class="text-h2 font-weight-bold mt-2">
                  {{ pendingRequests }}
                </div>
              </div>
              <VIcon size="64" class="stat-icon">
                mdi-clock-outline
              </VIcon>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Approved Requests Card -->
      <VCol cols="12" sm="6" md="3">
        <VCard
          class="stat-card"
          color="dashboardInfo"
          dark
          elevation="4"
        >
          <VCardText>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h6 text-uppercase">
                  Approved Requests
                </div>
                <div class="text-h2 font-weight-bold mt-2">
                  {{ approvedRequests }}
                </div>
              </div>
              <VIcon size="64" class="stat-icon">
                mdi-check-circle
              </VIcon>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Fulfilled Adoptions Card -->
      <VCol cols="12" sm="6" md="3">
        <VCard
          class="stat-card"
          color="dashboardSuccess"
          dark
          elevation="4"
        >
          <VCardText>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h6 text-uppercase">
                  Fulfilled Adoptions
                </div>
                <div class="text-h2 font-weight-bold mt-2">
                  {{ fulfilledAdoptions }}
                </div>
              </div>
              <VIcon size="64" class="stat-icon">
                mdi-heart
              </VIcon>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Recent Activity Section -->
    <VRow class="mt-6">
      <VCol cols="12" md="6">
        <VCard elevation="2">
          <VCardTitle class="bg-surface">
            <VIcon left>
              mdi-chart-line
            </VIcon>
            Request Breakdown
          </VCardTitle>
          <VCardText>
            <VList>
              <VListItem>
                <VListItemTitle>
                  Visit Requests
                </VListItemTitle>
                <template #append>
                  <VChip color="info">
                    {{ visitRequestsCount }}
                  </VChip>
                </template>
              </VListItem>
              <VListItem>
                <VListItemTitle>
                  Adoption Requests
                </VListItemTitle>
                <template #append>
                  <VChip color="success">
                    {{ adoptionRequestsCount }}
                  </VChip>
                </template>
              </VListItem>
              <VListItem>
                <VListItemTitle>
                  Rejected Requests
                </VListItemTitle>
                <template #append>
                  <VChip color="error">
                    {{ rejectedRequests }}
                  </VChip>
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="6">
        <VCard elevation="2">
          <VCardTitle class="bg-surface">
            <VIcon left>
              mdi-trending-up
            </VIcon>
            Quick Stats
          </VCardTitle>
          <VCardText>
            <VList>
              <VListItem>
                <VListItemTitle>
                  Total Requests (All Time)
                </VListItemTitle>
                <template #append>
                  <VChip color="primary">
                    {{ totalRequests }}
                  </VChip>
                </template>
              </VListItem>
              <VListItem>
                <VListItemTitle>
                  Fulfilled Visits
                </VListItemTitle>
                <template #append>
                  <VChip color="success">
                    {{ fulfilledVisits }}
                  </VChip>
                </template>
              </VListItem>
              <VListItem>
                <VListItemTitle>
                  Active Users
                </VListItemTitle>
                <template #append>
                  <VChip color="dashboardInfo">
                    {{ activeUsers }}
                  </VChip>
                </template>
              </VListItem>
            </VList>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Request } from '@/model/Request.model'
import { PENDING, APPROVED, FULFILLED, REJECTED, ADOPT, VISIT } from '@/constants'

const props = defineProps<{
  requests: Request[]
  totalPets: number
}>()

// Calculate statistics
const pendingRequests = computed(() => 
  props.requests.filter(r => r.status === PENDING).length,
)

const approvedRequests = computed(() => 
  props.requests.filter(r => r.status === APPROVED).length,
)

const fulfilledAdoptions = computed(() => 
  props.requests.filter(r => r.status === FULFILLED && r.type === ADOPT).length,
)

const visitRequestsCount = computed(() => 
  props.requests.filter(r => r.type === VISIT).length,
)

const adoptionRequestsCount = computed(() => 
  props.requests.filter(r => r.type === ADOPT).length,
)

const rejectedRequests = computed(() => 
  props.requests.filter(r => r.status === REJECTED).length,
)

const totalRequests = computed(() => props.requests.length)

const fulfilledVisits = computed(() => 
  props.requests.filter(r => r.status === FULFILLED && r.type === VISIT).length,
)

// Get unique user IDs from requests
const activeUsers = computed(() => {
  const uniqueUsers = new Set(props.requests.map(r => r.userId))
  return uniqueUsers.size
})
</script>

<style scoped>
.stat-card {
  height: 100%;
  transition: transform 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  opacity: 0.3;
}

.bg-surface {
  background-color: rgb(var(--v-theme-surface));
}
</style>
