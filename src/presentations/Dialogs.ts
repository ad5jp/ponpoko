import { marketingMediaName } from "@/models/Decision";
import { store } from "@/store";
import { computed, Ref } from "vue";

export type Dialog = {
  image: string | null;
  message: string;
};

export const dialogs: Ref<Dialog[]> = computed(() => {
  const dialogs: Dialog[] = [];

  if (store.state.gameState.scene === "decision") {
    dialogs.push({
      image: null,
      message: store.state.gameState.playerName + "さん、" + store.state.gameState.month + "月になりました。"
    });
    // TODO イベント
    dialogs.push({
      image: null,
      message: "今月も頑張りましょう"
    });
  }

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
    });
  }

  return dialogs;
});
