<!--
診断アプリ Vue エントリーポイントコンポーネント
-->
<template>
    <PageResult v-if="status.isShowResult" :result-data="status.resultData"></PageResult>
    <PageDiagnosis v-else @show-result="showResult"></PageDiagnosis>
</template>

<script setup>
import PageDiagnosis from './PageDiagnosis.vue'
import PageResult from './PageResult.vue'
import {onBeforeMount, reactive} from "vue";

const status = reactive({
    resultData: null,       // 診断後の結果データ
    isShowResult: false,     // 結果ページ表示フラグ
})

onBeforeMount(() => {

    const url = new URL(window.location.href);

    // シェアURLから遷移してきた場合
    if (url.pathname.includes('result')) {
        status.isShowResult = true;
    }
})

/**
 * 結果表示処理 ※診断完了後
 * @param resultData
 */
const showResult = (resultData) => {
    window.history.pushState({}, '', '');
    status.resultData = resultData;
    status.isShowResult = true;
}
</script>