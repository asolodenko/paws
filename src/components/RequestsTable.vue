<template>
  <v-container>
    <v-data-table
      :headers="headersWithActions"
      :items="formattedRequests"
      class="elevation-1"
      item-key="pawName"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>{{ tableType }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <v-chip :color="getStatusColor(item.status)" dark>
          <v-icon left :icon="getStatusIcon(item.status)" />
          <template v-if="item.status === 'rejected'">
            <v-tooltip bottom>
              <template v-slot:activator="{ props }">
              <v-icon left v-bind="props" @click="props.isActive = !props.isActive">mdi-information</v-icon>
              </template>
              <span>{{ item.comment }}</span>
            </v-tooltip>
          </template>
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          class="mr-2"
          color="success"
          size="24"
          @click="handleAction(item, 'approve')"
        >
          mdi-check
        </v-icon>
        <v-icon
          color="error"
          size="24"
          @click="handleAction(item, 'reject')"
        >
          mdi-close
        </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref, defineEmits } from 'vue';
import { Request } from '@/model/Request.model';
import { APPROVED, FULFILLED, PENDING, REJECTED, UNFULFILLED } from '@/constants';

const props = defineProps<{
  requests: Request[],
  tableType: string,
}>();
const emit = defineEmits(['requestUpdate']);

const headers = ref([
  { title: 'Paw Name', key: 'pawName' },
  { title: 'User Name', key: 'userName' },
  { title: 'Email', key: 'email' },
  { title: 'Date', key: 'date' },
  { title: 'Time', key: 'time' },
  { title: 'Request Date', key: 'createdAt' },
  { title: 'Status', key: 'status' },
]);

const headersWithActions = computed(() => {
  return headers.value.concat({ title: 'Actions', key: 'actions' });
});

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
    };
  });
});

const getStatusColor = (status: string) => {
  switch (status) {
    case PENDING:
      return 'warning';
    case APPROVED:
    case FULFILLED:
      return 'success';
    case REJECTED:
      return 'error';
    default:
      return 'grey';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case PENDING:
      return 'mdi-clock-outline';
    case APPROVED:
      return 'mdi-check';
    case REJECTED:
      return 'mdi-close';
    case FULFILLED:
      return 'mdi-check-all';
    case UNFULFILLED:
      return 'mdi-close';
    default:
      return 'mdi-help';
  }
};

// add click handler function that will emit event to the parent component passing the request id and action type
const handleAction = (request: any, action: string) => {
  console.log(`Request: ${request}, Action: ${action}`);
  // emit event to parent component
  // if (props.requestUpdate) {
  //   props.requestUpdate(request);
  // }
  emit('requestUpdate', request, action);
};

</script>

<style scoped>
/* Add any custom styles here */

v-container {
  padding: 16px;
  max-width: 100%;
}
</style>