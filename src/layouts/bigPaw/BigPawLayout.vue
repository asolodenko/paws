<template>
  <v-app :icon="'mdi-paw'">
    <div class="background-image"></div>
    <app-header />
    <v-main>
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
  // import DefaultView from './View.vue'
</script>

<style>
.background-image {
  /* Set your background image here */
  background-image: url('@/assets/bigpaw.svg');
  /* Adjust background styles as needed */
  background-position: bottom right;
  background-repeat: no-repeat;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>