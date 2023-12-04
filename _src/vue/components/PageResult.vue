<!--
診断アプリ Vue 結果ページ
-->
<template>
    <div class="result">
        <div class="result_head">
            <p class="result_headMsg">本診断は「工場システムにおけるサイバー・フィジカル・セキュリティ対策ガイドライン」の付録Eのチェックリスト項目に準拠して作成しております。</p>
            <button @click="toggleShowModal" class="result_headBtn"><span>分析結果シートの見方</span></button>
        </div>
        <div class="result_details">
            <div class="result_detailsInner">
                <h2 class="result_title">診断結果</h2>
                <div class="result_wrap">
                    <p class="result_lead">
                        グラフはOTセキュリティ対策のスコアを表示しています。<br class="pc">
                        グラフの値が大きければ大きいほど、OTセキュリティ対策が行われていることを示します。
                    </p>
                    <div class="result_scores">
                        <div class="result_scoresContainer">
                            <div class="result_scoresBox">
                                <h3 class="result_scoresHead">{{resultParams['categories']['tt']['name']}}</h3>
                                <div class="result_scoresBody">
                                    <div class="result_scoresGraphWrap"><canvas class="result_scoresGraph" ref="graph"></canvas></div>
                                    <div class="result_scoresDetail">
                                        <dl class="result_scoresWrap">
                                            <div class="result_scoresColumn result_scoresColumn-evaluation">
                                                <dt>評価</dt>
                                                <dd :class="`u-textColor-${resultParams['categories']['tt']['rank']}Rank`">
                                                    {{resultParams['categories']['tt']['rank'].toUpperCase()}}
                                                </dd>
                                            </div>
                                            <div class="result_scoresColumn result_scoresColumn-percent">
                                                <dt>スコア</dt>
                                                <dd><span>{{resultParams['categories']['tt']['value']}}</span>%</dd>
                                            </div>
                                        </dl>
                                        <p class="result_scoresDesc">{{resultParams['categories']['tt']['text']}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="result_scoresContainer">
                            <div v-for="category in ['or','op','te','su',]" class="result_scoresBox">
                                <h3 class="result_scoresHead">{{resultParams['categories'][category]['name']}}</h3>
                                <div class="result_scoresBody">
                                    <div class="result_scoresDetail">
                                        <dl class="result_scoresWrap">
                                            <div class="result_scoresColumn result_scoresColumn-evaluation">
                                                <dt>評価</dt>
                                                <dd :class="`u-textColor-${resultParams['categories'][category]['rank']}Rank`">
                                                    {{resultParams['categories'][category]['rank'].toUpperCase()}}
                                                </dd>
                                            </div>
                                            <div class="result_scoresColumn result_scoresColumn-percent">
                                                <dt>スコア</dt>
                                                <dd><span>{{resultParams['categories'][category]['value']}}</span>%</dd>
                                            </div>
                                        </dl>
                                        <p class="result_scoresDesc">{{resultParams['categories'][category]['text']}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="result_guide">
                        <a href="https://www.meti.go.jp/policy/netsecurity/wg1/factorysystems_guideline.html" class="result_guideLink" target="_blank">
                            工場システムにおけるサイバー・フィジカル・セキュリティ対策ガイドライン
                            <div class="result_guideIcon"><img src="/images/result/icon_externalLink.svg" alt=""></div>
                        </a>
                        <p class="result_guideNote"><span class="u-textColor-primary">※</span>本診断は上記ガイドラインを基準に作成しております</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="resultData" class="result_answers">
            <div class="result_answersInner">
                <h2 class="result_answersTitle">各回答内容</h2>
                <div class="result_answersArea">
                    <details v-for="category in ['or','op','te','su']" class="result_answersBox" open>
                        <summary class="result_answersBoxHead">{{resultParams['categories'][category]['name']}}</summary>
                        <div class="result_answersBoxBody">
                            <table>
                                <thead>
                                <tr>
                                    <th>番号</th>
                                    <th>確認項目</th>
                                    <th>回答</th>
                                    <th>自由記入欄</th>
                                </tr>
                                </thead>
                                <tbody>
                                <template v-for="(result, index) in resultParams['categories'][category]['diagnosedData']">
                                    <tr>
                                        <td>{{result['cat_id']}}-{{result['order']}}</td>
                                        <td>{{result['question']}}</td>
                                        <td>{{result['answer']}}</td>
                                        <td>{{result['comment']}}</td>
                                    </tr>
                                    <tr v-if="category === 'su' && resultParams['categories'][category]['diagnosedData'].length === index + 1">
                                        <td>5-1</td>
                                        <td>{{resultParams.extraQuestionAnswer.question}}</td>
                                        <td>{{resultParams.extraQuestionAnswer.answer}}</td>
                                        <td></td>
                                    </tr>
                                </template>
                                </tbody>
                            </table>
                            <button @click="closeAccordion" class="result_answersCloseBtn" aria-label="回答一覧を閉じる"></button>
                        </div>
                    </details>
                </div>
            </div>
        </div>
        <transition name="fade" appear>
            <div v-show="status.isShowModal" class="c-modal result_modal">
                <div class="result_modalInner">
                    <button @click="toggleShowModal" class="result_modalBtn" aria-label="モーダルを閉じる">
                        <img src="/images/result/btn_modalClose.svg" alt="閉じる">
                    </button>
                    <div class="result_modalBox">
                        <p class="result_modalTitle">分析結果シートの見方</p>
                        <dl class="result_modalExplain">
                            <dt class="result_modalExplainHead">スコア</dt>
                            <dd class="result_modalExplainScore">0〜100</dd>
                            <dd class="result_modalExplainDesc">チェックシートの個別項目と回答(0-4)に重みづけをして、セキュリティ対策の状況をスコア化。全ての項目が「一部実施」の場合に約40%、「実施している」だと約60%となるように調整している。</dd>
                        </dl>
                        <table class="result_modalExample">
                            <thead>
                            <tr>
                                <th>評価</th>
                                <th>スコア</th>
                                <th>解説</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td class="result_modalExampleRank u-textColor-aRank">A</td>
                                <td class="result_modalExampleScore">80〜</td>
                                <td class="result_modalExampleDesc">ほとんどの必要な対策が実施され、手順が文書化されている。リスクを十分低減できており、継続的な改善がなされている。</td>
                            </tr>
                            <tr>
                                <td class="result_modalExampleRank u-textColor-bRank">B</td>
                                <td class="result_modalExampleScore">60〜79</td>
                                <td class="result_modalExampleDesc">ほとんどの必要な対策が実施されているが、手順が文書化できていない。リスクを低減できているが、継続的な改善に課題がある。</td>
                            </tr>
                            <tr>
                                <td class="result_modalExampleRank u-textColor-cRank">C</td>
                                <td class="result_modalExampleScore">40〜59</td>
                                <td class="result_modalExampleDesc">ほとんどの必要な対策の実施が不十分。リスクが低減されておらず、セキュリティ侵害時の被害が大きいと想定される。</td>
                            </tr>
                            <tr>
                                <td class="result_modalExampleRank u-textColor-dRank">D</td>
                                <td class="result_modalExampleScore">0〜39</td>
                                <td class="result_modalExampleDesc">ほとんどの必要な対策が未実施。リスクが認識されておらず、セキュリティ侵害時の被害が大きいと想定される。</td>
                            </tr>
                            </tbody>
                        </table>
                        <p class="result_modalNote">
                            <span>注意事項</span>：この診断結果は、設問に対する回答をもとに作成した簡易的なものであるため、<span class="u-textColor-primary">回答者の主観により異なる結果が出る、実態と乖離があるなどの可能性</span>があります。より精度の高い診断を行うために、現地ヒアリング・通信モニタリング調査の実施をお勧めします。
                        </p>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>

// Vue
import {onBeforeMount, onMounted, reactive, ref} from "vue";

// 評価文言 参照リスト
import EvaluationConfigJSON from "../assets/evaluationConfig.json";
const EvaluationConfigTexts = EvaluationConfigJSON[0]["evaluate_texts"];

// Reactive
const status = reactive({
    isShowModal: false,
})

// Props
const props = defineProps({
    resultData: {default: null},
})

// 表示データ
const resultParams = {
    result_url: window.location.href,
    categories: {
        tt: {name: "総合評価", value: 0, rank: null, text: null},
        or: {name: "組織的対策", value: 0, rank: null, text: null, diagnosedData: []},
        op: {name: "運用的対策", value: 0, rank: null, text: null, diagnosedData: []},
        te: {name: "技術的対策", value: 0, rank: null, text: null, diagnosedData: []},
        su: {name: "工場システムサプライチェーン管理", value: 0, rank: null, text: null, diagnosedData: []}
    },
    extraQuestionAnswer: {
        question: "",
        answer: "",
    }
}

// DOM
const graph = ref();

/**
 * 結果表示データ（resultParams）を更新
 */
const setResultParams = () => {

    const UrlParams = new URLSearchParams(document.location.search);
    const categories = ["tt", "or", "op", "su", "te"];

    // カテゴリーのスコア, ランクを算出
    categories.forEach((category) => {
        resultParams.categories[category]['value'] = UrlParams.get(category);
        resultParams.categories[category]['rank'] = calculateRank(UrlParams.get(category));
    })

    // "kp"の9桁文字列を1桁ずつに分割し配列化
    const evaluationParams = UrlParams.get("kp").split("");

    // 分割した"kp"をカテゴリーごとに割り当て、評価文言を取得
    // 9桁の割り当て → 2桁[組織的]/3桁[運用的]/2桁[技術的]/2桁[サプライチェーン]/
    categories.forEach((category) => {
        switch (category) {
            case "or" :
                resultParams.categories[category]['text'] = createEvaluationText("Pe", [evaluationParams[0], evaluationParams[1]], resultParams.categories[category]['rank']);
                break;
            case "op" :
                resultParams.categories[category]['text'] = createEvaluationText("Pr", [evaluationParams[2], evaluationParams[3], evaluationParams[4]], resultParams.categories[category]['rank']);
                break;
            case "te" :
                resultParams.categories[category]['text'] = createEvaluationText("Te", [evaluationParams[5], evaluationParams[6]], resultParams.categories[category]['rank']);
                break;
            case "su" :
                resultParams.categories[category]['text'] = createEvaluationText("Sp", [evaluationParams[7], evaluationParams[8]], resultParams.categories[category]['rank']);
                break;
            case "tt" :
                resultParams.categories[category]['text'] = createTotalEvaluationText();
                break;
            default :
                break;
        }
    })

    // 診断 → 結果と遷移してきた場合、回答情報を取得
    if (props.resultData) {
        getDiagnosedData();
    }

}

/**
 * 診断ページ → 結果ページへと遷移した場合の結果情報を取得
 * 回答情報
 */
const getDiagnosedData = () => {

    const result = props.resultData;

    result['questions'].forEach((question) => {
        switch (question['cat_id']) {
            case 1 :
                resultParams.categories['or']['diagnosedData'].push(question);
                break;
            case 2 :
                resultParams.categories['op']['diagnosedData'].push(question);
                break;
            case 3 :
                resultParams.categories['te']['diagnosedData'].push(question);
                break;
            case 4 :
                resultParams.categories['su']['diagnosedData'].push(question);
                break;
            case 99 :
                resultParams.extraQuestionAnswer.question = question['question'];
                resultParams.extraQuestionAnswer.answer = question['answer'];
                break;
            default:
                break;
        }
    })
}

/**
 * 総合カテゴリーの評価文言生成
 * @returns {string}
 */
const createTotalEvaluationText = () => {

    const ranks = {
        or: resultParams["categories"]["or"]["rank"],
        op: resultParams["categories"]["op"]["rank"],
        te: resultParams["categories"]["te"]["rank"],
        su: resultParams["categories"]["su"]["rank"],
        tt: resultParams["categories"]["tt"]["rank"],
    };

    let evaluationTextFirst = "";   //評価文言前半
    let evaluationTextSecond = "";  //評価文言後半

    // 前半の評価文言を取得
    if (isHighRank(ranks.or)) {
        // 組織的対策評価が A or B の場合
        if (isHighRank(ranks.op) && isHighRank(ranks.te)) {
            evaluationTextFirst = EvaluationConfigTexts["a-1"];
        } else if (isHighRank(ranks.op) && !isHighRank(ranks.te)) {
            evaluationTextFirst = EvaluationConfigTexts["a-2"];
        } else if (!isHighRank(ranks.op) && isHighRank(ranks.te)) {
            evaluationTextFirst = EvaluationConfigTexts["a-3"];
        } else if (!isHighRank(ranks.op) && !isHighRank(ranks.te)) {
            evaluationTextFirst = EvaluationConfigTexts["a-4"];
        }

    } else {
        // 組織的対策評価が C or D の場合
        if (isHighRank(ranks.op) && isHighRank(ranks.te)) {
            evaluationTextFirst = EvaluationConfigTexts["a-5"];
        } else if (isHighRank(ranks.op) && !isHighRank(ranks.te)) {
            evaluationTextFirst = EvaluationConfigTexts["a-6"];
        } else if (!isHighRank(ranks.op) && isHighRank(ranks.te)) {
            evaluationTextFirst = EvaluationConfigTexts["a-7"];
        } else if (!isHighRank(ranks.op) && !isHighRank(ranks.te)) {
            evaluationTextFirst = EvaluationConfigTexts["a-8"];
        }
    }

    // 後半の評価文言を取得
    switch (ranks.tt) {
        case "a" :
            if (isHighRank(ranks.or) && isHighRank(ranks.op) && isHighRank(ranks.te)) {
                evaluationTextSecond = EvaluationConfigTexts["b-1"];
            } else {
                evaluationTextSecond = EvaluationConfigTexts["b-2"];
            }
            break;

        case "b" :
            if (isHighRank(ranks.or) && isHighRank(ranks.op) && isHighRank(ranks.te)) {
                evaluationTextSecond = EvaluationConfigTexts["b-3"];
            } else {
                evaluationTextSecond = EvaluationConfigTexts["b-2"];
            }
            break;

        case "c" :
            evaluationTextSecond = EvaluationConfigTexts["b-4"];
            break;

        case "d" :
            evaluationTextSecond = EvaluationConfigTexts["b-5"];
            break;

        default:
            break;
    }

    return evaluationTextFirst + evaluationTextSecond;

}

/**
 *
 * @param evaluateCategory
 * @param paramsArray
 * @param rank
 * @returns {string}
 */
const createEvaluationText = (evaluateCategory, paramsArray, rank) => {

    let evaluationText = "";

    paramsArray.forEach((param, index) => {
        const categoryNumber = String(index + 1);
        evaluationText +=
            EvaluationConfigTexts[evaluateCategory + categoryNumber + '-' + param];
            // ex.) Pf1-1, Pf1-2
    })

    const rankList = ['a', 'b', 'c', 'd'];
    evaluationText += EvaluationConfigTexts[evaluateCategory + 'T-' + rankList.indexOf(rank)];
    // ex.) PfT-1

    return evaluationText;
}

/**
 * スコアに応じてランクを算出
 * @param intScore
 * @returns {string}
 */
const calculateRank = (intScore) => {

    let rank;

    if (intScore >= 80) {
        rank = "a";
    } else if (80 > intScore && intScore >= 60) {
        rank = "b";
    } else if (60 > intScore && intScore >= 40) {
        rank = "c";
    } else {
        rank = "d";
    }

    return rank;
}

/**
 * ランクのグループ分け判定（HIGH/LOW）
 * @param rank
 * @returns {boolean}
 */
const isHighRank = (rank) => {
    return (rank === 'a' || rank === 'b');
}

/**
 * 回答情報アコーディオン 開閉制御
 * @param $el
 */
const closeAccordion = ($el) => {
    $el.target.closest('.result_answersBox').open = false;
}


/**
 * "分析結果シートの見方"モーダル 表示/非表示制御
 */
const toggleShowModal = () => {
    status.isShowModal = !status.isShowModal;
}

/**
 * 結果レーダーチャート生成
 * Chart.js（ライブラリ）使用
 * https://misc.0o0o.org/chartjs-doc-ja/
 */
const generateChart = () => {

    new Chart(graph.value, {
        type: "radar",
        data: {
            //データの各項目のラベル ※必須
            labels: ["", "", "", ""],
            //データ設定
            datasets: [
                {
                    data: [
                        resultParams['categories']['or']['value'],
                        resultParams['categories']['op']['value'],
                        resultParams['categories']['te']['value'],
                        resultParams['categories']['su']['value']
                    ],
                    //背景色
                    backgroundColor: "rgba(9,101,180,0.4)",
                    //線の終端を四角にするか丸めるかの設定。デフォルトは四角(butt)。
                    borderCapStyle: "square",
                    //線の色
                    borderColor: "rgba(9,101,180,0.8)",
                    //線と線が交わる箇所のスタイル。初期値は'miter'
                    borderJoinStyle: "",
                    //線の幅。ピクセル単位で指定。初期値は3。
                    borderWidth: 2,
                    //グラフの頂点のポイントの直径。初期値3
                    pointRadius: 0,
                }
            ]
        },
        options: {
            scales: {
                r: {
                    //グラフの最小値・最大値
                    min: 0,
                    max: 100,
                    //グリッドライン
                    grid: {
                        color: "#B1A6A6",
                        borderDash: [1, 3],
                    },
                    // 目盛りラベル
                    ticks: {
                        display: false,
                        count: 6,
                    },
                    //アングルライン
                    angleLines: {
                        color: "#B1A6A6",
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                }
            },
            animation: {
                duration: 1500 // アニメーション時間
            }
        },
    });


}


onBeforeMount(() => {
    setResultParams();
})

onMounted(() => {
    window.scrollTo({top: 0, behavior: 'smooth'});
    generateChart();
})

</script>