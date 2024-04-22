<template>
  <v-card class="pb-3" color="primary">
    <v-img src='./../assets/00001.jpg' height="300px"></v-img>

    <v-list-item class="mb-2">
      <template v-slot:title>
        <strong class="text-h6 mb-2">{{ props.paw.name }}</strong>
      </template>
    </v-list-item>

    <div class="d-flex justify-space-between px-4">
      <div class="d-flex align-center text-caption text-medium-emphasis me-1">
        <v-icon icon="mdi-clock" start></v-icon>

        <div class="text-truncate">{{ props.paw.gender }}</div>
      </div>
      <div class="d-flex align-center text-caption text-medium-emphasis me-1">
        <v-icon icon="mdi-clock" start></v-icon>
        <div class="text-truncate">{{ props.paw.breed }}</div>
      </div>
      <div class="d-flex align-center text-caption text-medium-emphasis me-1">
        <v-icon icon="mdi-clock" start></v-icon>
        <div class="text-truncate">{{ props.paw.birthDate }}</div>
      </div>

      <v-btn class="text-none" size="small" text="See more >>>"  flat>
      </v-btn>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { Paw } from '@/model/Paw.model.ts';
const props = defineProps<{
  paw: Paw
}>();
console.log(props.paw)
</script>

<style>
</style>