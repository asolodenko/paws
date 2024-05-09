<template>
  <v-app-bar flat color="primary">
    <v-app-bar-title>
      <AppLink to="/" class="text-h5">The paws</AppLink>
    </v-app-bar-title>
    <template v-slot:append>
      <AppLink to="/about" class="mr-4">About us</AppLink>

      <AppLink to="/about" class="mr-4">Contact us</AppLink>

      <AppLink to="" v-if="!isAuth" @click="login">Login</AppLink>
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
          <!-- <div v-if="user?.photoURL">{{ user?.displayName }}</div> -->
          <v-icon
            v-else
            icon="mdi-account"
            color="white"
          ></v-icon>
        </v-avatar>
        <div v-if="isAdmin">ADMIN</div>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
  import { handleSignIn } from '@/firebase';
  import { useUserStore } from '@/store/user';
  import AppLink from '@/components/AppLink.vue'
  import { storeToRefs } from 'pinia';

  const userStore = useUserStore();
  const { user, isAdmin, isAuth } = storeToRefs(userStore);

  const login = () => {
    handleSignIn();
  }
</script>
