<template>
  <div class="login-wrap">
    <div class="login-box">
      <div class="login-title">{{ langs[settings.lang].login.login }}</div>
      <el-form
        ref="loginFormRef"
        :model="userData"
        :rules="rules"
        label-width="auto"
        style="max-width: 600px"
        hide-required-asterisk
      >
        <el-form-item :label="langs[settings.lang].login.username" prop="username">
          <el-input v-model="userData.username" style="width: 220px" />
        </el-form-item>
        <el-form-item :label="langs[settings.lang].login.password" prop="password" :error="errorMsg">
          <el-input
            v-model="userData.password"
            type="password"
            style="width: 220px"
            show-password
          />
        </el-form-item>
        <el-form-item :style="{ float: 'right' }">
          <el-button type="primary" @click="onSubmit(loginFormRef)">Login</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, inject, ref } from 'vue'
import { login } from '../utils'
import { useStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from "vue-router"

const router = useRouter();
const route = useRoute();

const store = useStore()
const { settings } = storeToRefs(store)
const langs = inject('langs')

const errorMsg = ref('')

const userData = reactive({
  username: '',
  password: ''
})

const loginFormRef = ref()

const rules = reactive({
  username: [
    {
      required: true,
      message: langs[settings.value.lang].login.msg_need_username,
      trigger: 'change'
    }
  ],
  password: [
    {
      required: true,
      message: langs[settings.value.lang].login.msg_need_password,
      trigger: 'change'
    }
  ]
})

const onSubmit = async (formEl) => {
  formEl.validate(async (valid) => {
    errorMsg.value = ''
    if (valid) {
      let result = await login(userData.username, userData.password)
      if (result.code < 0) {
        return errorMsg.value = result.msg
      }
      if(route.query.redirect){
        return router.push(route.query.redirect)
      }
      return router.push('/')
    }
    return errorMsg.value = langs[settings.value.lang].msg_err
  })
}
</script>

<style lang="scss" scoped>
.login-wrap {
  position: fixed;
  z-index: 99999;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;

  .login-box {
    padding: 24px 48px;
    border-radius: 10px;
    box-shadow: $shadow-1;

    .login-title {
      font-size: 1.5em;
      margin-bottom: 1.5em;
      text-align: center;
    }
  }
}
</style>
