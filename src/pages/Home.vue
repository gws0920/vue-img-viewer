<script lang="ts" setup>
import Test from '@/assets/test.jpg'
const roi = ref({ w: 0, h: 0, x: 0, y: 0 })

</script>

<template>
  <div class="flex h-100vh w-100vw">
    <code class="bg z-10 absolute">ROI: {{ roi }}</code>
    <ImgViewer v-model:roi="roi" :src="Test" />
    <ImgViewer v-model:roi="roi" :src="Test" />
  </div>
</template>

<style lang="scss" scoped>

</style>
