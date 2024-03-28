<template>
  <v-app-bar flat color="primary">
    <v-app-bar-title>
      <v-btn to="/" variant="text">The paws</v-btn>
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn to="/about" variant="text">About us</v-btn>

      <v-btn variant="text">Contact us</v-btn>

      <v-btn variant="text" v-if="isAuth()">Login</v-btn>
  </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
  //
  
  function isAuth() { return true; }
  
</script>
