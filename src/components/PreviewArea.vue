<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { useSourceCanvas } from '../composables/useSourceCanvas';

const viewCanvas = ref<HTMLCanvasElement>()
const viewCtx = ref<CanvasRenderingContext2D>()
const container = ref<HTMLDivElement>()
const ratio = ref(1)

const { sourceCanvas, crop } = useSourceCanvas()

/** viewCanvasを更新する。 */
function setCanvasSize() {
  if (container.value === undefined) return
  const cw = container.value.clientWidth
  const ch = container.value.clientHeight

  if (sourceCanvas.value === undefined) return
  const sw = sourceCanvas.value.width
  const sh = sourceCanvas.value.height

  ratio.value = Math.min(cw / sw, ch / sh)

  if (viewCanvas.value === undefined) return
  const ew = ratio.value * sourceCanvas.value?.width
  const eh = ratio.value * sourceCanvas.value?.height

  viewCanvas.value.width = ew
  viewCanvas.value.height = eh
  viewCanvas.value.style.width = `${ew}px`
  viewCanvas.value.style.height = `${eh}px`

  viewCtx.value?.drawImage(sourceCanvas.value, 0, 0, viewCanvas.value.width, viewCanvas.value.height)
  markCrop()
}

// sourceCanvasが更新されたらviewCanvasを更新する。
watchEffect(async () => {
  setCanvasSize()
})

/** crop範囲をマークする。 */
function markCrop() {
  if (viewCtx.value === undefined) return
  if (crop.value === undefined) return
  viewCtx.value.lineWidth = 1
  viewCtx.value.strokeStyle = '#fe403c'
  viewCtx.value.beginPath()
  viewCtx.value.moveTo(ratio.value * crop.value.x, ratio.value * crop.value.y)
  viewCtx.value.lineTo(ratio.value * (crop.value.x + crop.value.width), ratio.value * (crop.value.y))
  viewCtx.value.lineTo(ratio.value * (crop.value.x + crop.value.width), ratio.value * (crop.value.y + crop.value.height))
  viewCtx.value.lineTo(ratio.value * crop.value.x, ratio.value * (crop.value.y + crop.value.height))
  viewCtx.value.closePath()
  viewCtx.value.stroke()
}

watchEffect(() => {
  markCrop()
})

onMounted(() => {
  // canvas関係のContext2Dを取得する。
  viewCtx.value = viewCanvas.value?.getContext("2d") ?? undefined
  window.addEventListener('resize', setCanvasSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', setCanvasSize)
})
</script>

<template>
  <div class="flex-auto " ref="container">
    <canvas ref="viewCanvas" class="viewcanvas"></canvas>
  </div>
</template>

<style scoped>
.viewcanvas {
  @apply flex-1 border mx-auto border-gray-800;
}
</style>
