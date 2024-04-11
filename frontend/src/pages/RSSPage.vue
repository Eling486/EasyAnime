<template>
  <main class="page-rss page-box">
    <div class="rss-box inner-box">
      <div class="nav-rss nav-box">
        <div class="nav-right">
          <div class="nav-item" @click="showAddRSSDialog" v-if="isAdmin">
            <el-icon><Plus /></el-icon>
            <span class="nav-text">{{ langs[settings.lang].rss.add }}</span>
          </div>
        </div>
      </div>
      <BoxLoading :loading="loading" />
      <div class="rss-wrap">
        <el-table :data="data.rss" style="width: 100%" :row-class-name="isSubscribe">
          <el-table-column
            :label="langs[settings.lang].rss.subscribe"
            width="60"
            align="center"
            class-name="column-btn"
          >
            <template #default="scope">
              <div
                class="btn-icon btn-subscribe"
                :class="{ subscribed: scope.row.is_subscribe == 1 }"
                style="display: flex; align-items: center"
                @click="toggleSubscribe(scope.row.rid, scope.row.is_subscribe)"
                :title="langs[settings.lang].rss.msg_click_to_toggle"
              >
                <el-icon :size="16"
                  ><Select v-if="scope.row.is_subscribe == 1" /><CloseBold
                    v-if="scope.row.is_subscribe == 0"
                /></el-icon>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="langs[settings.lang].rss.title"
            width="60"
            align="center"
            class-name="column-btn"
          >
            <template #default="scope">
              <el-popover
                placement="right"
                :width="300"
                trigger="hover"
                :content="scope.row.title"
                popper-class="break-all"
              >
                <template #reference>
                  <div class="btn-icon btn-title" style="display: flex; align-items: center">
                    <el-icon :size="20"><Tickets /></el-icon>
                  </div>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="langs[settings.lang].rss.name" width="auto" />
          <el-table-column :label="langs[settings.lang].rss.season" width="80" align="center">
            <template #default="scope">
              <template v-if="JSON.parse(scope.row.meta).season">
                {{
                  `${langs[settings.lang].rss.season_prefix}${langs[settings.lang].rss.season_list[JSON.parse(scope.row.meta).season]}${langs[settings.lang].rss.season_suffix}`
                }}
              </template>
            </template>
          </el-table-column>
          <el-table-column :label="langs[settings.lang].rss.type" width="80" align="center">
            <template #default="scope">
              {{ langs[settings.lang].rss.type_list[JSON.parse(scope.row.meta).type] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="source"
            :label="langs[settings.lang].rss.source"
            width="80"
            align="center"
          >
            <template #default="scope">
              {{ langs[settings.lang].rss.source_list[scope.row.source] }}
            </template>
          </el-table-column>
          <el-table-column
            :label="langs[settings.lang].rss.url"
            width="40"
            align="center"
            class-name="column-btn"
          >
            <template #default="scope">
              <el-popover
                placement="left"
                :width="300"
                trigger="hover"
                :content="scope.row.url"
                popper-class="break-all"
              >
                <template #reference>
                  <div
                    class="btn-icon btn-url"
                    style="display: flex; align-items: center"
                    @click="copyUrl(scope.row.url)"
                    :title="langs[settings.lang].msg_click_to_copy"
                  >
                    <el-icon :size="20"><Link /></el-icon>
                  </div>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            :label="langs[settings.lang].rss.operation"
            width="100"
            align="center"
            class-name="column-btn"
          >
            <template #default="scope">
              <div
                class="btn-icon btn-scan"
                style="display: flex; align-items: center"
                @click="scanRSS($event, scope.row.rid)"
                :title="langs[settings.lang].rss.msg_click_to_scan"
              >
                <el-icon :size="20"><Refresh /></el-icon>
              </div>
              <div
                class="btn-icon btn-edit"
                style="display: flex; align-items: center"
                @click="editRSS(scope.row)"
                :title="langs[settings.lang].msg_click_to_edit"
                v-if="isAdmin"
              >
                <el-icon :size="20"><Edit /></el-icon>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!--RSS弹窗-->
    <el-dialog v-model="addRSSDialogVisible" :title="data.rssDialogTitle" width="500">
      <el-form :model="rssForm" label-width="auto" :empty-text="langs[settings.lang].rss.msg_empty">
        <el-form-item :label="langs[settings.lang].rss.source">
          <el-select
            v-model="rssForm.source"
            :placeholder="langs[settings.lang].rss.msg_select"
            style="width: 50%"
            :disabled="rssMetaFormVisible"
          >
            <el-option
              v-for="source in sourceList"
              :key="source.value"
              :label="langs[settings.lang].rss.source_list[source]"
              :value="source"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="langs[settings.lang].rss.rss_url" :error="errorMsgURL">
          <el-input v-model="rssForm.url" autocomplete="off" :disabled="rssMetaFormVisible" />
        </el-form-item>
        <template v-if="rssMetaFormVisible">
          <el-form-item :label="langs[settings.lang].rss.title">
            <el-input v-model="rssForm.title" autocomplete="off" disabled />
          </el-form-item>
          <el-form-item :label="langs[settings.lang].rss.name">
            <el-input v-model="rssForm.name" autocomplete="off" />
          </el-form-item>
          <el-form-item :label="langs[settings.lang].rss.season" v-if="rssForm.rss_meta.season">
            {{
              `${langs[settings.lang].rss.season_prefix}${langs[settings.lang].rss.season_list[rssForm.rss_meta.season]}${langs[settings.lang].rss.season_suffix}`
            }}
          </el-form-item>
          <el-form-item :label="langs[settings.lang].rss.filter">
            <div class="add-filter-wrap">
              <el-tag
                v-for="filter in rssForm.filter"
                :key="filter"
                closable
                :disable-transitions="false"
                @close="handleDel(filter)"
              >
                {{ filter }}
              </el-tag>
              <el-input
                v-if="filterInputVisible"
                ref="FilterInputRef"
                v-model="filterInputValue"
                class="filter-input"
                size="small"
                @keyup.enter="handleFilterInputConfirm"
                @blur="handleFilterInputConfirm"
              />
              <el-button v-else class="button-new-tag" size="small" @click="showFilterInput">
                <el-icon><Plus /></el-icon>
              </el-button>
            </div>
          </el-form-item>
          <el-form-item :label="langs[settings.lang].rss.subscribe">
            <el-switch v-model="rssForm.is_subscribe" style="" />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            v-if="rssForm.rid"
            type="danger"
            @click="deleteRSS(rssForm.rid)"
            :loading="waitingDeleteFinish"
            :style="{ float: 'left' }"
            >{{ langs[settings.lang].rss.delete }}</el-button
          >
          <el-button @click="addRSSDialogVisible = false">{{
            langs[settings.lang].cancel
          }}</el-button>
          <el-button type="primary" @click="getRSS" :loading="addRSSDialogLoading">
            {{ langs[settings.lang].confirm }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </main>
</template>

<script setup>
import BoxLoading from '@/components/BoxLoading.vue'
import {
  Link,
  Plus,
  Tickets,
  Refresh,
  Edit,
  Select,
  CloseBold,
  WarnTriangleFilled
} from '@element-plus/icons-vue'
import { ref, reactive, onMounted, inject, nextTick, markRaw } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/dist/index.css'
import { api } from '@/utils'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'

const store = useStore()
const { settings, userData } = storeToRefs(store)
const langs = inject('langs')
const isAdmin = ref(userData.value.is_admin)

const data = reactive({
  rss: null,
  rssDialogTitle: null
})
const loading = ref(true)

const copyUrl = (url) => {
  navigator.clipboard.writeText(url)
  ElMessage({
    message: langs[settings.value.lang].msg_copy_success,
    type: 'success'
  })
}

const loadRSSList = async () => {
  let result = await api('GET', '/api/rss/all').catch((err) => {
    if (err.code == -50102) {
      loading.value = false
      return
    }
    ElMessage({
      message: langs[settings.value.lang].msg_err_reload,
      type: 'error'
    })
    return console.log(err)
  })
  if (!result) return
  data.rss = result.data
  loading.value = false
}

onMounted(() => {
  loadRSSList()
})

const isSubscribe = ({ row }) => {
  if (row.is_subscribe == 1) {
    return 'subscribed'
  }
  return 'not-subscribed'
}

const addRSSDialogVisible = ref(false)
const rssMetaFormVisible = ref(false)
const addRSSDialogLoading = ref(false)

const initRSSForm = () => ({
  rid: null,
  title: '',
  name: '',
  url: '',
  source: 'mikan',
  rss_meta: {},
  itemNum: null,
  filter: [],
  is_subscribe: false
})

const rssForm = reactive(initRSSForm())
const sourceList = ['mikan']

const errorMsgURL = ref('')

const showAddRSSDialog = () => {
  data.rssDialogTitle = `${langs[settings.value.lang].rss.add}RSS`
  Object.assign(rssForm, initRSSForm())
  errorMsgURL.value = ''
  addRSSDialogLoading.value = false
  rssMetaFormVisible.value = false
  addRSSDialogVisible.value = true
}

const getRSS = async () => {
  addRSSDialogLoading.value = true
  if (rssMetaFormVisible.value == false) {
    errorMsgURL.value = ''
    let result = await api('POST', '/api/rss/meta', {
      url: rssForm.url,
      source: rssForm.source
    }).catch((err) => {
      if (err.code < 0) {
        errorMsgURL.value = err.msg
        return
      }
      errorMsgURL.value = langs[settings.value.lang].msg_err
      return console.log(err)
    })
    if (!result) {
      addRSSDialogLoading.value = false
      return
    }
    Object.assign(rssForm, result.data.meta)
    rssForm.filter = result.data.filter
    rssForm.is_subscribe = Boolean(result.data.is_subscribe)
    rssMetaFormVisible.value = true
    addRSSDialogLoading.value = false
    return
  }
  let result = await api('POST', '/api/rss/add', {
    meta: JSON.stringify(rssForm)
  }).catch((err) => {
    if (err.code < 0) {
      errorMsgURL.value = err.msg
      return
    }
    errorMsgURL.value = langs[settings.value.lang].msg_err
    return console.log(err)
  })
  if (!result) return
  if (result.data.new_rss) {
    ElMessage({
      message: langs[settings.value.lang].rss.msg_add_rss_success,
      type: 'success'
    })
  }
  if (!result.data.new_rss) {
    ElMessage({
      message: langs[settings.value.lang].rss.msg_update_rss_success,
      type: 'success'
    })
  }
  addRSSDialogVisible.value = false
  loading.value = true
  loadRSSList()
}

const FilterInputRef = ref()
const filterInputValue = ref('')
const filterInputVisible = ref(false)

const handleDel = (filter) => {
  rssForm.filter.splice(rssForm.filter.indexOf(filter), 1)
}

const showFilterInput = () => {
  filterInputVisible.value = true
  nextTick(() => {
    FilterInputRef.value.input.focus()
  })
}

const handleFilterInputConfirm = () => {
  if (filterInputValue.value) {
    rssForm.filter.push(filterInputValue.value)
  }
  filterInputVisible.value = false
  filterInputValue.value = ''
}

const editRSS = (rssObj) => {
  data.rssDialogTitle = `${langs[settings.value.lang].rss.edit}RSS`
  Object.assign(rssForm, initRSSForm())
  Object.assign(rssForm, rssObj)
  rssForm.filter = JSON.parse(rssObj.filter)
  rssForm.is_subscribe = Boolean(Number(rssObj.is_subscribe))
  rssMetaFormVisible.value = true
  addRSSDialogLoading.value = false
  addRSSDialogVisible.value = true
}

const waitingDeleteFinish = ref(false)

const deleteRSS = (rid) => {
  ElMessageBox.confirm(
    langs[settings.value.lang].rss.msg_delete_confirm_content,
    langs[settings.value.lang].rss.msg_delete_confirm,
    {
      confirmButtonText: langs[settings.value.lang].confirm,
      cancelButtonText: langs[settings.value.lang].cancel,
      type: 'warning',
      icon: markRaw(WarnTriangleFilled),
      dangerouslyUseHTMLString: true,
      customClass: 'el-dialog-icon'
    }
  ).then(async () => {
    waitingDeleteFinish.value = true
    let result = await api('POST', '/api/rss/delete', {
      rid: rid
    }).catch((err) => {
      ElMessage({
        message: err.msg || langs[settings.value.lang].msg_err_reload,
        type: 'error'
      })
      return console.log(err)
    })
    waitingDeleteFinish.value = false
    if (!result) return
    addRSSDialogVisible.value = false
    ElMessage({
      message: langs[settings.value.lang].rss.msg_delete_success,
      type: 'success'
    })
    loadRSSList()
  })
}

const scanRSS = async (e, rid) => {
  let elIcon = null
  e.composedPath().find((el) => {
    if (el.classList) {
      if (el.classList.contains('btn-scan')) {
        elIcon = el.firstElementChild
      }
    }
  })
  elIcon.classList.add('scaning')
  let result = await api('GET', `/api/rss/scan?rid=${rid}`).catch((err) => {
    return console.log(err)
  })
  if (!result) {
    elIcon.classList.remove('scaning')
    return
  }
  ElMessage({
    message: langs[settings.value.lang].rss.msg_scan_finished,
    type: 'success'
  })
  elIcon.classList.remove('scaning')
}

const toggleSubscribe = async (rid, isSubscribed) => {
  if (!isAdmin.value) {
    ElMessage({
      message: langs[settings.value.lang].msg_err_not_admin,
      type: 'error'
    })
    return
  }
  let result = await api('POST', '/api/rss/update/subscribe', {
    rid: rid,
    is_subscribe: !Number(isSubscribed)
  }).catch((err) => {
    if (err.code < 0) {
      errorMsgURL.value = err.msg
      return
    }
    errorMsgURL.value = langs[settings.value.lang].msg_err
    loadRSSList()
    return console.log(err)
  })
  if (!result) return
  ElMessage({
    message: langs[settings.value.lang].rss.msg_update_subscribe_success,
    type: 'success'
  })
  loadRSSList()
}
</script>

<style lang="scss" scoped>
.rss-wrap {
  height: 100%;
  overflow-y: auto;
}

.break-all {
  word-break: break-all;
}

.btn-subscribe {
  :deep(svg) {
    color: ea-red(8);
  }
  &.subscribed {
    :deep(svg) {
      color: ea-green(10);
    }
  }
}

.el-table {
  :deep(.column-btn .cell) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
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

  &:hover {
    background-color: ea-main(2);
  }

  &.btn-title {
    cursor: default;
  }
}

.add-filter-wrap {
  display: flex;
  flex-wrap: wrap;

  :deep(.el-tag) {
    margin: 0.2em 0.5em 0.2em 0;
  }
  :deep(.el-button) {
    margin: 0.2em 0.5em 0.2em 0;
  }
  :deep(.el-input) {
    margin: 0.2em 0.5em 0.2em 0;
  }

  .filter-input {
    width: 80px;
  }
}

.scaning {
  animation: rotating-rev 2s linear infinite;
}
@keyframes rotating-rev {
  0% {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0);
  }
}

@media (max-width: 900px) {
  :deep(.el-dialog) {
    width: 95% !important;
  }
}
</style>
