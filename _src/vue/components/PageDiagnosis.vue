<!--
診断アプリ Vue 診断ページ
-->
<template>
    <Loading v-if="status.isShowLoading" @finished-animation="loadingAfterEvent"></Loading>
    <Diagnosis v-else @finished-diagnosis="getDiagnosedData"></Diagnosis>
</template>

<script setup>

// Vue
import Diagnosis from './Diagnosis.vue'
import Loading from './Loading.vue'
import {onMounted, reactive} from "vue";

// Reactive
const status = reactive({
    diagnosedData: null,    // 診断結果データ
    isShowLoading: false,   // ローディング画面表示フラグ
})

// Emits
const emits = defineEmits(
    ['show-result']
)

// Methods
/**
 * DiagnosisコンポーネントからEmitされてきた診断結果データを受け取る
 * @param answeredData
 */
const getDiagnosedData = (answeredData) => {
    status.diagnosedData = answeredData;
    showLoading();
    window.scrollTo({top: 0, behavior: 'smooth'});
}

/**
 * ローディング画面を表示
 */
const showLoading = () => {
    status.isShowLoading = true;
}

/**
 * ローディングアニメーション終了後
 * URLを結果URLへと書き換え、App.vueへ診断結果データをEmitする
 *
 */
const loadingAfterEvent = () => {
    // URL書き換え
    window.history.replaceState('', '', status.diagnosedData['result_url'].slice(status.diagnosedData['result_url'].indexOf("result/")));
    emits('show-result', status.diagnosedData);
}

</script>