<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { useSourceCanvas } from '../composables/useSourceCanvas';

const viewCanvas = ref<HTMLCanvasElement>()
const viewCtx = ref<CanvasRenderingContext2D>()

const { sourceCanvas, crop } = useSourceCanvas()

// sourceCanvasが更新されたらviewCanvasを更新する。
watchEffect(async () => {
  // viewCanvasに画像を表示する。
  if (sourceCanvas.value === undefined) return
  if (viewCanvas.value === undefined) return
  viewCanvas.value.width = sourceCanvas.value.width
  viewCanvas.value.height = sourceCanvas.value.height
  viewCtx.value?.drawImage(sourceCanvas.value, 0, 0)
})

watchEffect(() => {
  // crop範囲をマークする。
  if (viewCtx.value === undefined) return
  if (crop.value === undefined) return
  viewCtx.value.lineWidth = 4
  viewCtx.value.strokeStyle = '#fe403c'
  viewCtx.value.beginPath()
  viewCtx.value.moveTo(crop.value.x, crop.value.y)
  viewCtx.value.lineTo(crop.value.x + crop.value.width, crop.value.y)
  viewCtx.value.lineTo(crop.value.x + crop.value.width, crop.value.y + crop.value.height)
  viewCtx.value.lineTo(crop.value.x, crop.value.y + crop.value.height)
  viewCtx.value.closePath()
  viewCtx.value.stroke()
})

onMounted(() => {
  // canvas関係のContext2Dを取得する。
  viewCtx.value = viewCanvas.value?.getContext("2d") ?? undefined
})
</script>

<template>
  <canvas ref="viewCanvas" class="viewcanvas"></canvas>
</template>

<style scoped>
.viewcanvas {
  max-width: 80%;
  max-height: 80dvh;
  border: solid 1px #333;
}
</style>
