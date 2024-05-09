// Utilities
import { computed, ref } from 'vue';
import { defineStore } from 'pinia'
import { User } from 'firebase/auth';

export const useUserStore = defineStore('user', () => {
  const user = ref(null as User | null)
  const isAdmin = ref(false)

  const isAuth = computed(() => !!user.value)

  function setCurrentUser(usr: User) {
    user.value = usr
  }

  function resetCurrentUser() {
    user.value = null
  }

  function setIsAdmin(value: boolean) {
    isAdmin.value = value
  }

  return { user, isAdmin, isAuth, setCurrentUser, resetCurrentUser, setIsAdmin }
})
