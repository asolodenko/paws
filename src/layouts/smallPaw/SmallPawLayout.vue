<template>
  <v-defaults-provider :defaults="{ VApp: { style: 'font-family: Jua, sans-serif; font-weight: 400; font-style: normal;' } }">
    <v-app>
      <div class="background-image"></div>
      <app-header />

      <v-main>
        <router-view />
      </v-main>
    </v-app>
  </v-defaults-provider>
</template>

<script lang="ts" setup>
  import AppHeader from '@/components/AppHeader.vue'
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