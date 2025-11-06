<template>
  <v-app :icon="'mdi-paw'">
    <div class="background-image"></div>
    <app-header />
    <v-main>
      <VSnackbar v-model="snackbar.show" :color="snackbar.color">
        {{ snackbar.text }}
      </VSnackbar>
      <v-container>
        <v-responsive class="text-start mt-16 pt-16">
          <router-view />
        </v-responsive>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import AppHeader from '@/components/AppHeader.vue'
  import { useSnackbarStore } from "@/store/useSnackbarStore";
  const snackbar = useSnackbarStore();
  // import DefaultView from './View.vue'
</script>

<style>
.background-image {
  /* Set your background image here */
  background-image: url('@/assets/cat-paw.png');
  /* Adjust background styles as needed */
  background-position: bottom right;
  background-repeat: no-repeat;
  background-size: contain;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 30%;
  height: 30%;
}
</style>