<template>
  <main class="page-home">
    <div class="panel-left"></div>
    <div class="panel-right panel-output" ref="panelOutput">
      <p class="line" v-for="line in output" :key="line" v-html="line"></p>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api } from '@/utils'
const output = ref([])

const loading = ref(true)

const panelOutput = ref()

const fileSize = ref(null)

const loadOutput = async () => {
  let url = '/api/info/output'
  if(fileSize.value){
    url = `/api/info/output?start=${fileSize.value}`
  }
  let result = await api('GET', url).catch((err) => {
    return console.log(err)
  })
  if(result.data.content.length > 0) {
    output.value = output.value.concat(result.data.content)
  }
  fileSize.value = result.data.file_size
}

onMounted(async () => {
  await loadOutput()
  panelOutput.value.scrollIntoView(false, {
    behavior: 'smooth'
  })
  setInterval(() => {
    loadOutput()
  }, 5000)
  loading.value = false
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
    flex-grow: 1;
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
</style>
