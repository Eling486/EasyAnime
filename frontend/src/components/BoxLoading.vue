<template>
  <Transition name="fade">
    <div class="loading-wrap" v-if="loading">
      <div class="loading-icon">Loading...</div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: true
  }
})
</script>

<style lang="scss" scoped>
.fade-enter-active {
  transition: opacity 0.2s;
}

.fade-leave-active {
  transition: opacity 0.2s;
  display: none;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $ea-white;
  z-index: 9998;
}
.loading-icon {
  color: ea-main(8);
  font-size: 40px;
  text-indent: -9999em;
  overflow: hidden;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  margin: 72px auto;
  position: relative;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation:
    loading 1.7s infinite ease,
    round 1.7s infinite ease;
  animation:
    loading 1.7s infinite ease,
    round 1.7s infinite ease;
}
@-webkit-keyframes loading {
  0% {
    box-shadow:
      0 -0.83em 0 -0.4em,
      0 -0.83em 0 -0.42em,
      0 -0.83em 0 -0.44em,
      0 -0.83em 0 -0.46em,
      0 -0.83em 0 -0.477em;
  }
  5%,
  95% {
    box-shadow:
      0 -0.83em 0 -0.4em,
      0 -0.83em 0 -0.42em,
      0 -0.83em 0 -0.44em,
      0 -0.83em 0 -0.46em,
      0 -0.83em 0 -0.477em;
  }
  10%,
  59% {
    box-shadow:
      0 -0.83em 0 -0.4em,
      -0.087em -0.825em 0 -0.42em,
      -0.173em -0.812em 0 -0.44em,
      -0.256em -0.789em 0 -0.46em,
      -0.297em -0.775em 0 -0.477em;
  }
  20% {
    box-shadow:
      0 -0.83em 0 -0.4em,
      -0.338em -0.758em 0 -0.42em,
      -0.555em -0.617em 0 -0.44em,
      -0.671em -0.488em 0 -0.46em,
      -0.749em -0.34em 0 -0.477em;
  }
  38% {
    box-shadow:
      0 -0.83em 0 -0.4em,
      -0.377em -0.74em 0 -0.42em,
      -0.645em -0.522em 0 -0.44em,
      -0.775em -0.297em 0 -0.46em,
      -0.82em -0.09em 0 -0.477em;
  }
  100% {
    box-shadow:
      0 -0.83em 0 -0.4em,
      0 -0.83em 0 -0.42em,
      0 -0.83em 0 -0.44em,
      0 -0.83em 0 -0.46em,
      0 -0.83em 0 -0.477em;
  }
}
@keyframes loading {
  0% {
    box-shadow:
      0 -0.83em 0 -0.4em,
      0 -0.83em 0 -0.42em,
      0 -0.83em 0 -0.44em,
      0 -0.83em 0 -0.46em,
      0 -0.83em 0 -0.477em;
  }
  5%,
  95% {
    box-shadow:
      0 -0.83em 0 -0.4em,
      0 -0.83em 0 -0.42em,
      0 -0.83em 0 -0.44em,
      0 -0.83em 0 -0.46em,
      0 -0.83em 0 -0.477em;
  }
  10%,
  59% {
    box-shadow:
      0 -0.83em 0 -0.4em,
      -0.087em -0.825em 0 -0.42em,
      -0.173em -0.812em 0 -0.44em,
      -0.256em -0.789em 0 -0.46em,
      -0.297em -0.775em 0 -0.477em;
  }
  20% {
    box-shadow:
      0 -0.83em 0 -0.4em,
      -0.338em -0.758em 0 -0.42em,
      -0.555em -0.617em 0 -0.44em,
      -0.671em -0.488em 0 -0.46em,
      -0.749em -0.34em 0 -0.477em;
  }
  38% {
    box-shadow:
      0 -0.83em 0 -0.4em,
      -0.377em -0.74em 0 -0.42em,
      -0.645em -0.522em 0 -0.44em,
      -0.775em -0.297em 0 -0.46em,
      -0.82em -0.09em 0 -0.477em;
  }
  100% {
    box-shadow:
      0 -0.83em 0 -0.4em,
      0 -0.83em 0 -0.42em,
      0 -0.83em 0 -0.44em,
      0 -0.83em 0 -0.46em,
      0 -0.83em 0 -0.477em;
  }
}
@-webkit-keyframes round {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes round {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
