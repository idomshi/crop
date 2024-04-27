<script setup lang="ts">
import DropZone from './components/DropZone.vue'
import PreviewArea from './components/PreviewArea.vue';
import { useSourceCanvas } from './composables/useSourceCanvas'

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
  <div class="main">
    <div :class="{ hidden: sourceCanvas === undefined }" class="flex-1">
      <PreviewArea></PreviewArea>
      <div>
        <button type="button" @click="downloadImage">download</button>
      </div>
    </div>
    <div v-if="sourceCanvas === undefined">
      <DropZone></DropZone>
    </div>
  </div>
</template>

<style scoped>
.main {
  @apply w-full h-dvh p-2 flex flex-col gap-2;

  &>div {
    @apply flex-1;
  }
}
</style>
