<template>
  <VApp :icon="'mdi-paw'">
    <div class="background-image"></div>
    <AppHeader />

    <VMain>
      <VSnackbar v-model="snackbar.show" :color="snackbar.color">
        {{ snackbar.text }}
      </VSnackbar>
      <VContainer fluid>
        <VResponsive>
          <RouterView />
        </VResponsive>
      </VContainer>
    </VMain>
  </VApp>
</template>

<script lang="ts" setup>
  import AppHeader from '@/components/AppHeader.vue'
  import { useSnackbarStore } from '@/store/useSnackbarStore'
  const snackbar = useSnackbarStore()
</script>

<style>
.background-image {
  background-image: url('@/assets/cat-paw.png');
  /* Adjust background styles as needed */
  background-position: bottom right;
  background-repeat: no-repeat;
  background-size: contain;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 10%;
  height: 10%;
}
</style>