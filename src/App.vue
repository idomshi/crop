<script setup lang="ts">
import DropZone from './components/DropZone.vue'
import PreviewArea from './components/PreviewArea.vue';
import DownloadButton from './components/DownloadButton.vue'
import { useSourceCanvas } from './composables/useSourceCanvas';

const { sourceCanvas } = useSourceCanvas()
</script>

<template>
  <div class="main">
    <div :class="{ 'preview-hidden': sourceCanvas === undefined }" class="preview">
      <PreviewArea></PreviewArea>
      <DownloadButton></DownloadButton>
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

.preview {
@apply w-full h-full flex flex-col content-center flex-1;

  &>div {
    @apply flex-auto;
  }
}

.preview-hidden {
  @apply hidden;
}
</style>
