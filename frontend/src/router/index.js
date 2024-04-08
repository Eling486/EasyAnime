import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/anime',
      name: 'anime',
      component: () => import('../pages/AnimePage.vue')
    },
    {
      path: '/rss',
      name: 'rss',
      component: () => import('../pages/RSSPage.vue')
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('../pages/SettingPage.vue')
    }
  ]
})

export default router
