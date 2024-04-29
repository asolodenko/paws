<template>
  <h1 class="text-h1">Sign up</h1>

  <div class="py-14" />
  <v-btn
    color="primary"
    @click="login"
  >
    Sign in with Google btn
  </v-btn>
</template>

<script lang="ts" setup>
  import { handleSignIn } from '@/firebase';

  const login = () => {
    handleSignIn();
  }
</script>
