<template>
  <v-app-bar flat color="primary">
    <v-app-bar-title>
      <AppLink to="/" class="text-h5">The paws</AppLink>
    </v-app-bar-title>
    <template v-slot:append>
      <AppLink to="/about" class="mr-4">About us</AppLink>

      <AppLink to="/about" class="mr-4">Contact us</AppLink>

      <div v-if="isLoading">
        <v-icon icon="mdi-sync" color="white"></v-icon>
      </div>
      <div v-else>
        <AppLink to="/login" v-if="!isAuth">
          <v-icon icon="mdi-login" color="white"></v-icon>
        </AppLink>
        <v-btn icon="mdi-account" v-if="isAuth" to="/account">
          <v-avatar
            size="36px"
            v-if="isAuth"
          >
            <v-img
              v-if="user?.photoURL"
              alt="Avatar"
              :src="user?.photoURL"
            ></v-img>
            <v-icon
              v-else
              icon="mdi-account"
              color="white"
            ></v-icon>
          </v-avatar>
          <!-- <div v-if="isAdmin">ADMIN</div> -->
        </v-btn>
      </div>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/user';
  import AppLink from '@/components/AppLink.vue'
  import { storeToRefs } from 'pinia';

  const userStore = useUserStore();
  const { user, isAdmin, isAuth, isLoading } = storeToRefs(userStore);
</script>
