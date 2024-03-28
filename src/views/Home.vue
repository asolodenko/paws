<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-start fill-height">
      <!-- <v-img height="300" src="@/assets/logo.svg" /> -->

      
      <h1 class="text-h1 color-primary">The paws</h1>
    <!-- </v-defaults-provider> -->

      <div class="py-14" />

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
          >
            Login
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
</script>
