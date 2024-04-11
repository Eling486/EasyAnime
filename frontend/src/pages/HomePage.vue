<template>
  <main class="page-home">
    <div class="panel-left">
      <BoxLoading :loading="loading" />
      <div class="panel panel-info">
        <div class="info-item">
          <div class="title">{{ langs[settings.lang].home.info_anime_title }}</div>
          <div class="content content-number">{{ info.animeList.length }}</div>
        </div>
        <div class="info-item">
          <div class="title">{{ langs[settings.lang].home.info_subscribed_title }}</div>
          <div class="content content-number">{{ info.subscribedRSS.length }}</div>
        </div>
        <div class="info-item">
          <div class="title">{{ langs[settings.lang].home.info_new_today }}</div>
          <div class="content content-number">{{ info.new.today.length }}</div>
        </div>
      </div>
    </div>
    <div class="panel-right panel-output" ref="panelOutput">
      <p class="line" v-for="line in output" :key="line[0]" v-html="line[1]"></p>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref, reactive, inject } from 'vue'
import { api } from '@/utils'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'

const store = useStore()
const { settings } = storeToRefs(store)
const langs = inject('langs')

const output = ref([])
const info = reactive({
  subscribedRSS: [],
  animeList: [],
  new: {
    today: []
  }
})

const loading = ref(true)

const panelOutput = ref()

const fileSize = ref(null)

const loadOutput = async () => {
  let url = '/api/info/output'
  if (fileSize.value) {
    url = `/api/info/output?start=${fileSize.value}`
  }
  let result = await api('GET', url).catch((err) => {
    return console.log(err)
  })
  if (result.data.content.length > 0) {
    output.value = output.value.concat(result.data.content)
  }
  fileSize.value = result.data.file_size
}

const loadInfo = async () => {
  let result = await api('GET', '/api/info/all').catch((err) => {
    return console.log(err)
  })
  if (!result || result.code < 0) return
  info.subscribedRSS = result.data.subscribedRSS
  info.animeList = result.data.animeList
  info.new = result.data.new
  loading.value = false
}

onMounted(async () => {
  loadInfo()
  await loadOutput()
  panelOutput.value.scrollIntoView(false, {
    behavior: 'smooth'
  })
  setInterval(() => {
    loadOutput()
  }, 5000)
})
</script>

<style lang="scss" scoped>
.page-home {
  display: grid;
  grid-template-columns: 50% 50%;
  background-color: ea-dark(1);
  height: calc(100vh - $ea-header-height);
  width: 100%;
  padding: 8vh 10vw;
  box-sizing: border-box;

  .panel-left {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: flex-start;
    flex-grow: 1;
    margin-right: 20px;

    .panel-info {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-content: flex-start;
      width: 100%;
      background-color: $ea-white;
      box-shadow: $shadow-1;

      .info-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 0 10px 10px 10px;
        width: 120px;
        height: 120px;

        .title {
          color: ea-gray(70);
          margin-bottom: 5px;
        }

        .content-number {
          color: $ea-main;
          font-size: 2.5em;
        }
      }
    }
  }

  .panel-output {
    overflow-y: auto;
    overflow-x: scroll;
    background-color: $ea-white;
    box-shadow: $shadow-1;
    padding: 5px 10px;
    font-size: 12px;
    line-height: 12px;
    font-family: Consolas, Monaco, monospace;
    box-sizing: border-box;
    color: ea-gray(50);

    p {
      display: block;
      width: max-content;
      margin: 0;
    }
  }
}

@media (max-width: 900px) {
  .page-home {
    display: flex;
    flex-direction: column;
    padding: 5vh 4vw;

    .panel-left {
      margin: 0 0 20px 0;
      flex-grow: 0;

      .panel-info {
        .info-item {
          width: 100px;
          height: 100px;
          margin: 0 2px 5px 2px;

          .title {
            font-size: 14px;
          }

          .content-number {
          font-size: 2em;
        }
        }
      }
    }

    .panel-output {
      flex-grow: 1;
      font-size: 8px;
      line-height: 8px;
    }
  }
}
</style>
