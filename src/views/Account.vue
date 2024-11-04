<template>
  <h1 class="text-h1">Account page</h1>

  <div class="py-14" />
  <div>
    {{ user?.displayName }}
  </div>
  <div>
    {{ user?.email }}
  </div>
  <v-btn
    color="primary"
    @click="logout"
  >
    Sign out
  </v-btn>
</template>

<script lang="ts" setup>
  import { handleSignOut } from '@/firebase';
  import { useUserStore } from '@/store/user';
  import { storeToRefs } from 'pinia';

  const userStore = useUserStore();
  const { user, isAdmin, isAuth } = storeToRefs(userStore);

  const logout = async () => {
    handleSignOut();
  }
</script>
