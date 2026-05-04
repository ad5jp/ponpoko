import { marketingMediaName } from "@/models/Decision";
import { store } from "@/store";
import { computed, Ref } from "vue";
import { hasTutorial, nextTutorial } from "./Tutorial";

export type Dialog = {
  image: string | null;
  message: string;
};

export const dialogs: Ref<Dialog[]> = computed(() => {
  const dialogs: Dialog[] = [];

  /**
   * スタート画面用ダイアログ
   */
  if (store.state.gameState.scene === "start") {
    dialogs.push({
      image: null,
      message: "こんにちは！私は秘書のコノハです。"
    });
    dialogs.push({
      image: null,
      message: "あなたは今日から、トンカチ生産会社「ポンポコ商会」の社長になります。"
    });
    dialogs.push({
      image: null,
      message: "えーっと、お名前は確か・・・"
    });
  }

  /**
   * 意思決定画面用ダイアログ
   */
  if (store.state.gameState.scene === "decision") {
    // 初回のみ
    if (store.state.gameState.year === 1 && store.state.gameState.month === 4) {
      dialogs.push({
        image: null,
        message: store.state.gameState.playerName + "社長、よろしくお願いします！"
      });
    }

    // チュートリアル中
    if (hasTutorial.value) {
      if (nextTutorial.value === "purchase") {
        dialogs.push({
          image: null,
          message: store.state.gameState.playerName + "社長、商品を作るには、材料が必要です。"
        });
        dialogs.push({
          image: null,
          message: "今月は、材料を買いましょう！"
        });
      } else if (nextTutorial.value === "produce") {
        dialogs.push({
          image: null,
          message: "材料が手に入ったら商品を作ります。"
        });
        dialogs.push({
          image: null,
          message: "今月は、商品を生産しましょう。"
        });
      } else if (nextTutorial.value === "sale") {
        dialogs.push({
          image: null,
          message: store.state.gameState.playerName + "社長、いよいよ、商品を売りましょう。"
        });
      } else if (nextTutorial.value === "recruit") {
        dialogs.push({
          image: null,
          message: store.state.gameState.playerName + "社長、ひとりで全部やるのは大変ですよね。"
        });
        dialogs.push({
          image: null,
          message: "そろそろ新しいスタッフを採用しましょう。"
        });
      }
    } else {
      dialogs.push({
        image: null,
        message: store.state.gameState.playerName + "社長、" + store.state.gameState.month + "月になりました。"
      });
      // TODO イベント
      dialogs.push({
        image: null,
        message: "今月も頑張りましょう"
      });
    }
  }

  /**
   * 結果画面用ダイアログ
   */
  if (store.state.gameState.scene === "result") {
    store.state.gameState.results.forEach((result) => {
      if (result.action === "purchase") {
        dialogs.push({
          image: result.staff.image,
          message:
            result.staff.name +
            "さんが、" +
            result.purchased_total_price +
            "円で材料を" +
            result.purchased_count +
            "個買いました。"
        });
      }
      if (result.action === "sale") {
        dialogs.push({
          image: result.staff.image,
          message:
            result.staff.name +
            "さんが、" +
            result.sale_total_price +
            "円で商品を" +
            result.sale_count +
            "個売りました。"
        });
      }
      if (result.action === "produce") {
        dialogs.push({
          image: result.staff.image,
          message: result.staff.name + "さんが、商品を" + result.produce_success_count + "個作りました。"
        });
      }
      if (result.action === "develop") {
        if (result.develop_increment > 0) {
          dialogs.push({
            image: result.staff.image,
            message:
              result.staff.name + "さんが、商品を改良しました。商品力が" + result.develop_increment + "上がりました。"
          });
        } else {
          dialogs.push({
            image: result.staff.image,
            message: result.staff.name + "さんが、商品を改良しようとしましたが、上手くいきませんでした。"
          });
        }
      }
      if (result.action === "marketing") {
        dialogs.push({
          image: result.staff.image,
          message:
            result.staff.name +
            "さんが、" +
            marketingMediaName(result.marketing_media) +
            "で宣伝しました。知名度が" +
            result.marketing_increment +
            "上がりました。"
        });
      }
      if (result.action === "recruit") {
        dialogs.push({
          image: result.staff.image,
          message: result.staff.name + "さんが、新しいスタッフを募集しました。"
        });
        if (result.recruit_success) {
          dialogs.push({
            image: result.recruit_staff!.image,
            message: result.recruit_staff!.name + "さんが入社しました！"
          });
        } else {
          dialogs.push({
            image: null,
            message: "残念ながら、応募が来ませんでした。"
          });
        }
      }
    });
  }

  return dialogs;
});
