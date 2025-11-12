<template>
  <VContainer>
    <VDataTable
      :headers="isAdmin ? headersWithActions : headers"
      :items="formattedRequests"
      class="elevation-1"
      item-key="pawName"
    >
      <template #top>
        <VToolbar flat>
          <VToolbarTitle>{{ tableType }}</VToolbarTitle>
          <VDivider class="mx-4" inset vertical />
        </VToolbar>
      </template>
      <template #[`item.status`]="{ item }">
        <VChip :color="getStatusColor(item.status)" dark>
          <VIcon left :icon="getStatusIcon(item.status)" />
          <template v-if="item.status === 'rejected'">
            <VTooltip bottom>
              <template #activator="{ props }">
                <VIcon left v-bind="props" @click="props.isActive = !props.isActive">
                  mdi-information
                </VIcon>
              </template>
              <span>{{ item.comment }}</span>
            </VTooltip>
          </template>
          {{ item.status }}
        </VChip>
      </template>
      <template v-if="isAdmin" #[`item.actions`]="{ item }">
        <VTooltip bottom>
          <template #activator="{ props }">
            <VIcon
              v-if="item.status === PENDING"
              class="mr-2"
              color="success"
              size="24"
              v-bind="props"
              @click="handleAction(item, 'approve')"
            >
              mdi-check
            </VIcon>
          </template>
          <span>Approve</span>
        </VTooltip>
        <VTooltip bottom>
          <template #activator="{ props }">
            <VIcon
              v-if="item.status === PENDING"
              color="error"
              size="24"
              v-bind="props"
              @click="handleAction(item, 'reject')"
            >
              mdi-close
            </VIcon>
          </template>
          <span>Reject</span>
        </VTooltip>
        <VTooltip bottom>
          <template #activator="{ props }">
            <VIcon
              v-if="item.status === APPROVED"
              color="success"
              size="24"
              v-bind="props"
              @click="handleAction(item, 'fulfill')"
            >
              mdi-check-all
            </VIcon>
          </template>
          <span>Fulfill</span>
        </VTooltip>
        <VTooltip bottom>
          <template #activator="{ props }">
            <VIcon
              v-if="item.status === APPROVED"
              color="error"
              size="24"
              v-bind="props"
              @click="handleAction(item, 'unfulfill')"
            >
              mdi-close
            </VIcon>
          </template>
          <span>Unfulfill</span>
        </VTooltip>
        <VTooltip bottom>
          <template #activator="{ props }">
            <VIcon
              v-if="item.status === REJECTED"
              color="blue-grey-darken-2"
              size="24"
              v-bind="props"
              @click="handleAction(item, 'unfulfill')"
            >
              mdi-archive-arrow-down
            </VIcon>
          </template>
          <span>Unfulfill</span>
        </VTooltip>
      </template>
    </VDataTable>
  </VContainer>
</template>

<script lang="ts" setup>
import { computed, ref, defineEmits } from 'vue'
import { Request } from '@/model/Request.model'
import { APPROVED, FULFILLED, PENDING, REJECTED, UNFULFILLED } from '@/constants'
import { useUserStore } from '@/store/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)

const props = defineProps<{
  requests: Request[],
  tableType: string,
}>()
const emit = defineEmits(['requestUpdate'])

const headers = ref([
  { title: 'Paw Name', key: 'pawName' },
  { title: 'User Name', key: 'userName' },
  { title: 'Email', key: 'email' },
  { title: 'Date', key: 'date' },
  { title: 'Time', key: 'time' },
  { title: 'Request Date', key: 'createdAt' },
  { title: 'Status', key: 'status' },
])

const headersWithActions = computed(() => {
  return headers.value.concat({ title: 'Actions', key: 'actions' })
})

const formattedRequests = computed(() => {
  return props.requests.map((request) => {
    return {
      id: request.id,
      pawName: request.pawName,
      userName: request.userName,
      email: request.userEmail,
      date: request.date && new Date(request.date).toLocaleDateString(),
      time: request.time,
      createdAt: new Date(request.createdAt).toLocaleDateString(),
      status: request.status,
      comment: request.comment,
    }
  })
})

const getStatusColor = (status: string) => {
  switch (status) {
    case PENDING:
      return 'warning'
    case APPROVED:
    case FULFILLED:
      return 'success'
    case REJECTED:
      return 'error'
    default:
      return 'grey'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case PENDING:
      return 'mdi-clock-outline'
    case APPROVED:
      return 'mdi-check'
    case REJECTED:
      return 'mdi-close'
    case FULFILLED:
      return 'mdi-check-all'
    case UNFULFILLED:
      return 'mdi-close'
    default:
      return 'mdi-help'
  }
}

const handleAction = (request: any, action: string) => {
  emit('requestUpdate', request, action)
}

</script>

<style scoped>
/* Add any custom styles here */

v-container {
  padding: 16px;
  max-width: 100%;
}
</style>