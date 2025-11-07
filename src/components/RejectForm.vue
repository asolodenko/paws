<template>
  <p>
    Reject with a comment
  </p>
  <VTextField
    v-model="comment"
    label="Comment"
    prepend-icon="mdi-comment"
    required
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const comment = ref('')
</script>