// Utilities
import { User } from 'firebase/auth';
import { defineStore } from 'pinia'
import { computed, ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null as User | null)

  const isAuth = computed(() => !!user.value)

  function setCurrentUser(usr: User) {
    user.value = usr
  }

  function resetCurrentUser() {
    user.value = null
  }

  return { user, isAuth, setCurrentUser, resetCurrentUser }
})
