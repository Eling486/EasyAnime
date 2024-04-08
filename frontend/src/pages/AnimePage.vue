<template>
  <main class="page-anime page-box">
    <div class="anime-box inner-box">
      <div class="nav-anime nav-box"></div>
      <BoxLoading :loading="loading" />
      <div class="anime-wrap">
        <div
          class="anime"
          v-for="anime in data.anime"
          :key="anime.aid"
          :style="{ backgroundImage: `url(${anime.poster_path || anime.poster_url})` }"
          @click="showAnimeDetails(anime)"
        >
          <div class="anime-name">{{ anime.title }}</div>
        </div>
      </div>
    </div>
    <el-dialog v-model="animeDialogVisible">
      <div class="detail-wrap">
        <div
          class="anime-poster"
          :style="{ backgroundImage: `url(${animeDialogData.poster})` }"
          @click="refreshPoster()"
        >
          <div class="refresh-wrap" :title="langs[settings.lang].anime.refresh_poster">
            <el-icon :size="50"><Refresh /></el-icon>
          </div>
        </div>
        <div class="detail-form-wrap">
          <el-form
            class="detail-from"
            label-position="right"
            label-width="auto"
            :model="animeDialogData"
          >
            <el-form-item :label="langs[settings.lang].anime.name">
              <el-input v-model="animeDialogData.title" />
            </el-form-item>
            <el-form-item :label="langs[settings.lang].anime.save_path">
              <el-input v-model="animeDialogData.save_path" disabled />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="ep-wrap">
        <el-form-item :label="langs[settings.lang].rss.season">
          <el-radio-group v-model="animeDialogData.seasonSelected" @change="toggleSeason">
            <el-radio-button
              v-for="(season, index) in animeDialogData.season"
              :key="index"
              :label="`${langs[settings.lang].rss.season_prefix}${langs[settings.lang].rss.season_list[season]}${langs[settings.lang].rss.season_suffix}`"
              :value="index"
            />
          </el-radio-group>
        </el-form-item>
        <div class="ep-box">
          <BoxLoading :loading="dialogLoading" />
          <el-button
            size="small"
            v-for="ep in animeDialogData.epList"
            :key="ep"
            :icon="getEpStateInfo(ep)[0]"
            :type="getEpStateInfo(ep)[1]"
            :plain="getEpStateInfo(ep)[2]"
            :title="getEpStateInfo(ep)[3]"
            @click="showEpDetails(ep)"
            >{{ getEpName(ep) }}</el-button
          >
        </div>
      </div>
      <el-dialog
        v-model="epDialogVisible"
        :title="epDialogData.name"
        append-to-body
        class="ep-details-wrap"
      >
        <div class="state-wrap">
          <div class="label label-state">{{ langs[settings.lang].anime.ep_state }}</div>
          <el-link
            class="el-link-state"
            :icon="epDialogData.epStateInfo[0]"
            :type="epDialogData.epStateInfo[1]"
            :underline="false"
            >{{ epDialogData.epStateInfo[3] }}</el-link
          >
        </div>
        <div class="torrent-wrap">
          <el-table class="torrent-table" :data="epDialogData.torrentList">
            <el-table-column
              :label="langs[settings.lang].anime.toggle"
              width="60"
              align="center"
              class-name="column-btn"
            >
              <template #default="scope">
                <el-popover
                  placement="left"
                  :width="160"
                  trigger="hover"
                  :content="getToggleContent(scope.row.tid)"
                  popper-class="break-all"
                >
                  <template #reference>
                    <div
                      class="btn-icon btn-toggle"
                      :class="{
                        active: epDialogData.activeTid == scope.row.tid,
                        disabled: waitingToggleFinish
                      }"
                      style="display: flex; align-items: center"
                      @click="toggleTorrent(scope.row.tid)"
                    >
                      <el-icon :size="20" v-if="epDialogData.activeTid !== scope.row.tid"
                        ><Star
                      /></el-icon>
                      <el-icon :size="24" v-if="epDialogData.activeTid == scope.row.tid"
                        ><StarFilled
                      /></el-icon>
                    </div>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column :label="langs[settings.lang].anime.torrent_title">
              <template #default="scope">
                <el-popover
                  placement="right"
                  :width="300"
                  trigger="hover"
                  :content="scope.row.title"
                  popper-class="break-all"
                >
                  <template #reference>
                    <div class="torrent-title">{{ scope.row.title }}</div>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              :label="langs[settings.lang].anime.torrent_url"
              width="60"
              align="center"
              class-name="column-btn"
            >
              <template #default="scope">
                <div
                  class="btn-icon btn-url"
                  style="display: flex; align-items: center"
                  @click="copyUrl(scope.row.url)"
                  :title="langs[settings.lang].msg_click_to_copy"
                >
                  <el-icon :size="20"><Link /></el-icon>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="langs[settings.lang].anime.homepage"
              width="60"
              align="center"
              class-name="column-btn"
            >
              <template #default="scope">
                <div
                  class="btn-icon"
                  style="display: flex; align-items: center"
                  @click="openInBlank(scope.row.homepage)"
                  :title="langs[settings.lang].msg_click_to_open_in_blank"
                >
                  <el-icon :size="20"><Position /></el-icon>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="langs[settings.lang].anime.state" width="150" align="center">
              <template #default="scope">
                <el-link
                  class="el-link-state"
                  :icon="getEpStateInfo(scope.row)[0]"
                  :type="getEpStateInfo(scope.row)[1]"
                  :underline="false"
                  >{{ getEpStateInfo(scope.row)[3] }}
                </el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </el-dialog>
  </main>
</template>

<script setup>
import { reactive, onMounted, ref, inject, markRaw } from 'vue'
import {
  Check,
  Close,
  Download,
  Loading,
  Filter,
  Files,
  ChatDotSquare,
  Link,
  Position,
  Star,
  StarFilled,
  WarnTriangleFilled,
  Refresh
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { api } from '@/utils'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'

const store = useStore()
const { settings, userData } = storeToRefs(store)
const langs = inject('langs')
const isAdmin = ref(userData.value.is_admin)

const data = reactive({
  anime: null
})

const loading = ref(true)
const dialogLoading = ref(true)
const waitingToggleFinish = ref(false)
const animeDialogVisible = ref(false)
const animeDialogData = reactive({
  aid: null,
  title: null,
  poster: null,
  save_path: null,
  season: [],
  seasonSelected: 0,
  torrentList: [],
  epList: null
})

const epDialogVisible = ref(false)
const epDialogData = reactive({
  name: null,
  season: null,
  ep: null,
  epStateInfo: null,
  torrentList: [],
  activeTid: null
})

const loadAnimeDetail = async () => {
  dialogLoading.value = true
  let aid = animeDialogData.aid
  let result = await api('GET', `/api/anime/detail?aid=${aid}`).catch((err) => {
    return console.log(err)
  })
  if (!result) return
  if (result.code < 0) return
  animeDialogData.torrentList = result.data
  await getEpList()
}

const refreshPoster = async () => {
  if (!isAdmin.value) {
    ElMessage({
      message: langs[settings.value.lang].msg_err_not_admin,
      type: 'error'
    })
    return
  }
  let aid = animeDialogData.aid
  let result = await api('POST', `/api/anime/refresh`, {
    aid: aid
  }).catch((err) => {
    ElMessage({
      message: langs[settings.value.lang].anime.msg_refresh_poster_error,
      type: 'error'
    })
    return console.log(err)
  })
  if (!result) return
  animeDialogVisible.value = false
  ElMessage({
    message: langs[settings.value.lang].anime.msg_refresh_poster_success,
    type: 'success'
  })
  loading.value = true
  await loadGallery()
}

const getEpName = (epObj) => {
  if (epObj.ep) {
    if (!isNaN(parseFloat(epObj.ep)))
      return `${langs[settings.value.lang].anime.ep_prefix}${epObj.ep}${langs[settings.value.lang].anime.ep_suffix}`
  }
  if (epObj.name) return epObj.name
  return langs.value[settings.value.lang].anime.ep
}

const getEpStateInfo = (epObj) => {
  let msg = langs[settings.value.lang].anime
  if (epObj.state == 0) return [Loading, 'warning', true, msg.msg_ep_state_wait]
  if (epObj.state == 1) return [Files, 'warning', true, msg.msg_ep_state_queue]
  if (epObj.state == 2) return [Download, 'primary', true, msg.msg_ep_state_download]
  if (epObj.state == 3) return [Check, 'success', false, msg.msg_ep_state_finish]
  if (epObj.state == -1) return [ChatDotSquare, 'info', true, msg.msg_ep_state_operate]
  if (epObj.state == -2) return [Filter, 'info', false, msg.msg_ep_state_filtered]
  if (epObj.state == -3) return [Close, 'danger', false, msg.msg_ep_state_torrent_err]
  if (epObj.state == -4) return [Close, 'danger', false, msg.msg_ep_state_unknown]
  if (epObj.state == -5) return [Filter, 'info', false, msg.msg_ep_state_same]
  if (epObj.state == -6) return [Filter, 'info', false, msg.msg_ep_state_same_torrent]
  return [Close, 'danger', false, msg.msg_ep_state_error]
}

const getEpList = async () => {
  dialogLoading.value = true
  let torrentList = animeDialogData.torrentList
  let season = animeDialogData.season[animeDialogData.seasonSelected]
  let epList = []
  for (let i = 0; i < torrentList.length; i++) {
    let meta = JSON.parse(torrentList[i].meta)
    let name = torrentList[i].file_name
    let tid = torrentList[i].tid
    if (torrentList[i].state < 0) tid = null

    let newEp = [true, null]
    for (let j = 0; j < epList.length; j++) {
      if (epList[j].name == name) {
        newEp = [false, j]
        break
      }
    }
    if (newEp[0]) {
      if (meta.info.season && meta.info.season !== season) continue
      epList.push({
        tid: tid,
        name: name,
        state: torrentList[i].state,
        season: meta.info.season || null,
        ep: meta.info.ep || null,
        torrentList: [torrentList[i]]
      })
      continue
    }
    if (!meta.info.season || meta.info.season == season) {
      let state = epList[newEp[1]].state
      epList[newEp[1]].torrentList.push(torrentList[i])
      if (
        (torrentList[i].state >= -1 && torrentList[i].state > state) ||
        (torrentList[i].state < -2 && torrentList[i].state > -5 && state < -1)
      ) {
        epList[newEp[1]].state = torrentList[i].state
        if (torrentList[i].state < 0) continue
        epList[newEp[1]].tid = torrentList[i].tid
        continue
      }
    }
  }
  epList.sort((a, b) => {
    if (a.ep < b.ep) return -1
    if (a.ep > b.ep) return 1
    return 0
  })
  animeDialogData.epList = epList
  dialogLoading.value = false
}

const toggleSeason = async () => {
  dialogLoading.value = true
  await getEpList()
  dialogLoading.value = false
}

const showAnimeDetails = async (animeObj) => {
  dialogLoading.value = true
  animeDialogData.aid = animeObj.aid
  animeDialogData.title = animeObj.title
  animeDialogData.poster = animeObj.poster_path || animeObj.poster_url
  animeDialogData.seasonSelected = 0
  animeDialogData.save_path = animeObj.save_path
  animeDialogData.season = JSON.parse(animeObj.season).sort()
  animeDialogData.torrentList = []
  animeDialogData.epList = null
  animeDialogVisible.value = true
  dialogLoading.value = true
  await loadAnimeDetail()
}

const showEpDetails = async (epObj) => {
  if (!isAdmin.value) {
    ElMessage({
      message: langs[settings.value.lang].msg_err_not_admin,
      type: 'error'
    })
    return
  }
  epDialogData.epObj = epObj
  epDialogData.name = epObj.name
  epDialogData.season = epObj.season
  epDialogData.ep = epObj.ep
  epDialogData.torrentList = epObj.torrentList
  epDialogData.epStateInfo = getEpStateInfo(epObj)
  epDialogData.activeTid = epObj.tid
  epDialogVisible.value = true
}

const getToggleContent = (tid) => {
  if (tid == epDialogData.activeTid) return langs[settings.value.lang].anime.msg_torrent_active
  return langs[settings.value.lang].anime.msg_click_to_toggle
}

const toggleTorrent = async (tidTo) => {
  if (waitingToggleFinish.value) return
  let tidFrom = epDialogData.activeTid
  if (tidTo == tidFrom) return
  ElMessageBox.confirm(
    `<b>${langs[settings.value.lang].anime.msg_toggle_confirm_blod}</b>`,
    langs[settings.value.lang].anime.msg_toggle_confirm,
    {
      confirmButtonText: langs[settings.value.lang].confirm,
      cancelButtonText: langs[settings.value.lang].cancel,
      type: 'warning',
      icon: markRaw(WarnTriangleFilled),
      dangerouslyUseHTMLString: true,
      customClass: 'el-dialog-icon'
    }
  ).then(async () => {
    waitingToggleFinish.value = true
    let result = await api('POST', '/api/torrent/toggle', {
      tid_from: tidFrom,
      tid_to: tidTo
    }).catch((err) => {
      ElMessage({
        message: err.msg || langs[settings.value.lang].msg_err_reload,
        type: 'error'
      })
      return console.log(err)
    })
    if (!result) return
    epDialogVisible.value = false
    console.log(tidFrom, tidTo, result)
    await loadAnimeDetail()
    waitingToggleFinish.value = false
    ElMessage({
      message: langs[settings.value.lang].anime.msg_toggle_success,
      type: 'success'
    })
  })
}

const copyUrl = (url) => {
  navigator.clipboard.writeText(url)
  ElMessage({
    message: langs[settings.value.lang].msg_copy_success,
    type: 'success'
  })
}

const openInBlank = (url) => {
  window.open(url, 'target', '')
}

const loadGallery = async () => {
  let result = await api('GET', '/api/anime/gallery').catch((err) => {
    return console.log(err)
  })
  if (result) data.anime = result.data
  loading.value = false
}

onMounted(async () => {
  await loadGallery()
})
</script>

<style lang="scss" scoped>
.anime-wrap {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  align-content: flex-start;

  .anime {
    position: relative;
    width: 140px;
    height: 190px;
    margin: 20px 15px;
    background-size: cover;
    border-radius: 8px;
    box-shadow: $shadow-1;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.2s;

    .anime-name {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      top: 162px;
      padding: 4px 8px;
      background-color: ea-dark(5);
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: ea-light(10);
      transition: all 0.2s;
    }

    &:hover {
      box-shadow: $shadow-2;
      .anime-name {
        top: 0;
        white-space: normal;
        padding: 8px 8px;
        background-color: ea-dark(7);
      }
    }
  }
}

.detail-wrap {
  display: flex;

  .anime-poster {
    position: relative;
    width: 105px;
    height: 140px;
    margin: 20px 15px;
    background-size: cover;
    border-radius: 8px;
    box-shadow: $shadow-1;
    overflow: hidden;

    .refresh-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: ea-main(6);
      color: $ea-white;
      opacity: 0;
      transition: opacity 0.2s;
      cursor: pointer;

      &:hover {
        opacity: 1;
      }
    }
  }

  .detail-form-wrap {
    flex-grow: 1;
    margin: 20px 15px;
  }
}
.ep-wrap {
  padding: 4px 8px;

  .ep-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    height: 30vh;
    position: relative;
    align-content: flex-start;
    align-items: center;
    overflow-y: auto;

    .el-button {
      margin: 3px 6px;
      min-width: 18%;
    }
  }
}

.ep-details-wrap {
  .state-wrap {
    display: flex;
    margin: 1em 0;
  }
  .label {
    font-weight: bold;
    color: ea-gray(50);
    margin: 0 0.5em;
  }

  .el-link.el-link-state {
    cursor: default;

    :deep(.el-icon) {
      margin-right: 3px;
    }
  }

  .torrent-table {
    width: 100%;
    height: 300px;

    :deep(.column-btn .cell) {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      cursor: pointer;
      transition: all 0.2s;
      border-radius: 5px;
      margin: 0 3px;

      &:not(.btn-toggle.active):hover {
        background-color: ea-main(2);
      }

      &.btn-toggle.active {
        cursor: default;
        :deep(svg) {
          color: ea-yellow(10);
        }
      }

      &.btn-title {
        cursor: default;
      }

      &.disabled {
        cursor: not-allowed;
      }
    }

    .torrent-title {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>
