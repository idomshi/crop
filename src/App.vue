<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import smartcrop from 'smartcrop';
import type { Crop } from 'smartcrop'

const viewCanvas = ref<HTMLCanvasElement>()
const viewCtx = ref<CanvasRenderingContext2D>()
const sourceCanvas = ref<OffscreenCanvas>()
const crop = ref<Crop>()
const width = ref(2)
const height = ref(3)
const minScale = ref(0.5)

// sourceCanvasが更新されたらviewCanvasを更新する。
watchEffect(async () => {
  // viewCanvasに画像を表示する。
  if (sourceCanvas.value === undefined) return
  if (viewCanvas.value === undefined) return
  viewCanvas.value.width = sourceCanvas.value.width
  viewCanvas.value.height = sourceCanvas.value.height
  viewCtx.value?.drawImage(sourceCanvas.value, 0, 0)

  // cropを計算する。
  const result = await smartcrop.crop(sourceCanvas.value, { width: width.value, height: height.value, minScale: minScale.value })
  crop.value = result.topCrop
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

// ファイルを読み取る。
const fileinput = ref<HTMLInputElement>()
onMounted(() => {
  // canvas関係のContext2Dを取得する。
  viewCtx.value = viewCanvas.value?.getContext("2d") ?? undefined

  // input要素にEventListenerを追加する。
  if (fileinput.value === undefined) return
  fileinput.value.addEventListener('change', (ev: Event) => {
    const target = ev.target
    if (!(target instanceof HTMLInputElement)) return

    if (target.files === null) return
    const result = target.files[0]
    createImageBitmap(result)
      .then((bmp) => {
        sourceCanvas.value = new OffscreenCanvas(bmp.width, bmp.height)
        const ctx = sourceCanvas.value.getContext("2d")
        ctx?.drawImage(bmp, 0, 0)
      })
      .then(() => crop.value = undefined)
  })
})

async function downloadImage() {
  if (sourceCanvas.value === undefined) return
  if (crop.value === undefined) return
  const offCanvas = new OffscreenCanvas(crop.value.width, crop.value.height)
  const offCtx = offCanvas.getContext("2d")
  offCtx?.drawImage(sourceCanvas.value, crop.value.x, crop.value.y, crop.value.width, crop.value.height, 0, 0, crop.value.width, crop.value.height)
  const blob = await offCanvas.convertToBlob()

  var objectURL = window.URL.createObjectURL(blob);
  var link = document.createElement("a");
  document.body.appendChild(link);
  link.href = objectURL;
  link.download = 'croppedimage.png';
  link.click();
  document.body.removeChild(link);
}
</script>

<template>
  <div>
    <div>
      <canvas ref="viewCanvas" class="viewcanvas"></canvas>
    </div>
    <div>
      <button type="button" @click="downloadImage">download</button>
    </div>
    <input type="file" ref="fileinput">
  </div>
</template>

<style scoped>
.viewcanvas {
  max-width: 80%;
  max-height: 80dvh;
  border: solid 1px #333;
}
</style>
