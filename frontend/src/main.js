import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate  from 'pinia-plugin-persistedstate'
import langs from './langs'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.provide('langs', langs)

const store = createPinia()
store.use(piniaPluginPersistedstate)
app.use(store)

app.use(router)

app.mount('#app')
