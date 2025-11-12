<template>
  <h1 class="text-h1">
    Sign up
  </h1>

  <div class="py-14"></div>
  <VBtn
    color="primary"
    @click="login"
  >
    Sign in with Google btn
  </VBtn>
</template>

<script lang="ts" setup>
import { handleSignIn } from '@/auth'

  const login = () => {
    handleSignIn()
  }
</script>
