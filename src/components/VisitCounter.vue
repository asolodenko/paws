<template>
  <VCard class="mb-4" elevation="2">
    <VCardTitle class="text-subtitle-1">
      <VIcon icon="mdi-paw" class="mr-2" />
      Your Visit Progress
    </VCardTitle>
    <VCardText>
      <div class="mb-2 text-body-2">
        <span class="font-weight-bold">{{ visitCount }}/5</span> visits completed
      </div>
      <VProgressLinear
        :model-value="progressPercentage"
        :color="progressColor"
        height="20"
        striped
      >
        <template #default>
          <strong class="text-white">{{ progressPercentage }}%</strong>
        </template>
      </VProgressLinear>
      <div v-if="isEligibleForAdoption" class="mt-3 text-success text-body-2">
        <VIcon icon="mdi-check-circle" class="mr-1" />
        You're eligible to adopt this pet!
      </div>
      <div v-else class="mt-3 text-body-2 text-medium-emphasis">
        Complete {{ 5 - visitCount }} more visit{{ 5 - visitCount !== 1 ? 's' : '' }} to become eligible for adoption
      </div>
    </VCardText>
  </VCard>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  visitCount: number
  isEligibleForAdoption: boolean
}>()

const progressPercentage = computed(() => {
  return Math.min((props.visitCount / 5) * 100, 100)
})

const progressColor = computed(() => {
  if (props.visitCount >= 5) {
    return 'success'
  }
  if (props.visitCount >= 3) {
    return 'warning'
  }
  return 'primary'
})
</script>
