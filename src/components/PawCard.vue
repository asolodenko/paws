<template>
  <v-card color="primaryLight" style="width: 250px; height: 410px;">
    <div class="pa-6">
      <v-img src='./../assets/00001.jpg'></v-img>
    </div>
    
    <v-list-item class="mb-2">
      <template v-slot:title>
        <strong class="text-h6 mb-2">{{ props.paw.name }}</strong>
      </template>
    </v-list-item>

    <div class="d-flex flex-column flex-wrap align-start px-4">
      <div class="d-flex flex-row text-caption">
        <v-icon :icon="props.paw.gender === Gender.Male ? 'mdi-gender-male' : 'mdi-gender-female'" start></v-icon>

        <div class="text-truncate">{{ props.paw.gender }}</div>
      </div>
      <div class="d-flex flex-row text-caption">
        <v-icon icon="mdi-shape" start></v-icon>
        <div class="text-truncate">{{ props.paw.breed }}</div>
      </div>
      <div class="d-flex flex-row text-caption">
        <v-icon icon="mdi-cake" start></v-icon>
        <div class="text-truncate">{{ props.paw.birthDate }}</div>
      </div>

      <v-card-actions class="w-100 justify-end">
        <v-btn class="text-none" size="small" flat>
          See more >>>
        </v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { Paw, Gender } from '@/model/Paw.model.ts';
const props = defineProps<{
  paw: Paw
}>();
console.log(props.paw)
</script>

<style>
</style>