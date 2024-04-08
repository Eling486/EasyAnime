<template>
  <header>
    <nav>
      <RouterLink v-for="router in routers" :key="router" class="nav-item" :to="router.url">{{ langs[settings.lang].header[router.text] }}</RouterLink>
    </nav>
    <div class="nav-right">
      <div class="lang-wrap">
        <div class="btn-lang" @click="toggleLang">{{ langList[settings.lang] }}</div>
      </div>
      <div class="user-wrap" v-if="userData">
        <div class="username">{{ userData.username }}</div>
        <div class="user-menu">
          <div class="logout user-menu-item" @click="onLogout">{{ langs[settings.lang].header.logout }}</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { inject } from 'vue'
import { RouterLink } from 'vue-router'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { logout } from '@/utils'

const langList = {
  zh_CN: '简',
  /*zh_TW: '繁',
  en: 'EN'*/
}

const store = useStore()
const { settings, userData } = storeToRefs(store)
const langs = inject('langs')

const routers = [
  {
    url: '/',
    text: 'home'
  },
  {
    url: '/anime',
    text: 'anime'
  },
  {
    url: '/rss',
    text: 'rss'
  },
  {
    url: '/setting',
    text: 'setting'
  }
]

const toggleLang = () => {
  let index = Object.keys(langList).indexOf(settings.value.lang)
  if (index + 1 >= Object.keys(langList).length || index < 0) {
    store.updateSettings({ lang: Object.keys(langList)[0] })
    return
  }
  store.updateSettings({ lang: Object.keys(langList)[index + 1] })
  return
}

const onLogout = () => {
  logout()
  location.reload()
}

</script>

<style lang="scss" scoped>
header {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  height: $ea-header-height;
  padding: 0 calc($ea-header-height/2);
  box-shadow: $shadow-1;
  font-size: 0.9em;
  user-select: none;

  nav {
    display: flex;

    .nav-item {
      display: inline-block;
      line-height: $ea-header-height;
      height: $ea-header-height;
      padding: 0 calc($ea-header-height/2);
      color: $ea-text-light;
      transition: all .2s;

      &:hover {
        background-color: ea-main(1);
      }
    }
  }

  .nav-right {
    display: flex;

    .lang-wrap {
      display: flex;
      align-items: center;
      padding: 0 8px;

      .btn-lang {
        width: 32px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
        border-radius: 5px;
        transition: all .2s;

        &:hover {
          background-color: ea-main(2);
        }
      }
    }

    .user-wrap {
      position: relative;

      .username {
        line-height: $ea-header-height;
        padding: 0 16px;
      }

      .user-menu {
        position: absolute;
        top: calc($ea-header-height - 2px);
        right: 0;
        background-color: #fff;
        box-shadow: $shadow-1;
        border-radius: 5px;
        text-align: center;
        opacity: 0;
        height: 0;
        overflow: hidden;
        transition: all 0.2s;

        .user-menu-item {
          padding: 8px 16px;
          cursor: pointer;

          &:hover {
            background-color: ea-main(2);
          }
        }
      }

      &:hover {
        .user-menu {
          height: auto;
          opacity: 1;
        }
      }
    }
  }
}
</style>
