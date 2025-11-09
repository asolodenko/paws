<template>
  <VContainer fluid>
    <VRow>
      <VCol cols="12">
        <VCard elevation="2">
          <VCardTitle class="d-flex align-center">
            <VIcon class="mr-2">
              mdi-paw
            </VIcon>
            Pet Inventory Management
            <VSpacer />
            <VBtn
              color="primary"
              prepend-icon="mdi-plus"
              @click="openCreateDialog"
            >
              Add New Pet
            </VBtn>
          </VCardTitle>
          
          <VCardText>
            <VTextField
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search pets..."
              single-line
              hide-details
              class="mb-4"
              clearable
            />
            
            <VDataTable
              :headers="headers"
              :items="pets"
              :search="search"
              :loading="loading"
              item-key="id"
              class="elevation-1"
            >
              <template #[`item.img`]="{ item }">
                <VAvatar size="48" class="my-2">
                  <VImg :src="item.img" :alt="item.name" />
                </VAvatar>
              </template>
              
              <template #[`item.gender`]="{ item }">
                <VChip
                  :color="item.gender === 'Male' ? 'blue' : 'pink'"
                  size="small"
                  dark
                >
                  <VIcon left size="small">
                    {{ item.gender === 'Male' ? 'mdi-gender-male' : 'mdi-gender-female' }}
                  </VIcon>
                  {{ item.gender }}
                </VChip>
              </template>
              
              <template #[`item.birthDate`]="{ item }">
                {{ formatDate(item.birthDate) }}
              </template>
              
              <template #[`item.healthCondition`]="{ item }">
                <VChip
                  :color="getHealthColor(item.healthCondition)"
                  size="small"
                >
                  {{ item.healthCondition }}
                </VChip>
              </template>
              
              <template #[`item.actions`]="{ item }">
                <VTooltip bottom>
                  <template #activator="{ props }">
                    <VBtn
                      icon
                      size="small"
                      color="primary"
                      v-bind="props"
                      @click="openEditDialog(item)"
                    >
                      <VIcon>
                        mdi-pencil
                      </VIcon>
                    </VBtn>
                  </template>
                  <span>Edit</span>
                </VTooltip>
                
                <VTooltip bottom>
                  <template #activator="{ props }">
                    <VBtn
                      icon
                      size="small"
                      color="error"
                      class="ml-2"
                      v-bind="props"
                      @click="openDeleteDialog(item)"
                    >
                      <VIcon>
                        mdi-delete
                      </VIcon>
                    </VBtn>
                  </template>
                  <span>Delete</span>
                </VTooltip>
              </template>
            </VDataTable>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    
    <!-- Delete Confirmation Dialog -->
    <VDialog v-model="deleteDialog" max-width="500">
      <VCard>
        <VCardTitle class="text-h5">
          Confirm Deletion
        </VCardTitle>
        <VCardText>
          Are you sure you want to delete <strong>{{ petToDelete?.name }}</strong>? This action cannot be undone.
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="grey"
            variant="text"
            @click="deleteDialog = false"
          >
            Cancel
          </VBtn>
          <VBtn
            color="error"
            variant="elevated"
            :loading="deleteLoading"
            @click="confirmDelete"
          >
            Delete
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Paw } from '@/model/Paw.model'

defineProps<{
  pets: Paw[]
  loading: boolean
}>()

const emit = defineEmits(['create', 'edit', 'delete'])

const search = ref('')
const deleteDialog = ref(false)
const petToDelete = ref<Paw | null>(null)
const deleteLoading = ref(false)

const headers = [
  { title: 'Image', key: 'img', sortable: false },
  { title: 'Name', key: 'name' },
  { title: 'Gender', key: 'gender' },
  { title: 'Breed', key: 'breed' },
  { title: 'Birth Date', key: 'birthDate' },
  { title: 'Weight', key: 'weight' },
  { title: 'Health', key: 'healthCondition' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getHealthColor = (condition: string) => {
  switch (condition) {
    case 'healthy':
      return 'success'
    case 'underweight':
    case 'overweight':
      return 'warning'
    case 'dental issues':
      return 'error'
    default:
      return 'grey'
  }
}

const openCreateDialog = () => {
  emit('create')
}

const openEditDialog = (pet: Paw) => {
  emit('edit', pet)
}

const openDeleteDialog = (pet: Paw) => {
  petToDelete.value = pet
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!petToDelete.value) {
    return
  }
  
  deleteLoading.value = true
  try {
    await emit('delete', petToDelete.value.id)
    deleteDialog.value = false
    petToDelete.value = null
  } finally {
    deleteLoading.value = false
  }
}
</script>

<style scoped>
.v-data-table {
  border-radius: 4px;
}
</style>
