import { marketingMediaName } from "@/models/Decision";
import { store } from "@/store";
import { computed, Ref } from "vue";
import { hasTutorial, nextTutorial } from "./Tutorial";
import { ordinary_income } from "@/logics/settle";

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
      message: "あなたは今日から、「ポンポコ商会」の社長になります。"
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
        image: "chara00-joyful",
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

      // イベント
      if (store.state.gameState.events.length > 0) {
        store.state.gameState.events.forEach((event) => {
          if (event.event_type === "rival_price_down") {
            dialogs.push({
              image: "chara00-surprised",
              message: "カチカチ工業が商品の値段を " + event.rival_price_down_amount + "ドングリ 下げたようです。"
            });
            dialogs.push({
              image: "chara00-surprised",
              message: "我が社も販売価格を見直さなければいけないかもしれません。"
            });
          } else if (event.event_type === "rival_price_up") {
            dialogs.push({
              image: "chara00-surprised",
              message: "カチカチ工業が商品の値段を " + event.rival_price_up_amount + "ドングリ 上げたようです。"
            });
            dialogs.push({
              image: "chara00-surprised",
              message: "商品を売るチャンスです！"
            });
          } else if (event.event_type === "rival_new_product") {
            dialogs.push({
              image: "chara00-surprised",
              message: "カチカチ工業が新商品を発売したようです。"
            });
            dialogs.push({
              image: "chara00-surprised",
              message: "我が社も商品や、販売価格を見直さなければいけないかもしれません。"
            });
          } else if (event.event_type === "material_price_up") {
            dialogs.push({
              image: "chara00-sad",
              message: "材料の仕入れ価格が上がりました。"
            });
            if (store.state.gameState.material_price > 12) {
              dialogs.push({
                image: "chara00-sad",
                message: "まとめ買いして、材料費を安く抑えたいですね。"
              });
            }
          } else if (event.event_type === "material_price_down") {
            dialogs.push({
              image: "chara00-joyful",
              message: "材料の仕入れ価格が下がりました。"
            });
            if (store.state.gameState.material_price < 11) {
              dialogs.push({
                image: "chara00-joyful",
                message: "材料を安く仕入れるチャンスです！"
              });
            }
          } else if (event.event_type === "product_stolen") {
            dialogs.push({
              image: "chara00-sad",
              message: "商品倉庫にどろぼうが入ったようです。"
            });
            dialogs.push({
              image: "chara00-sad",
              message: `商品を${event.product_stolen_amount}個盗まれてしまいました。`
            });
          } else if (event.event_type === "material_burned") {
            dialogs.push({
              image: "chara00-sad",
              message: "材料倉庫で火事が起こりました。"
            });
            dialogs.push({
              image: "chara00-sad",
              message: `材料が${event.material_burned_amount}個燃えてしまいました。`
            });
          } else if (event.event_type === "social_media_buzzed") {
            dialogs.push({
              image: "chara00-joyful",
              message: "SNSで我が社の商品が話題になっているようです！"
            });
            dialogs.push({
              image: "chara00-joyful",
              message: "知名度が上がりました。商品をたくさん販売するチャンスです！"
            });
          }
        });
      }

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
          message: `${result.staff.name}さんが、材料を1個 ${result.purchased_unit_price} ドングリで ${result.purchased_count} 個買いました（合計 ${result.purchased_total_price} ドングリ）。`
        });
      }
      if (result.action === "sale") {
        dialogs.push({
          image: result.staff.image,
          message: `${result.staff.name}さんが、商品を1個 ${result.sale_unit_price} ドングリで ${result.sale_count} 個売りました（合計 ${result.sale_total_price} ドングリ）。`
        });
        if (result.sale_price_advantage > 3) {
          dialogs.push({
            image: result.staff.image,
            message: "ライバル商品に比べ、とてもお得感があるようです。"
          });
        } else if (result.sale_price_advantage > 0) {
          dialogs.push({
            image: result.staff.image,
            message: "ライバルに商品比べ、ややお得感があるようです。"
          });
        } else if (result.sale_price_advantage < -3) {
          dialogs.push({
            image: result.staff.image,
            message: "ライバル商品の方が、とてもお得感があるようです。"
          });
        } else if (result.sale_price_advantage < 0) {
          dialogs.push({
            image: result.staff.image,
            message: "ライバル商品の方が、ややお得感があるようです。"
          });
        }
      }
      if (result.action === "produce") {
        dialogs.push({
          image: result.staff.image,
          message: result.staff.name + "さんが、商品を" + result.producing_count + "個作りました。"
        });
        if (result.produce_failure_count) {
          dialogs.push({
            image: result.staff.image,
            message: result.produce_failure_count + "個は不良品でした。"
          });
        }
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

  /**
   * 決算画面用ダイアログ
   */
  if (store.state.gameState.scene === "settlement") {
    dialogs.push({
      image: null,
      message: store.state.gameState.playerName + "社長、おつかれさまです！"
    });
    dialogs.push({
      image: null,
      message: store.state.gameState.year + "年目が終わりました。"
    });
    const income = ordinary_income(store.state.gameState.yearly_settlement);
    if (income >= 100) {
      dialogs.push({
        image: "chara00-joyful",
        message: "今年は、" + income + "ドングリの黒字になりました！"
      });
    } else if (income >= 0) {
      dialogs.push({
        image: null,
        message: "今年は、" + income + "ドングリの黒字になりました。"
      });
    } else {
      dialogs.push({
        image: null,
        message: "今年は、" + income * -1 + "ドングリの赤字になってしまいました・・・"
      });
    }
    dialogs.push({
      image: null,
      message: "来年も頑張りましょう。"
    });
  }

  return dialogs;
});
