[v] スタッフにスキルを持たせる
[ ] スキルアップの実装
[v] 仕入ロジック実装
[v] 生産ロジック実装
[v] 販売ロジック実装
[v] 開発ロジック実装
[v] 宣伝ロジック実装
[v] 採用アクション実装
[ ] 機械購入アクション実装＋生産に反映
[ ] 保険加入アクション実装
[v] ライバル企業実装＋販売に反映

[v] 人件費、家賃実装
[v] 知名度の暫減実装
[v] 月次決算実装
[v] 年次決算実装

[v] オープニング実装
[v] イベント基本実装
[v] 退職イベント実装
[ ] 風評イベント実装
[ ] 材料不足イベント実装

[v] 会社情報ダイアログ実装
[v] スタッフ情報ダイアログ実装
[v] 購買市場ダイアログブラッシュアップ
[v] 試算表ダイアログ実装
[v] チュートリアル実装
[v] 倒産の実装
[v] 任期満了の実装
[ ] 税金の実装

[ ] イージーモードの実装

---

http://localhost/ で見れない原因は、base: "/ponpoko/" を設定したことです。

ビルド済の docs/index.html を見ると、アセット参照が /ponpoko/assets/... になっています：

  <script type="module" crossorigin src="/ponpoko/assets/index-e58149d9.js"></script>
  <link rel="stylesheet" href="/ponpoko/assets/index-e6881273.css">

Apache の DocumentRoot は docs/ なので、ブラウザは http://localhost/ponpoko/assets/...
を要求しますが、サーバー上には /var/www/vue/docs/ponpoko/assets/... というパスは存在しないため 404
になります。

原因まとめ：

- GitHub Pages 用に base: "/ponpoko/" を設定した
- ビルド成果物のアセット参照が /ponpoko/... 絶対パスになった
- ローカルの Apache (http://localhost/) ではルート直下に ponpoko/
  ディレクトリがないため、アセットが解決できない

解決の選択肢（実装はまだしません、調査依頼なので）：

1. ローカル確認は http://localhost/ponpoko/ で見れるよう、Apache 側で /ponpoko/ を /var/www/vue/docs
   にエイリアスする
2. base を環境変数で切り替える（例：mode === 'production' のときだけ /ponpoko/、開発・ローカル Apache
   用は /）
3. ローカル確認は npm run dev（Vite dev サーバー、port 8888 → 8080）に統一する

どう対処しますか？
