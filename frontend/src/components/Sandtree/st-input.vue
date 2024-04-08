<template>
  <div class="input-wrap">
    <input
      :type="text"
      v-model="value"
      :style="{width: inputWidth}"
      @change="$emit('change')"
      @input="$emit('input')"
      required
    />
    <span v-if="err !== null" class="err-text">{{ err }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: [String, Number],
    default: 'text'
  },
  err: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'middle'
  }
})
defineEmits(['change', 'input'])
const value = defineModel({ default: '' })

let inputWidth = '220px'

if (props.size == 'large'){
  inputWidth = '320px'
}
if(typeof props.size == 'number') inputWidth = `${props.size}px`

</script>

<style lang="scss" scoped>
.input-wrap {
  display: flex;
  flex-direction: column;
  padding: 0 4px 4px 4px;
  margin-bottom: 4px;

  input {
    background: none;
    outline: none;
    border: 1.5px solid $st-light-gray;
    padding: 8px;
    font-size: 16px;
    margin-bottom: 4px;
    border-radius: 3px;
    transition: all 0.2s;

    &:focus {
      border-color: $ea-main;
    }
  }

  .err-text {
    font-size: 11px;
    line-height: 11px;
    height: 11px;
    color: red;
    padding-left: 8px;
  }
}
</style>
