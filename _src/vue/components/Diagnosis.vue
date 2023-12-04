<!--
診断アプリ Vue 設問
-->
<template>
    <TopModal></TopModal>
    <transition name="fade">
        <div class="diagnosis">
            <Indicator :current-step="status.current.step"></Indicator>
            <div class="diagnosis_area" ref="_$questions">
                <template v-for="group in QuestionsJSON" >
                    <transition name="fade" appear>
                        <div v-show="status.current.step === group.category_id" class="diagnosis_container">
                            <div class="diagnosis_head">
                                <div class="diagnosis_headWrap">
                                    <div class="diagnosis_headIcon">
                                        <img :src="`/images/diagnosis/icon_question_${group.category_name}.svg`" alt="">
                                    </div>
                                    <div class="diagnosis_headTitles">
                                        <p class="diagnosis_headNumber">Step{{group.category_id}}</p>
                                        <h2 class="diagnosis_headTitle"><span class="u-textColor-primary">{{group.category_name_locale}}</span>について現状を教えてください。</h2>
                                    </div>
                                </div>
                                <div class="diagnosis_headMsgWrap">
                                    <p class="diagnosis_headMsg">下記に当てはまる項目のいずれかをチェックしてください</p>
                                    <p class="diagnosis_headNote"><span class="u-textColor-primary">※</span>すべての設問に関して回答は必須になります。</p>
                                </div>
                            </div>
                            <div class="questions">
                                <template v-if="status.current.step === group.category_id" v-for="(question, j) in group.question">
                                    <div :class="{ 'questions_box': true, 'isError': status.v$[question.number].$errors.length}">
                                        <div class="questions_boxHead">
                                            <p class="questionNumber">Q{{question.number}}</p>
                                            <div class="questions_boxHeadWrap">
                                                <p class="questionText">{{question.text}}</p>
                                                <p class="questionErrorMsg">※必須項目です。当てはまる項目をチェックしてください。</p>
                                            </div>
                                        </div>
                                        <div class="questions_boxBody">
                                            <ul class="answers">
                                                <template v-for="(answer, k) in AnswersJSON">
                                                    <li :class="`answers_item ${(status.vModel[group.category_name][`${question.number}`] === k) ? 'isSelected' : ''}`">
                                                        <label
                                                            v-if="status.current.answersForResult[j]"
                                                            :for="`answer_${group.category_id}-${question.number}-${answer.number}`"
                                                        >
                                                            <input type="radio"
                                                                   :id="`answer_${group.category_id}-${question.number}-${answer.number}`"
                                                                   :name="`question_${group.category_id}-${question.number}`"
                                                                   :value="k"
                                                                   v-model="status.vModel[group.category_name][question.number]"
                                                            >{{answer.text}}
                                                        </label>
                                                    </li>
                                                </template>
                                            </ul>
                                            <div class="comment">
                                                <p class="comment_head">自由記述欄・コメント</p>
                                                <label class="comment_textarea">
                                                <textarea
                                                    v-if="status.current.answersForResult[j]"
                                                    v-model="status.current.answersForResult[j].comment"
                                                    id="comment_textarea"
                                                    name="comment_textarea"
                                                    placeholder="こちらにご記入ください（文字制限:200字）"
                                                    maxlength="200">
                                                </textarea>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="status.current.step === 4 && group.question.length === question.number " class="questions_box questions_box-extra">
                                        <div class="questions_boxHead">
                                            <p class="questionNumber">Q{{question.number + 1}}</p>
                                            <div class="questions_boxHeadWrap">
                                                <p class="questionText">{{ExQuestionJSON.text}}</p>
                                            </div>
                                        </div>
                                        <div class="questions_boxBody">
                                            <div class="comment">
                                                <label class="comment_textarea">
                                                    <textarea v-model="status.vModel.extraQuestionAnswer" placeholder="こちらにご記入ください（文字制限:500字）" maxlength="500"></textarea>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                            <button class="c-btn diagnosis_btn" @click="clickNextBtnEvent">
                                {{ status.current.step === 4 ? '結果を見る': '次へ' }}
                            </button>
                        </div>
                    </transition>
                </template>
            </div>
            <transition name="fade" appear>
                <div v-show="status.isOverNotApplicableCount" class="c-modal diagnosis_alertModal">
                    <div class="diagnosis_alertModalInner">
                        <div class="diagnosis_alertModalBox">
                            <p class="diagnosis_alertModalMsg">
                                「<span class="u-textColor-primary">自組織に当てはまらない</span>」<br class="sp">が回答の50%以上の場合、<br>
                                診断結果を算出することができません。
                            </p>
                            <button class="c-btn diagnosis_alertModalBtn" @click="hideAlertModal">回答を修正する</button>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script setup>
// Vue
import {reactive, watch, ref, onBeforeMount} from "vue";

// Vue plugin Vuelidate
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

// Component
import TopModal from './TopModal.vue'
import Indicator from './Indicator.vue'

// 設問情報
import DiagnosisJSON from "../assets/questions.json";
const QuestionsJSON = DiagnosisJSON[0].questions;
const ExQuestionJSON = DiagnosisJSON[0].extra;
const AnswersJSON = DiagnosisJSON[0].answers;

// 結果データテンプレート
import ResultFormatJSON from "../assets/resultDataFormat.json";
const ResultSendFormat = ResultFormatJSON[0];

// カテゴリー評価文言リスト
import EvaluationConfigJSON from "../assets/evaluationConfig.json";

// Reactive
const status = reactive({
    current: {
        step: 1,
        answerValues: [],
        answerPriorities: [],
        answersForResult: [],
        questionLength: [],
        questionCategory: null,
    },
    vModel: {
        organization: {}, // ex.) {1: 0, q_2...}:
        operation: {},
        technique: {},
        supply_chain: {},
        extraQuestionAnswer: "",
    },
    validations: {
        rules: {
            organization: {}, // ex.) {1: {required}, 2...}:
            operation: {},
            technique: {},
            supply_chain: {}
        },
        v$: null
    },
    isOverNotApplicable: false,
    answerValuesForEvaluation: [],
})

// Emits
const emits = defineEmits(
    ['finished-diagnosis']
)

// DOM
const _$questions = ref();

onBeforeMount(() => {

    // 全ての設問に応じてv-model初期値, バリデーションルールをセット
    QuestionsJSON.forEach((category) => {
        category.question.forEach((question) => {
            status.vModel[category['category_name']][`${question['number']}`] = "";
            status.validations.rules[category['category_name']][`${question['number']}`] = { required };
        })
    })

    // 回答監視（回答半数が"該当しない"となった場合にアラート表示）
    watch(status.current.answerValues, () => {
        if (validateQuestionAnswer()) {
            status.isOverNotApplicableCount = true;
        }
    })

    setQuestionSetting();

})

/**
 * 表示設問に関する各種パラメータを更新
 */
const setQuestionSetting = () => {

    // 表示ステップに応じた設問情報を取得
    const currentQuestions = QuestionsJSON.find((group) => {
        return group.category_id === status.current.step
    });

    // 表示カテゴリー名を更新
    status.current.questionCategory = currentQuestions["category_name"];

    // 表示カテゴリーの設問数を更新
    status.current.questionLength = currentQuestions["question"].length;

    // 結果送信用に回答情報の雛形を生成
    currentQuestions["question"].forEach((question) => {
        status.current.answersForResult.push({
            "cat_id": currentQuestions["category_id"],
            "order": question["number"],
            "question": question["text"],
            "answer": "",
            "comment": "",
        })
        // 各回答の重みづけ値を格納
        status.current.answerPriorities.push(question['priority']);
    })

    // カテゴリーの変更を監視
    watch(status.vModel[status.current.questionCategory], () => {
        Object.keys(status.vModel[status.current.questionCategory]).forEach((key, index) => {
            status.current.answerValues[index] = status.vModel[status.current.questionCategory][key];
        });
    })

    // バリデーション監視オブジェクト更新
    status.v$ = useVuelidate(status.validations.rules[status.current.questionCategory], status.vModel[status.current.questionCategory])

}

/**
 * 設問回答バリデーション 未入力/"該当しない"カウント数超過
 * @returns {Promise<void>}
 */
const questionValidate = async () => {

    const isValidationThrough = await status.v$.$validate()

    if (!isValidationThrough) {
        throw "typeNull";
    }

    // "当てはまらない"の回答の数を計算
    const count = status.current.answerValues.reduce((total, value) => {
        return total + (value === 0 ? 1 : 0)
    }, 0);

    const validateBorderCount = Math.ceil(status.current.questionLength / 2);

    if (count >= validateBorderCount) {
        throw "typeOverCount";
    }

}

/**
 * 次へ/結果を見る ボタンクリックイベント
 */
const clickNextBtnEvent = () => {

    // 表示設問のバリデーション実行
    questionValidate()
        // バリデーションパス
        .then(() => {
            calculateCategoryScore();
            saveAnsweredData();
            pushEvaluationValues();

            if (status.current.step >= QuestionsJSON.length) {
                finishQuestionStep();
            } else {
                // 設問ページ → 設問ページ
                resetCurrentAnswers();
            }

            window.scrollTo({top: 0});
        })

        .catch((type) => {
            // バリデーションエラー
            if (type === "typeOverCount") {
                // 回答の半数が"該当しない"の場合のアラート表示
                status.isOverNotApplicableCount = true;

            } else {
                // 未入力エラー存在時のスクロール処理
                const $firstErrorItem = _$questions.value.querySelector('.isError');
                const scrollAmountY = $firstErrorItem.getBoundingClientRect().top;
                window.scrollBy({top: scrollAmountY, behavior: 'smooth'});
            }
        })
}

/**
 * スコア計算処理（カテゴリー別）
 */
const calculateCategoryScore = () => {

    // ★★★スコア計算式★★★
    // 重み(priority) * 各回答が持つscore(constant_score) / カテゴリ総重み(totalPriority) = カテゴリ内score(パーセンテージ)

    // 設問ごとの重み
    const priorities = status.current.answerPriorities;

    // カテゴリー単位の総重み
    const totalPriorityAmount = priorities.reduce((sum, value) => {
        return sum + value;
    }, 0);

    // 回答ごとの倍率
    const answerWeights = status.current.answerValues.map((value) => {
        return AnswersJSON[value]['constant_score'];
    });

    let score = 0;

    for (let i = 0; i < status.current.answerValues.length; i++) {
        score += Math.round(((((priorities[i]) * answerWeights[i]) / totalPriorityAmount)) * 100);
    }

    ResultSendFormat["scores"][`score_${status.current.questionCategory}`] = score;
}

/**
 * 設問の回答情報を保存
 */
const saveAnsweredData = () => {

    status.current.answerValues.forEach((answerValue, i) => {
        status.current.answersForResult[i]['answer'] = AnswersJSON[answerValue]['text'];
    })

    status.current.answersForResult.forEach((data) => {
        ResultSendFormat['questions'].push(data);
    })
}

/**
 * 結果ページ向けの評価文言 対象となる設問の回答(Value)を保存
 */
const pushEvaluationValues = () => {

    const currentCategory = status.current.questionCategory;
    const evaluateTargetQuestions = EvaluationConfigJSON[0]["evaluate_targets"][currentCategory]['questions'];

    evaluateTargetQuestions.forEach((question) => {
        status.current.answerValues.forEach((answerValue, i) => {
            if (question['question_number'] === status.current.answersForResult[i]['order']) {
                status.answerValuesForEvaluation.push(answerValue);
            }
        })
    })

}

/**
 * 表示設問切り替え処理
 */
const resetCurrentAnswers = () => {

    const answerLength = status.current.answerValues.length;

    status.current.answerValues.splice(0, answerLength)
    status.current.answersForResult.splice(0, answerLength);
    status.current.answerPriorities.splice(0, answerLength);

    status.current.step++;

    setQuestionSetting();
}

/**
 * 全設問終了時処理
 */
const finishQuestionStep = () => {

    // 最終の補足設問のみ別途で結果保存
    ResultSendFormat['questions'].push({
        "cat_id": ExQuestionJSON['category_id'],
        "order": ExQuestionJSON['order'],
        "question": ExQuestionJSON['text'],
        "answer": status.vModel.extraQuestionAnswer,
        "comment": "",
    })

    calculateTotalScore();
    createResultURL();
    completeAllDiagnosis();
}

/**
 * スコア計算処理（トータルスコア）
 */
const calculateTotalScore = () => {
    // 合計スコア = ((組織的スコア*3)+(運用的スコア*3)+(技術的スコア*3)+(サプライチェーンスコア))/10
    ResultSendFormat['scores']['score_total'] = Math.ceil(
        0.1 * (
            (ResultSendFormat['scores']['score_organization'] * 3) +
            (ResultSendFormat['scores']['score_operation'] * 3) +
            (ResultSendFormat['scores']['score_technique'] * 3) +
            (ResultSendFormat['scores']['score_supply_chain'])
        )
    )
}

/**
 * 結果ページURL生成/格納
 */
const createResultURL = () => {

    const answerValues = status.answerValuesForEvaluation.join("");

    const urlParam = {
        score_total: `?tt=${ResultSendFormat['scores']['score_total']}`,
        score_organization: `&or=${ResultSendFormat['scores']['score_organization']}`,
        score_operation: `&op=${ResultSendFormat['scores']['score_operation']}`,
        score_technique: `&te=${ResultSendFormat['scores']['score_technique']}`,
        score_supply_chain: `&su=${ResultSendFormat['scores']['score_supply_chain']}`,
        evaluation_numbers: `&kp=${answerValues}`,
    }

    // 結果URLを生成し、結果データへ保存
    ResultSendFormat['result_url'] =
        window.location.protocol + "//" + window.location.hostname + "/result/"
        + urlParam['score_total']
        + urlParam['score_organization']
        + urlParam['score_operation']
        + urlParam['score_technique']
        + urlParam['score_supply_chain']
        + urlParam['evaluation_numbers'];
}

/**
 * 診断完了 親コンポーネント(PageDiagnosis.vue)へEmitする
 */
const completeAllDiagnosis = () => {
    emits('finished-diagnosis', ResultSendFormat);
}

/**
 * "当てはまらない"が半数以上の場合のエラー判定処理
 */
const validateQuestionAnswer = () => {
    // "当てはまらない"の数を計算
    const count = status.current.answerValues.reduce((total, value) => {
        return total + (value === 0 ? 1 : 0)
    }, 0);

    const validateBorderCount = Math.ceil(status.current.questionLength / 2);

    return count >= validateBorderCount;
}

/**
 * アラートモーダル 非表示処理
 */
const hideAlertModal = () => {
    status.isOverNotApplicableCount = false;
}

</script>