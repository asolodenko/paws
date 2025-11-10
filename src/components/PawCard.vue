<template>
  <VCard
    :to="`/paws/${props.paw?.id}`"
    class="paw-card"
    :elevation="isHovered ? 8 : 2"
    rounded="xl"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Image Section -->
    <div class="image-wrapper">
      <VImg
        src="./../assets/00001.jpg"
        :alt="`Photo of ${props.paw?.name}`"
        height="220"
        cover
        class="paw-image"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <VProgressCircular
              indeterminate
              color="primary"
            />
          </div>
        </template>
      </VImg>
      
      <!-- Gender Badge -->
      <VChip
        :color="props.paw?.gender === Male ? 'blue' : 'pink'"
        class="gender-chip"
        size="small"
        variant="elevated"
      >
        <VIcon
          :icon="props.paw?.gender === Male ? 'mdi-gender-male' : 'mdi-gender-female'"
          start
        />
        {{ props.paw?.gender }}
      </VChip>
    </div>

    <!-- Content Section -->
    <VCardText class="pa-4">
      <h3 class="text-h6 font-weight-bold mb-3 text-truncate">
        {{ props.paw?.name }}
      </h3>

      <div class="info-items">
        <div class="info-item">
          <VIcon
            icon="mdi-shape"
            size="small"
            color="primary"
            class="info-icon"
          />
          <span class="text-body-2 text-truncate">{{ props.paw?.breed }}</span>
        </div>

        <div class="info-item">
          <VIcon
            icon="mdi-cake"
            size="small"
            color="primary"
            class="info-icon"
          />
          <span class="text-body-2 text-truncate">{{ props.paw?.birthDate }}</span>
        </div>
      </div>
    </VCardText>

    <!-- Actions -->
    <VCardActions class="px-4 pb-4 pt-0">
      <VBtn
        :to="`/paws/${props.paw?.id}`"
        variant="tonal"
        color="primary"
        block
        class="text-none learn-more-btn"
        rounded="lg"
      >
        Learn More
        <VIcon
          end
          class="arrow-icon"
        >
          mdi-arrow-right
        </VIcon>
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Paw, Male } from '@/model/Paw.model'

const props = defineProps<{
  paw: Paw | null
}>()

const isHovered = ref(false)
</script>

<style scoped>
.paw-card {
  width: 280px;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.paw-card:hover {
  transform: translateY(-8px);
}

.image-wrapper {
  position: relative;
  overflow: hidden;
}

.paw-image {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.paw-card:hover .paw-image {
  transform: scale(1.05);
}

.gender-chip {
  position: absolute;
  top: 12px;
  right: 12px;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.info-icon {
  flex-shrink: 0;
}

.learn-more-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.arrow-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.paw-card:hover .arrow-icon {
  transform: translateX(4px);
}
</style>