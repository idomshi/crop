<script setup lang="ts">
import DownloadButton from './DownloadButton.vue';
import { useSourceCanvas } from '../composables/useSourceCanvas';
const { width, height, setWidth, setHeight, calculate } = useSourceCanvas()

function setW(ev: Event) {
    const target = ev.target
    if (!(target instanceof HTMLInputElement)) return
    setWidth(target.value)
}

function setH(ev: Event) {
    const target = ev.target
    if (!(target instanceof HTMLInputElement)) return
    setHeight(target.value)
}
</script>

<template>
    <aside class="sidemenuroot">
        <section class="flex flex-col gap-1">
            <legend for="width" class="text-sm text-gray-800">width: </legend><input id="width" type="text"
                :value="width" @input="setW" class="ml-2 w-20 p-1 text-right border rounded">
            <legend for="height" class="text-sm text-gray-800">height: </legend><input id="height" type="text"
                :value="height" @input="setH" class="ml-2 w-20 p-1 text-right border rounded">
            <button type="button" @click="calculate"
                class="p-2 text-white bg-slate-500 hover:bg-slate-400 rounded border">
                計算する
            </button>
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