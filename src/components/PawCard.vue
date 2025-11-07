<template>
  <VCard color="primaryLight" style="width: 250px; height: 410px;">
    <div class="pa-6">
      <VImg src="./../assets/00001.jpg" />
    </div>
    
    <VListItem class="mb-2">
      <template #title>
        <strong class="text-h6 mb-2">{{ props.paw?.name }}</strong>
      </template>
    </VListItem>

    <div class="d-flex flex-column flex-wrap align-start px-4">
      <div class="d-flex flex-row text-caption">
        <VIcon :icon="props.paw?.gender === Male ? 'mdi-gender-male' : 'mdi-gender-female'" start />

        <div class="text-truncate">
          {{ props.paw?.gender }}
        </div>
      </div>
      <div class="d-flex flex-row text-caption">
        <VIcon icon="mdi-shape" start />
        <div class="text-truncate">
          {{ props.paw?.breed }}
        </div>
      </div>
      <div class="d-flex flex-row text-caption">
        <VIcon icon="mdi-cake" start />
        <div class="text-truncate">
          {{ props.paw?.birthDate }}
        </div>
      </div>

      <VCardActions class="w-100 justify-end">
        <AppLink :to="`/paws/${props.paw?.id}`" inactive-class="text-primary text-decoration-none">
          See more >>>
        </AppLink>
      </VCardActions>
    </div>
  </VCard>
</template>

<script lang="ts" setup>
import { Paw, Male } from '@/model/Paw.model'
import AppLink from '@/components/AppLink.vue'

const props = defineProps<{
  paw: Paw | null
}>()
</script>

<style>
</style>