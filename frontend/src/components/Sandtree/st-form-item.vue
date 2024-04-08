<template>
  <div class="st-form-item">
    <div class="st-form-item-label">
        <label for="">{{ label }}</label>
    </div>
    <div class="st-form-item-content">
        <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String
})
</script>

<style lang="scss" scoped>
.st-form-item {
    display: flex;
}
</style>
