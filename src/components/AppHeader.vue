<template>
  <v-app-bar flat color="primary">
    <v-app-bar-title>
      <v-btn to="/" variant="plain">The paws</v-btn>
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn to="/about" variant="plain">About us</v-btn>

      <v-btn variant="plain">Contact us</v-btn>

      <v-btn variant="plain" v-if="!userStore.isAuth" @click="login">Login</v-btn>
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

  const userStore = useUserStore();
  const user = userStore.user;

  const login = () => {
    handleSignIn();
  }
</script>
