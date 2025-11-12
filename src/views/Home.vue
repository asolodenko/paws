<template>
  <h1 class="text-h1 color-primary">
    The paws
  </h1>

  <div class="d-flex w-50 my-8">
    <h3 class="font-weight-medium">
      We help cats find homes and gentle parents. Please login to have access to all features. Or just find your paws first.
    </h3>
  </div>

  <VRow class="d-flex align-center">
    <VCol cols="auto">
      <VBtn
        to="/paws"
        color="primary"
      >
        Find my paws
      </VBtn>
    </VCol>

    <VCol cols="auto">
      <VBtn
        v-if="!userStore.isAuth"
        variant="outlined"
        to="/login"
      >
        Login
      </VBtn>
    </VCol>
  </VRow>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/user'

  const userStore = useUserStore()
</script>
