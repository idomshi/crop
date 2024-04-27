import { readonly, ref, watchEffect } from "vue";
import smartcrop from 'smartcrop';
import type { Crop } from 'smartcrop'

const sourceCanvas = ref<OffscreenCanvas>()
const crop = ref<Crop>()

const width = ref(300)
const height = ref(400)
const minScale = ref(0.5)

export function useSourceCanvas() {
  function drawImage(bmp: ImageBitmap) {
    sourceCanvas.value = new OffscreenCanvas(bmp.width, bmp.height)
    const ctx = sourceCanvas.value.getContext("2d")
    ctx?.drawImage(bmp, 0, 0)
  }

  watchEffect(async () => {
    // cropを計算する。
    if (sourceCanvas.value === undefined) return
    const result = await smartcrop.crop(
      sourceCanvas.value,
      {
        width: width.value,
        height: height.value,
        minScale: minScale.value
      })
    crop.value = result.topCrop
  })
  return {
    sourceCanvas: readonly(sourceCanvas),
    crop,
    width,
    height,
    minScale,
    drawImage,
  }
}
