import { defineStore } from 'pinia'

interface UserInfo {
  username: string
  isAdmin: boolean
}

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as UserInfo | null
  }),
  getters: {
    isLoggedIn: (state) => state.currentUser !== null,
    isAdmin: (state) => state.currentUser?.isAdmin ?? false,
    username: (state) => state.currentUser?.username ?? ''
  },
  actions: {
    login(username: string) {
      const isAdminUser = username.toLowerCase() === 'admin'
      this.currentUser = {
        username,
        isAdmin: isAdminUser
      }
    },
    logout() {
      this.currentUser = null
    }
  }
})

export default useUserStore
