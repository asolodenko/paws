<template>
  <VContainer class="fill-height">
    <VResponsive v-if="paws.length" class="fill-height">
      <!-- <v-card> -->
      <!-- sort by name, age; other for filters -->
      <VDataIterator
        :items="props.paws"
        :items-per-page="8"
        :search="search"
        :sort-by="[{key: 'name', order: 'asc'}]"
        class="fill-height bg-transparent"
      >
        <template #header>
          <VToolbar class="px-2">
            <VTextField
              v-model="search"
              density="comfortable"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              style="max-width: 300px"
              variant="solo"
              clearable
              hide-details
            />
          </VToolbar>
        </template>

        <template #default="{ items }">
          <VContainer class="pa-2" fluid>
            <VRow dense>
              <VCol
                v-for="item in items"
                :key="item.raw.id"
                :cols="12"
                lg="3"
                md="4"
                sm="6"
                class="d-flex justify-center"
              >
                <PawCard :paw="item.raw" />
              </VCol>
            </VRow>
          </VContainer>
        </template>

        <template #footer="{ page, pageCount, prevPage, nextPage }">
          <div class="d-flex align-center justify-center pa-2">
            <VBtn
              :disabled="page === 1"
              density="comfortable"
              icon="mdi-arrow-left"
              variant="tonal"
              rounded
              @click="prevPage"
            />

            <div class="mx-2 text-caption">
              Page {{ page }} of {{ pageCount }}
            </div>

            <VBtn
              :disabled="page >= pageCount"
              density="comfortable"
              icon="mdi-arrow-right"
              variant="tonal"
              rounded
              @click="nextPage"
            />
          </div>
        </template>

        <template #loader>
          <VContainer class="pa-2" fluid>
            <VRow>
              <VCol
                v-for="(_, k) in [0, 1, 2, 3, 4, 5, 6, 7]"
                :key="k"
                cols="12"
                lg="3"
                md="4"
                sm="6"
                class="d-flex justify-center"
              >
                <VSkeletonLoader
                  style="height: 410px; width: 250px;"
                  class="border"
                  type="image, article"
                />
              </VCol>
            </VRow>
          </VContainer>
        </template>
      </VDataIterator>
      <!-- </v-card> -->
    </VResponsive>
    <VResponsive v-else>
      <VContainer class="fill-height">
        <VRow class="fill-height" align="center" justify="center">
          <VCol cols="12" class="text-center">
            <VProgressCircular
              indeterminate
              color="primary"
            />
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

<style>
</style>