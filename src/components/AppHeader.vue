<template>
  <VAppBar flat color="background">
    <VAppBarTitle>
      <AppLink to="/" class="text-h5">
        The paws
      </AppLink>
    </VAppBarTitle>
    <template #append>
      <AppLink to="/about" class="mr-4">
        About us
      </AppLink>

      <AppLink v-if="isAdmin" to="/admin" class="mr-4">
        Admin page
      </AppLink>

      <div v-if="isLoading">
        <VIcon icon="mdi-sync" color="white" />
      </div>
      <div v-else>
        <VBtn v-if="!isAuth" icon="mdi-login" @click="handleSignIn">
          <VIcon icon="mdi-login" color="white" />
        </VBtn>
        <VBtn v-if="isAuth" icon="mdi-account" to="/account">
          <VAvatar
            v-if="isAuth"
            size="36px"
          >
            <VImg
              v-if="user?.photoURL"
              alt="Avatar"
              :src="user?.photoURL"
            />
            <VIcon
              v-else
              icon="mdi-account"
              color="white"
            />
          </VAvatar>
        </VBtn>
      </div>
    </template>
  </VAppBar>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/user'
  import AppLink from '@/components/AppLink.vue'
  import { storeToRefs } from 'pinia'
  import { handleSignIn } from '@/auth'

  const userStore = useUserStore()
  const { user, isAdmin, isAuth, isLoading } = storeToRefs(userStore)
</script>
