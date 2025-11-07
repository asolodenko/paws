<template>
  <VContainer class="fill-height">
    <VResponsive class="align-center text-center fill-height">
      <!-- <v-img height="300" src="@/assets/logo.svg" /> -->

      <div class="text-body-2 font-weight-light mb-n1">
        Welcome to
      </div>

      <h1 class="text-h2 font-weight-bold">
        Vuetify
      </h1>

      <div class="py-14"></div>

      <VRow class="d-flex align-center justify-center">
        <VCol cols="auto">
          <VBtn
            href="https://vuetifyjs.com/components/all/"
            min-width="164"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
          >
            <VIcon
              icon="mdi-view-dashboard"
              size="large"
              start
            />

            Components
          </VBtn>
        </VCol>

        <VCol cols="auto">
          <VBtn
            color="primary"
            href="https://vuetifyjs.com/introduction/why-vuetify/#feature-guides"
            min-width="228"
            rel="noopener noreferrer"
            size="x-large"
            target="_blank"
            variant="flat"
          >
            <VIcon
              icon="mdi-speedometer"
              size="large"
              start
            />

            Get Started
          </VBtn>
        </VCol>

        <VCol cols="auto">
          <VBtn
            href="https://community.vuetifyjs.com/"
            min-width="164"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
          >
            <VIcon
              icon="mdi-account-group"
              size="large"
              start
            />

            Community
          </VBtn>
        </VCol>
      </VRow>
    </VResponsive>
  </VContainer>
</template>

<script lang="ts" setup>
  //
</script>