<template>
  <h1 class="text-h1">Account page</h1>

  <div class="py-14" />
  <v-btn
    color="primary"
    @click="logout"
  >
    Sign out
  </v-btn>
</template>

<script lang="ts" setup>
  import { handleSignOut } from '@/firebase';

  const logout = () => {
    handleSignOut();
  }
</script>
