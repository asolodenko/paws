<template>
  <VContainer fluid class="pa-0">
    <!-- Hero Section -->
    <VRow class="hero-section" no-gutters>
      <VCol cols="12" class="text-center py-16">
        <div class="hero-content">
          <h1 class="text-h2 text-md-h1 font-weight-bold mb-4 hero-title">
            Find Your Perfect
            <span class="text-primary d-block">Feline Friend</span>
          </h1>
          
          <p class="text-h6 text-md-h5 font-weight-regular mb-8 text-medium-emphasis mx-auto hero-subtitle">
            We help cats find loving homes and caring families.
            <span class="d-block mt-2">Every paw deserves a forever home.</span>
          </p>

          <VRow class="justify-center" no-gutters>
            <VCol cols="12" sm="auto" class="mb-4 mb-sm-0 px-2">
              <VBtn
                to="/paws"
                color="primary"
                size="x-large"
                elevation="2"
                class="px-8 text-none hero-btn"
                rounded="lg"
              >
                <VIcon start>
                  mdi-paw
                </VIcon>
                Browse Available Cats
              </VBtn>
            </VCol>

            <VCol
              v-if="!userStore.isAuth"
              cols="12"
              sm="auto"
              class="px-2"
            >
              <VBtn
                to="/login"
                variant="outlined"
                color="primary"
                size="x-large"
                class="px-8 text-none hero-btn"
                rounded="lg"
              >
                <VIcon start>
                  mdi-login
                </VIcon>
                Sign In
              </VBtn>
            </VCol>
          </VRow>
        </div>
      </VCol>
    </VRow>

    <!-- Features Section -->
    <VRow class="features-section py-12 px-4" no-gutters>
      <VCol cols="12" class="mb-8">
        <h2 class="text-h3 text-center font-weight-bold mb-2">
          Why Adopt From Us?
        </h2>
        <p class="text-center text-medium-emphasis">
          We make the adoption process simple and rewarding
        </p>
      </VCol>

      <VCol cols="12" md="4" class="pa-4">
        <VCard
          class="feature-card h-100 text-center pa-6"
          elevation="0"
          variant="tonal"
          color="accent"
          rounded="xl"
        >
          <VIcon
            size="64"
            color="error"
            class="mb-4"
          >
            mdi-heart
          </VIcon>
          <h3 class="text-h5 font-weight-bold mb-3">
            Caring Support
          </h3>
          <p class="text-body-1 text-medium-emphasis">
            Our team ensures every cat finds the perfect match with loving families
          </p>
        </VCard>
      </VCol>

      <VCol cols="12" md="4" class="pa-4">
        <VCard
          class="feature-card h-100 text-center pa-6"
          elevation="0"
          variant="tonal"
          color="accent"
          rounded="xl"
        >
          <VIcon
            size="64"
            color="info"
            class="mb-4"
          >
            mdi-calendar-check
          </VIcon>
          <h3 class="text-h5 font-weight-bold mb-3">
            Easy Scheduling
          </h3>
          <p class="text-body-1 text-medium-emphasis">
            Schedule visits at your convenience and meet your future companion
          </p>
        </VCard>
      </VCol>

      <VCol cols="12" md="4" class="pa-4">
        <VCard
          class="feature-card h-100 text-center pa-6"
          elevation="0"
          variant="tonal"
          color="accent"
          rounded="xl"
        >
          <VIcon
            size="64"
            color="success"
            class="mb-4"
          >
            mdi-shield-check
          </VIcon>
          <h3 class="text-h5 font-weight-bold mb-3">
            Health Guaranteed
          </h3>
          <p class="text-body-1 text-medium-emphasis">
            All cats are health-checked, vaccinated, and ready for their new home
          </p>
        </VCard>
      </VCol>
    </VRow>

    <!-- Call to Action -->
    <VRow class="cta-section py-16" no-gutters>
      <VCol cols="12" class="text-center px-4">
        <VCard
          class="mx-auto pa-8 cta-card"
          max-width="800"
          elevation="4"
          rounded="xl"
          color="primary"
        >
          <h2 class="text-h3 font-weight-bold mb-4 text-white">
            Ready to Meet Your New Best Friend?
          </h2>
          <p class="text-h6 mb-6 text-white text-opacity-90">
            Browse our available cats and start your adoption journey today
          </p>
          <VBtn
            to="/paws"
            color="white"
            size="x-large"
            class="px-8 text-none"
            rounded="lg"
            elevation="0"
          >
            <VIcon start>
              mdi-paw
            </VIcon>
            View All Cats
          </VBtn>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/user'

  const userStore = useUserStore()
</script>

<style scoped>
.hero-section {
  min-height: 70vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-surface), 1) 100%);
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-title {
  line-height: 1.2;
  animation: fadeInUp 0.6s ease-out;
}

.hero-subtitle {
  max-width: 700px;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.hero-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.features-section {
  background: rgba(var(--v-theme-surface), 1);
}

.feature-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(var(--v-theme-primary), 0.1);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.cta-section {
  background: linear-gradient(180deg, rgba(var(--v-theme-surface), 1) 0%, rgba(var(--v-theme-primary), 0.05) 100%);
}

.cta-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
