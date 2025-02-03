<template>
  <v-container class="fill-height">
    <v-responsive class="fill-height" v-if="paws.length">
      <!-- <v-card> -->
        <!-- sort by name, age; other for filters -->
        <v-data-iterator
          :items="props.paws"
          :items-per-page="8"
          :search="search"
          :sort-by="[{key: 'name', order: 'asc'}]"
          class="fill-height">
          <template v-slot:header>
            <v-toolbar class="px-2">
              <v-text-field
                v-model="search"
                density="comfortable"
                placeholder="Search"
                prepend-inner-icon="mdi-magnify"
                style="max-width: 300px"
                variant="solo"
                clearable
                hide-details
              ></v-text-field>
            </v-toolbar>
          </template>

          <template v-slot:default="{ items }">
            <v-container class="pa-2" fluid>
              <v-row dense>
                <v-col v-for="item in items"
                  :key="item.raw.id"
                  :cols="12" lg="3" md="4" sm="6"
                  class="d-flex justify-center">
                  <PawCard :paw="item.raw" />
                </v-col>
              </v-row>
            </v-container>
          </template>

        <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
          <div class="d-flex align-center justify-center pa-2">
            <v-btn
              :disabled="page === 1"
              density="comfortable"
              icon="mdi-arrow-left"
              variant="tonal"
              rounded
              @click="prevPage"
            ></v-btn>

            <div class="mx-2 text-caption">
              Page {{ page }} of {{ pageCount }}
            </div>

            <v-btn
              :disabled="page >= pageCount"
              density="comfortable"
              icon="mdi-arrow-right"
              variant="tonal"
              rounded
              @click="nextPage"
            ></v-btn>
          </div>
        </template>

        <template v-slot:loader>
          <v-container class="pa-2" fluid>
          <v-row>
            <v-col
              v-for="(_, k) in [0, 1, 2, 3, 4, 5, 6, 7]"
              :key="k"
              cols="12" lg="3" md="4" sm="6"
              class="d-flex justify-center"
            >
              <v-skeleton-loader
                style="height: 410px; width: 250px;"
                class="border"
                type="image, article"
              ></v-skeleton-loader>
            </v-col>
          </v-row>
        </v-container>
        </template>
        </v-data-iterator>
      <!-- </v-card> -->
    </v-responsive>
    <v-responsive v-else>
      <v-container class="fill-height">
        <v-row class="fill-height" align="center" justify="center">
          <v-col cols="12" class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
            ></v-progress-circular>
          </v-col>
        </v-row>
      </v-container>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import PawCard from '@/components/PawCard.vue';
import { Paw } from '@/model/Paw.model';
const props = defineProps<{
  paws: Paw[]
}>();
const search = ref('');
</script>

<style>
</style>