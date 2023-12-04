<!--
診断アプリ Vue 結果表示前ローディング
-->
<template>
    <div class="loading">
        <div class="loading_inner">
            <div class="loading_wrap">
                <p class="loading_title">診断中</p>
                <div class="loading_bar">
                    <div class="loading_progress" ref="loadingProgress"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// Vue
import {ref, onMounted} from "vue";

// Emits
const emits = defineEmits(
    ['finished-animation']
)

// DOM
const loadingProgress = ref();

onMounted(() => {
    loadingProgress.value.addEventListener("animationend", () => {
        emits('finished-animation');
    })
})

</script>