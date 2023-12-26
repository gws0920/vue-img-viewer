<script lang="ts" setup>
interface Props {
  src: string
  zoomRange?: number[]
  roi?: Roi
}

const props = withDefaults(defineProps<Props>(), {
  roi: () => ({ x: 0, w: 0, y: 0, h: 0 }),
  zoomRange: () => [0.2, 5]
})
const emit = defineEmits<{
  (e: 'update:roi', roi: Roi): void
  (e: 'scale', roi: Roi): void
  (e: 'moving', roi: Roi): void
  (e: 'startMove'): void
  (e: 'moved', roi: Roi): void
}>()

const container = ref<HTMLDivElement>()
const image = ref<HTMLImageElement>()
const { width, height } = useElementSize(container)
const style = computed(() => {
  const { x, y, w, h } = props.roi
  return {
    left: `${x}px`,
    width: `${w}px`,
    top: `${y}px`,
    height: `${h}px`,
  }
})

const startInfo = {
  pos: [0, 0],
  start: [0, 0]
}
const pointerdown = (e: PointerEvent) => {
  if (e.button !== 0) return
  startInfo.pos = [props.roi.x, props.roi.y]
  startInfo.start = [e.clientX, e.clientY]
  document.body.addEventListener('pointermove', pointermove)
  document.body.addEventListener(
    'pointerup',
    () => {
      document.body.removeEventListener('pointermove', pointermove)
      document.body.releasePointerCapture(e.pointerId)
      document.body.style.userSelect = 'auto'
      emit('moved', { ...props.roi })
    },
    { once: true }
  )
  document.body.style.userSelect = 'none'
  document.body.setPointerCapture(e.pointerId)
  emit('startMove')
}
const pointermove = (e: PointerEvent) => {
  const { clientX, clientY } = e
  const { pos, start: [startX, startY] } = startInfo
  const [initX, initY] = pos || [0, 0]
  emit('update:roi', {
    ...props.roi,
    x: initX + clientX - startX,
    y: initY + clientY - startY,
  })
  emit('moving', {
    ...props.roi,
    x: initX + clientX - startX,
    y: initY + clientY - startY,
  })
}

const onScale = (e: WheelEvent) => {
  if (!image.value || !container.value) return
  const { deltaX, deltaY, clientX, clientY } = e
  const delta = deltaX || deltaY
  const ratio = delta / 300
  const { w, h } = props.roi
  const { left, top } = image.value.getBoundingClientRect()
  const { left: containerLeft, top: containerTop } = container.value.getBoundingClientRect()
  const ratioX = (clientX - left) / w
  const ratioY = (clientY - top) / h
  const [minRatio, maxRatio] = props.zoomRange
  const newW = minmax(w - w * ratio, [width.value * minRatio, width.value * maxRatio])
  const newH = minmax(h - h * ratio, [height.value * minRatio, height.value * maxRatio])
  emit('update:roi', {
    w: newW,
    h: newH,
    x: -newW * ratioX + clientX - containerLeft,
    y: -newH * ratioY + clientY - containerTop,
  })
  emit('scale', {
    w: newW,
    h: newH,
    x: -newW * ratioX + clientX - containerLeft,
    y: -newH * ratioY + clientY - containerTop,
  })
}

onMounted(() => {
  emit('update:roi', {
    x: 0, y: 0, w: width.value, h: height.value
  })
})
</script>

<template>
  <div
    ref="container"
    class="h-full w-full relative overflow-hidden"
    @pointerdown="pointerdown"
    @wheel="onScale"
  >
    <img
      ref="image"
      class="h-full object-contain w-full absolute"
      :src="props.src"
      :style="style"
      :draggable="false"
    >
  </div>
</template>

<style lang="scss" scoped>

</style>
