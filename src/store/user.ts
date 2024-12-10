// Utilities
import { computed, ref } from 'vue';
import { defineStore } from 'pinia'
import { User } from '@/model/User.model';

export const useUserStore = defineStore('user', () => {
  const initialUser = {} as User;
  const user = ref(initialUser)
  const isAdmin = ref(false);
  const isLoading = ref(true);

  const isAuth = computed(() => !!user.value && !isLoading.value)

  function setCurrentUser(usr: User) {
    user.value = usr
  }

  function resetCurrentUser() {
    user.value = initialUser;
  }

  function setIsAdmin(value: boolean) {
    isAdmin.value = value
  }

  function setLoading(value: boolean) {
    isLoading.value = value;
  }

  return { user, isAdmin, isAuth, isLoading, setCurrentUser, resetCurrentUser, setIsAdmin, setLoading }
})
