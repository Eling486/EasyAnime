import { defineStore } from 'pinia'

export const useStore = defineStore('EasyAnime', {
  state: () => ({
    settings: {
      lang: 'zh_CN',
    },
    token: null,
    userData: null
  }),
  actions: {
    updateSettings(partialSettings) {
      this.settings = {
        ...this.settings,
        ...partialSettings,
      }
    },
    updateToken(token) {
      this.token = token
    },
    updateUserData(data) {
      this.userData = data
    }
  },
  persist: {
    beforeRestore: (ctx) => {
      console.log(`即将恢复 '${ctx.store.$id}'`)
    },
  },
})