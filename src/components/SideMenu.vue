<script setup lang="ts">
import DownloadButton from './DownloadButton.vue';
import { useSourceCanvas } from '../composables/useSourceCanvas';
const { width, height } = useSourceCanvas()
</script>

<template>
    <aside class="sidemenuroot">
        <section class="">
            <legend for="width" class="text-sm text-gray-800">width: </legend><input id="width" type="text" v-model="width" class="ml-2 w-20 p-1 text-right border rounded">
            <legend for="height" class="text-sm text-gray-800">height: </legend><input id="height" type="text" v-model="height" class="ml-2 w-20 p-1 text-right border rounded">
        </section>
        <section>
            <DownloadButton></DownloadButton>
        </section>
    </aside>
</template>

<style scoped>
.sidemenuroot {
    @apply p-2 w-fit h-full bg-gray-100 flex flex-col justify-between flex-none;
}
</style>