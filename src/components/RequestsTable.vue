<template>
  <v-container>
    <v-data-table
      :headers="headers" 
      :items="formattedRequests"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ tableType }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
        </v-toolbar>
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip :color="getStatusColor(item.status)" dark>
          <v-icon left :icon="getStatusIcon(item.status)" />
          <template v-if="item.status === 'rejected'">
            <v-tooltip bottom>
              <template v-slot:activator="{ isActive, props }">
              <v-icon left v-bind="props" @click="props.isActive = !props.isActive">mdi-information</v-icon>
              </template>
              <span>{{ item.comment }}</span>
            </v-tooltip>
          </template>
          {{ item.status }}
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { Request } from '@/model/Request.model';

const props = defineProps<{
  requests: Request[],
  tableType: string,
}>();
const headers = ref([
  { title: 'Paw Name', key: 'pawName' },
  { title: 'User Name', key: 'userName' },
  { title: 'Email', key: 'email' },
  { title: 'Date', key: 'date' },
  { title: 'Time', key: 'time' },
  { title: 'Request Date', key: 'createdAt' },
  { title: 'Status', key: 'status' },
]);


const formattedRequests = computed(() => {
  return props.requests.map((request) => {
    return {
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
    case 'pending':
      return 'warning';
    case 'approved':
    case 'fulfilled':
      return 'success';
    case 'rejected':
      return 'error';
    default:
      return 'grey';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return 'mdi-clock-outline';
    case 'approved':
      return 'mdi-check';
    case 'rejected':
      return 'mdi-close';
    case 'fulfilled':
      return 'mdi-check-all';
    case 'unfulfilled':
      return 'mdi-close';
    default:
      return 'mdi-help';
  }
};

</script>

<style scoped>
/* Add any custom styles here */

v-container {
  padding: 16px;
  max-width: 100%;
}
</style>