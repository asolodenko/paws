<template>
  <v-app-bar flat color="primary">
    <v-app-bar-title>
      <AppLink to="/" class="text-h5">The paws</AppLink>
    </v-app-bar-title>
    <template v-slot:append>
      <AppLink to="/about" class="mr-4">About us</AppLink>

      <AppLink to="/about" class="mr-4">Contact us</AppLink>

      <AppLink to="" v-if="!userStore.isAuth" @click="login">Login</AppLink>
      <v-btn icon="mdi-account" v-if="userStore.isAuth" to="/account">
        <v-avatar
          size="36px"
          v-if="userStore.isAuth"
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
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
  import { handleSignIn } from '@/firebase';
  import { useUserStore } from '@/store/user';
  import AppLink from '@/components/AppLink.vue'

  const userStore = useUserStore();
  const user = userStore.user;

  const login = () => {
    handleSignIn();
  }
</script>
