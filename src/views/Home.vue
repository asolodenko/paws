<template>
  <h1 class="text-h1 color-primary">The paws</h1>

  <div class="d-flex w-50 my-8">
    <h3 class="font-weight-medium">
      We help cats find homes and gentle parents. Please login to have access to all features. Or just find your paws first.
    </h3>
  </div>

  <v-row class="d-flex align-center">
    <v-col cols="auto">
      <v-btn
        to="/paws"
        color="primary"
      >
        Find my paws
      </v-btn>
    </v-col>

    <v-col cols="auto">
      <v-btn
        variant="outlined"
        to="/login"
        v-if="!userStore.isAuth"
      >
        Login
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/user';

  const userStore = useUserStore();
</script>
