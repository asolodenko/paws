<template>
  <v-app :icon="'mdi-paw'">
    <div class="background-image"></div>
    <app-header />

    <v-main>
      <VSnackbar v-model="snackbar.show" :color="snackbar.color">
        {{ snackbar.text }}
      </VSnackbar>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import AppHeader from '@/components/AppHeader.vue'
  import { useSnackbarStore } from "@/store/useSnackbarStore";
  const snackbar = useSnackbarStore();
</script>

<style>
.background-image {
  /* Set your background image here */
  background-image: url('@/assets/smallpaw.svg');
  /* Adjust background styles as needed */
  background-position: bottom right;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>