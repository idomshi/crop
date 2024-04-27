<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useSourceCanvas } from '../composables/useSourceCanvas';

const { drawImage, crop } = useSourceCanvas()

// ファイルを読み取る。
const fileinput = ref<HTMLInputElement>()
onMounted(() => {
  // input要素にEventListenerを追加する。
  if (fileinput.value === undefined) return
  fileinput.value.addEventListener('change', (ev: Event) => {
    const target = ev.target
    if (!(target instanceof HTMLInputElement)) return

    if (target.files === null) return
    const result = target.files[0]
    createImageBitmap(result)
      .then((bmp) => {
        drawImage(bmp)
      })
      .then(() => crop.value = undefined)
  })
})
</script>

<template>
  <div class="flex items-center justify-center w-full h-full">
    <label for="dropzone-fileinput" class="flex flex-col items-center justify-center
        w-full h-full rounded-lg cursor-pointer border-2 
        border-gray-300 bg-gray-50 
        hover:border-gray-400 hover:bg-gray-100
        dark:border-gray-600 dark:bg-gray-700
        dark:hover:border-gray-500 dark:hover:bg-gray-600">
      <div class="flex flex-col items-center justify-center pt-5 pb-6">
        <p class="">Click to upload image</p>
        <p>PNG, JPEG, WebP</p>
      </div>
      <input id="dropzone-fileinput" type="file" ref="fileinput" class="hidden">
    </label>
  </div>
</template>