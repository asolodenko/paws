// Utilities
import { computed, ref } from 'vue';
import { defineStore } from 'pinia'
import { User } from '@/model/User.model';

export const useUserStore = defineStore('user', () => {
  const user = ref(null as User | null)
  const isAdmin = ref(false);
  const isLoading = ref(true);

  const isAuth = computed(() => !!user.value && !isLoading.value)

  function setCurrentUser(usr: User) {
    user.value = usr
  }

  function resetCurrentUser() {
    user.value = null
  }

  function setIsAdmin(value: boolean) {
    isAdmin.value = value
  }

  function setLoading(value: boolean) {
    isLoading.value = value;
  }

  return { user, isAdmin, isAuth, isLoading, setCurrentUser, resetCurrentUser, setIsAdmin, setLoading }
})
