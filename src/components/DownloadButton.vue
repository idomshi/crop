<script setup lang="ts">
import { useSourceCanvas } from '../composables/useSourceCanvas'

const { sourceCanvas, crop } = useSourceCanvas()

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
  <button type="button" @click="downloadImage">download</button>
</template>