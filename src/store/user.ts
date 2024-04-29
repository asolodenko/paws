// Utilities
import { User } from 'firebase/auth';
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null
  }),
  getters: {
    isAuth(): boolean {
      return !!this.user;
    }
  },
  actions: {
    setCurrentUser(usr: User) {
      this.user = usr;
    },
    resetCurrentUser() {
      this.user = null
    }
  }
})
