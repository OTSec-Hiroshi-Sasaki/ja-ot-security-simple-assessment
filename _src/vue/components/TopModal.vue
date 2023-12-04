<!--
診断アプリ Vue 開始時モーダル
-->
<template>
    <transition name="fade" appear>
        <div v-if="status.isShow" class=" c-modal startModal">
            <div class="startModal_inner">
                <div class="startModal_box">
                    <p class="startModal_boxHead">本診断は「工場システムにおけるサイバー・フィジカル・セキュリティ対策ガイドライン（案）」を基準に作成しております。</p>
                    <div class="startModal_boxBody">
                        <div class="startModal_textArea">
                            <div class="startModal_titleWrap">
                                <h1 class="startModal_title">OTセキュリティ簡易診断</h1>
                                <p class="startModal_copy">自社分析から今必要な対策がわかる！</p>
                            </div>
                            <button class="startModal_startBtn" @click="onClickHideModal"><span>スタート</span></button>
                        </div>
                        <picture class="startModal_image">
                            <source media="(max-width:767px)" srcset="/images/diagnosis/startModal_image_sp.png" sizes="100vw">
                            <img src="/images/diagnosis/startModal_image.png" alt="その場ですぐに結果が分かる！">
                        </picture>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script setup>

// Vue
import {reactive} from "vue";

// Reactive
const status = reactive({
    isShow: true,
})

/**
 * スタートモーダル 非表示処理
 */
const onClickHideModal = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    status.isShow = false;
}

</script>