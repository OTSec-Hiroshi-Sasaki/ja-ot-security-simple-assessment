# 簡易セキュリティ診断（診断アプリ）

## Directory Structure
```
.
├── README.md
│  ├── _src  // 開発ディレクトリ
│  │   │── index.js  // エントリーポイント
│  │   │── sass
│  │   └── vue
│  │      │── assets
│  │      └── components
│  └── deploy  // 公開ディレクトリ
├── webpack.condif.js // 設定ファイル
└── package.json
```

## Getting Started

### Environment
nodejs v16.16.0


### install node package module
```
$ npm install
```

### Browser Sync

```
$ npm run server
```

### Release

```
$ npm run build
```

## Note
### 結果ページについて
#### クエリパラメータの値を元に診断結果を表示
  * tt - 総合評価のスコア
  * or - 組織的対策のスコア
  * op - 運用的対策のスコア
  * te - 技術的対策のスコア
  * su - 工場システムサプライチェーン管理のスコア
  * kp - 各カテゴリーの評価文言生成用の数列  

#### 入力された回答内容について
回答内容は入力された内容をVue（JS）で保持しているのみになります。  
そのため、結果ページ表示の方法によって表示/非表示が異なります。  
1. 回答を入力してから結果ページへと遷移する場合  
  → JSで保持された回答内容が表示されます。
2. 結果ページを直接読み込む場合  
  → 回答内容は表示されません。

## Library
### [Vue](https://ja.vuejs.org/guide/introduction.html)

Vueを診断アプリ全体で使用しています。

### [Vuelidate](https://vuelidate-next.netlify.app/)
Version.2  
Vueで使用できるバリデーションプラグインを設問ページ全体で使用しています。  
使用用途：診断ページの回答未入力チェック

### [Chart.js](https://www.chartjs.org/docs/3.7.1/)
Version.3.7.1   
使用用途：結果ページのレーダーチャート生成

## Release History
* 2023/12/5 公開

