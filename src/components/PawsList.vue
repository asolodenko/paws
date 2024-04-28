<template>
  <v-container style="height: 98%;">
    <v-responsive class="fill-height">
      <!-- <v-card> -->
        <v-data-iterator :items="paws" :items-per-page="8" :search="search" class="fill-height">
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
                <v-col v-for="item in items" :key="item.raw.id" cols="12" lg="3" md="4" sm="6">
                  <PawCard :paw="item.raw" />
                </v-col>
              </v-row>
            </v-container>
          </template>

        <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
          <div class="d-flex align-center justify-center pa-4">
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
        </v-data-iterator>
      <!-- </v-card> -->
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import paws from './MOCK_DATA.ts';
import PawCard from '@/components/PawCard.vue';
const search = '';
</script>

<style>
</style>