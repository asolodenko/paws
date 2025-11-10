<template>
  <VContainer
    fluid
    class="paws-list-container fill-height"
  >
    <VResponsive
      v-if="paws.length"
      class="fill-height"
    >
      <VDataIterator
        :items="props.paws"
        :items-per-page="8"
        :search="search"
        :sort-by="[{ key: 'name', order: 'asc' }]"
        class="fill-height bg-transparent"
      >
        <template #header>
          <div class="mb-6">
            <h1 class="text-h3 text-md-h2 font-weight-bold mb-2">
              Meet Our Cats
            </h1>
            <p class="text-h6 text-medium-emphasis mb-6">
              Find your perfect feline companion
            </p>

            <VCard
              elevation="0"
              rounded="xl"
              class="search-bar-card pa-2"
            >
              <VTextField
                v-model="search"
                density="comfortable"
                placeholder="Search by name, breed, or temperament..."
                prepend-inner-icon="mdi-magnify"
                variant="solo"
                flat
                clearable
                hide-details
                rounded="lg"
                class="search-field"
              />
            </VCard>
          </div>
        </template>

        <template #default="{ items }">
          <VContainer
            fluid
            class="pa-0"
          >
            <VRow
              v-if="items.length"
              class="cards-grid"
            >
              <VCol
                v-for="item in items"
                :key="item.raw.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="d-flex justify-center paw-card-col"
              >
                <PawCard :paw="item.raw" />
              </VCol>
            </VRow>

            <!-- No Results State -->
            <VRow
              v-else
              class="fill-height"
              align="center"
              justify="center"
            >
              <VCol
                cols="12"
                class="text-center py-12"
              >
                <VIcon
                  size="80"
                  color="primary"
                  class="mb-4"
                >
                  mdi-cat
                </VIcon>
                <h3 class="text-h5 mb-2">
                  No cats found
                </h3>
                <p class="text-body-1 text-medium-emphasis">
                  Try adjusting your search criteria
                </p>
              </VCol>
            </VRow>
          </VContainer>
        </template>

        <template #footer="{ page, pageCount, prevPage, nextPage }">
          <VCard
            elevation="0"
            rounded="xl"
            class="mt-6 pa-4"
          >
            <div class="d-flex align-center justify-center flex-wrap ga-4">
              <VBtn
                :disabled="page === 1"
                icon
                variant="tonal"
                color="primary"
                size="large"
                rounded="lg"
                @click="prevPage"
              >
                <VIcon>mdi-chevron-left</VIcon>
              </VBtn>

              <VChip
                color="primary"
                variant="flat"
                size="large"
                class="px-6"
              >
                <span class="font-weight-medium">
                  Page {{ page }} of {{ pageCount }}
                </span>
              </VChip>

              <VBtn
                :disabled="page >= pageCount"
                icon
                variant="tonal"
                color="primary"
                size="large"
                rounded="lg"
                @click="nextPage"
              >
                <VIcon>mdi-chevron-right</VIcon>
              </VBtn>
            </div>
          </VCard>
        </template>

        <template #loader>
          <VContainer
            fluid
            class="pa-0"
          >
            <VRow class="cards-grid">
              <VCol
                v-for="(_, k) in [0, 1, 2, 3, 4, 5, 6, 7]"
                :key="k"
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="d-flex justify-center"
              >
                <VSkeletonLoader
                  class="skeleton-card"
                  type="image, article, actions"
                  rounded="xl"
                />
              </VCol>
            </VRow>
          </VContainer>
        </template>
      </VDataIterator>
    </VResponsive>

    <!-- Loading State -->
    <VResponsive
      v-else
      class="fill-height"
    >
      <VContainer class="fill-height">
        <VRow
          class="fill-height"
          align="center"
          justify="center"
        >
          <VCol
            cols="12"
            class="text-center"
          >
            <VProgressCircular
              indeterminate
              color="primary"
              size="64"
              width="6"
              class="mb-4"
            />
            <p class="text-h6 text-medium-emphasis">
              Loading our adorable cats...
            </p>
          </VCol>
        </VRow>
      </VContainer>
    </VResponsive>
  </VContainer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import PawCard from '@/components/PawCard.vue'
import { Paw } from '@/model/Paw.model'

const props = defineProps<{
  paws: Paw[]
}>()

const search = ref('')
</script>

<style scoped>
.paws-list-container {
  padding: 2rem 1rem;
}

.search-bar-card {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-bar-card:focus-within {
  background: rgba(var(--v-theme-surface), 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.cards-grid {
  gap: 1.5rem;
}

.paw-card-col {
  animation: fadeInUp 0.5s ease-out backwards;
}

.paw-card-col:nth-child(1) { animation-delay: 0.05s; }
.paw-card-col:nth-child(2) { animation-delay: 0.1s; }
.paw-card-col:nth-child(3) { animation-delay: 0.15s; }
.paw-card-col:nth-child(4) { animation-delay: 0.2s; }
.paw-card-col:nth-child(5) { animation-delay: 0.25s; }
.paw-card-col:nth-child(6) { animation-delay: 0.3s; }
.paw-card-col:nth-child(7) { animation-delay: 0.35s; }
.paw-card-col:nth-child(8) { animation-delay: 0.4s; }

.skeleton-card {
  width: 280px;
  height: 380px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .paws-list-container {
    padding: 1rem 0.5rem;
  }
}
</style>