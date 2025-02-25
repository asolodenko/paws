<template>
  <p>
    Reject with a comment
  </p>
  <v-text-field
    v-model="comment"
    label="Comment"
    prepend-icon="mdi-comment"
    required
  ></v-text-field>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const comment = ref('');
</script>