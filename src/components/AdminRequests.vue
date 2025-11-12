<template>
  <VContainer fluid>
    <VTabs v-model="requestsTab">
      <VTab>
        <VIcon left>
          mdi-calendar-clock
        </VIcon>
        Visit Requests
      </VTab>
      <VTab>
        <VIcon left>
          mdi-heart-outline
        </VIcon>
        Adoption Requests
      </VTab>
    </VTabs>
    
    <VTabsWindow v-model="requestsTab">
      <VTabsWindowItem :value="0">
        <RequestsTable
          :requests="visitRequests"
          :table-type="'Visit Requests'"
          @request-update="handleRequestUpdated"
        />
        <RequestsTable
          :requests="archiveVisitRequests"
          :table-type="'Archive'"
        />
      </VTabsWindowItem>
      
      <VTabsWindowItem :value="1">
        <RequestsTable
          :requests="adoptionRequests"
          :table-type="'Adoption Requests'"
          @request-update="handleRequestUpdated"
        />
        <RequestsTable
          :requests="archiveAdoptionRequests"
          :table-type="'Archive'"
        />
      </VTabsWindowItem>
    </VTabsWindow>
  </VContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Request } from '@/model/Request.model'
import RequestsTable from '@/components/RequestsTable.vue'

defineProps<{
  visitRequests: Request[]
  archiveVisitRequests: Request[]
  adoptionRequests: Request[]
  archiveAdoptionRequests: Request[]
}>()

const emit = defineEmits(['requestUpdate'])

const requestsTab = ref(0)

const handleRequestUpdated = (request: Request, action: string) => {
  emit('requestUpdate', request, action)
}
</script>
