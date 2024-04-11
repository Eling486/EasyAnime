<template>
  <main class="page-setting page-box">
    <div class="setting-box inner-box">
      <BoxLoading :loading="loading" />
      <div class="config-wrap">
        <el-form
          class="config-form"
          :model="data.config"
          trigger="change"
          label-width="auto"
          style="max-width: 600px"
          hide-required-asterisk
          @change="validateForm"
        >
          <el-alert class="config-alert" type="info" show-icon :closable="false">
            <p>{{ langs[settings.lang].setting.alert_server }}</p>
          </el-alert>
          <el-checkbox label="HTTP" v-model="data.config.http" disabled/>
          <el-form-item :label="langs[settings.lang].setting.port">
            <el-input-number
              v-model="data.config.port[0]"
              :controls="false"
              :precision="0"
              :min="1"
              :max="65535"
              :disabled="!data.config.http"
            />
          </el-form-item>
          <el-checkbox label="HTTPS" v-model="data.config.https" disabled/>
          <el-form-item :label="langs[settings.lang].setting.port">
            <el-input-number
              v-model="data.config.port[1]"
              :controls="false"
              :precision="0"
              :min="1"
              :max="65535"
              :disabled="!data.config.https"
            />
          </el-form-item>
          <el-form-item :label="langs[settings.lang].setting.ca_key">
            <el-input
              v-model="data.config.ca.key"
              style="width: 400px"
              :disabled="!data.config.https"
            />
          </el-form-item>
          <el-form-item :label="langs[settings.lang].setting.ca_cert">
            <el-input
              v-model="data.config.ca.cert"
              style="width: 400px"
              :disabled="!data.config.https"
            />
          </el-form-item>
          <el-alert class="config-alert" type="info" show-icon :closable="false">
            <p>{{ langs[settings.lang].setting.alert_admin }}</p>
          </el-alert>
          <el-form-item :label="langs[settings.lang].setting.admin_username">
            <el-input v-model="adminSetting.username" style="width: 400px" />
          </el-form-item>
          <el-form-item :label="langs[settings.lang].setting.admin_password" :error="errorMsg">
            <el-input
              v-model="adminSetting.password"
              type="password"
              style="width: 400px"
              show-password
              autocomplete="new-password"
            />
          </el-form-item>
          <el-form-item
            :label="langs[settings.lang].setting.admin_password_repeat"
            :error="errorMsg"
          >
            <el-input
              v-model="adminSetting.passwordRepeat"
              type="password"
              style="width: 400px"
              show-password
              autocomplete="new-password"
            />
          </el-form-item>
          <el-alert class="config-alert" type="info" show-icon :closable="false">
            <p>{{ langs[settings.lang].setting.alert_qb }}</p>
          </el-alert>
          <el-form-item :label="langs[settings.lang].setting.qb_host">
            <el-input
              v-model="data.config.qBittorrent.host"
              style="width: 400px"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item :label="langs[settings.lang].setting.qb_username">
            <el-input v-model="data.config.qBittorrent.username" style="width: 400px" />
          </el-form-item>
          <el-form-item :label="langs[settings.lang].setting.qb_password" :error="errorMsg">
            <el-input
              v-model="data.config.qBittorrent.password"
              type="password"
              style="width: 400px"
              show-password
              autocomplete="new-password"
            />
          </el-form-item>
          <el-alert class="config-alert" type="info" show-icon :closable="false">
            <p>{{ langs[settings.lang].setting.alert_download }}</p>
          </el-alert>
          <el-form-item :label="langs[settings.lang].anime.save_path">
            <el-input v-model="data.config.save_path" style="width: 400px" />
          </el-form-item>
          <el-alert class="config-alert" type="info" show-icon :closable="false">
            <p>{{ langs[settings.lang].setting.alert_rss }}</p>
          </el-alert>
          <el-form-item :label="langs[settings.lang].setting.subscribe">
            <el-switch
              v-model="data.config.subscribe"
              inline-prompt
              :active-text="langs[settings.lang].setting.yes"
              :inactive-text="langs[settings.lang].setting.no"
              @change="validateForm"
            />
          </el-form-item>
          <el-form-item :label="langs[settings.lang].rss.filter">
            <div class="add-filter-wrap">
              <el-tag
                v-for="filter in data.config.filter"
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
          <el-alert
            class="config-alert"
            type="info"
            show-icon
            :closable="false"
            :title="langs[settings.lang].setting.alert_jobs"
            :description="langs[settings.lang].setting.alert_jobs_sub"
          />
          <el-form-item :label="langs[settings.lang].setting.jobs.scan_rss">
            <el-input v-model="data.config.jobs.scan_rss" style="width: 400px" />
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-wrap" v-if="btnVisible">
        <el-button type="info" plain @click="onReset">{{ langs[settings.lang].reset }}</el-button>
        <el-button type="primary" @click="onSave" :loading="saving">{{
          langs[settings.lang].save
        }}</el-button>
      </div>
    </div>
  </main>
</template>

<script setup>
import BoxLoading from '@/components/BoxLoading.vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { ref, reactive, onMounted, inject, nextTick } from 'vue'
import { api, logout } from '@/utils'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { sha256 } from 'js-sha256'

const store = useStore()
const { settings } = storeToRefs(store)
const langs = inject('langs')

const data = reactive({
  config: null,
  configInit: null
})
const adminSetting = reactive({
  username: null,
  password: null,
  passwordRepeat: null
})
const loading = ref(true)
const saving = ref(false)
const btnVisible = ref(false)

const validateForm = async () => {
  if (!data.config) return
  if (!data.config.http && !data.config.https) {
    data.config.http = true
    ElMessage({
      message: langs[settings.value.lang].setting.msg_server_warning,
      type: 'warning'
    })
  }
  if (data.config.jobs.scan_rss.split(' ').length !== 6) {
    data.config.jobs.scan_rss = data.configInit.jobs.scan_rss
    ElMessage({
      message: langs[settings.value.lang].setting.msg_cron_error,
      type: 'error'
    })
  }
  if (JSON.stringify(data.config) !== JSON.stringify(data.configInit) || adminSetting.username) {
    btnVisible.value = true
    return
  }
  btnVisible.value = false
}

const onReset = () => {
  data.config = JSON.parse(JSON.stringify(data.configInit))
  adminSetting.username = null
  adminSetting.password = null
  adminSetting.passwordRepeat = null
  validateForm()
}

const FilterInputRef = ref()
const filterInputValue = ref('')
const filterInputVisible = ref(false)

const handleDel = (filter) => {
  data.config.filter.splice(data.config.filter.indexOf(filter), 1)
  validateForm()
}

const showFilterInput = () => {
  filterInputVisible.value = true
  nextTick(() => {
    FilterInputRef.value.input.focus()
  })
}

const handleFilterInputConfirm = () => {
  if (filterInputValue.value) {
    data.config.filter.push(filterInputValue.value)
  }
  filterInputVisible.value = false
  filterInputValue.value = ''
  validateForm()
}

const onSave = async () => {
  if (adminSetting.password && !adminSetting.username) {
    ElMessage({
      message: langs[settings.value.lang].setting.msg_error_empty_username,
      type: 'error'
    })
    return
  }
  if (adminSetting.username && !adminSetting.password) {
    ElMessage({
      message: langs[settings.value.lang].setting.msg_error_empty_password,
      type: 'error'
    })
    return
  }
  if (adminSetting.password !== adminSetting.passwordRepeat) {
    ElMessage({
      message: langs[settings.value.lang].setting.msg_password_repeat_error,
      type: 'error'
    })
    return
  }
  saving.value = true
  let needLogout = false
  if (adminSetting.username) {
    console.log(adminSetting)
    let resultUser = await api('POST', '/api/user/update', {
      admin: true,
      username: adminSetting.username,
      password: sha256(`${adminSetting.username}${sha256(adminSetting.password)}`)
    }).catch((err) => {
      ElMessage({
        message: err.msg || langs[settings.value.lang].msg_err_reload,
        type: 'error'
      })
      saving.value = false
      return console.log(err)
    })
    if (!resultUser) return
    needLogout = true
  }
  let result = await api('POST', '/api/config/update', {
    config: JSON.stringify(data.config)
  }).catch((err) => {
    ElMessage({
      message: err.msg || langs[settings.value.lang].msg_err_reload,
      type: 'error'
    })
    saving.value = false
    return console.log(err)
  })
  if (!result) return
  ElMessage({
    message: langs[settings.value.lang].setting.msg_save_success,
    type: 'success'
  })
  loading.value = true
  saving.value = false
  if(needLogout) {
    logout()
    location.reload()
    return
  }
  loadConfig()
}

const loadConfig = async () => {
  let result = await api('GET', '/api/config/get').catch((err) => {
    if(err.code == -50102) {
      loading.value = false
      return
    }
    return console.log(err)
  })
  if(!result) return
  data.config = result.data
  data.configInit = JSON.parse(JSON.stringify(result.data))
  validateForm()
  loading.value = false
}

onMounted(async () => {
  await loadConfig()
})
</script>

<style lang="scss" scoped>
.setting-box {
  padding-top: 0;
}
.config-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 0 0 50px 0;
  overflow-y: auto;
  box-sizing: border-box;

  .config-form {
    height: fit-content;
  }

  .config-alert {
    margin: 3em 0 1em 0;
    p {
      margin: 0;
    }
  }
}

.btn-wrap {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: ea-gray(10) 1px solid;
  padding: 0.5em 1em;
  text-align: right;
  background-color: $ea-white;
  box-shadow: $shadow-1;
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

@media (max-width: 900px) {
  :deep(.el-form) {
    width: 90% !important;
  }
}
</style>
