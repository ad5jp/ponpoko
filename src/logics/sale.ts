import { newResult } from "@/models/Result";
import { Staff } from "@/models/Staff";
import { nextTutorial } from "@/presentations/Tutorial";
import { store } from "@/store";
import { random_int, shake } from "@/utilities/random";

const sale = (staff: Staff, sale_unit_price: number) => {
  // 自社の実効販売価格（商品力が高いほど、同じ値段でも安く感じる）
  const effective_price = sale_unit_price - store.state.gameState.strength * 3;
  // ライバルの実効販売価格（商品力が高いほど、同じ値段でも安く感じる）
  const rival_effective_price = store.state.gameState.rival_price - store.state.gameState.rival_strength * 3;
  // 価格差（価格有利であればプラス）
  let price_advantage = rival_effective_price - effective_price;
  console.log(effective_price, rival_effective_price, price_advantage);

  // 最大販売可能数（能力と知名度に比例）
  let salable_count = shake(3 + staff.sale_skill * 3 + store.state.gameState.popularity * 3, 25);
  // 価格差を加味する
  if (price_advantage > 0) {
    const price_advantage_rate = 10 + price_advantage * price_advantage * 2;
    salable_count = Math.round(salable_count * ((100 + price_advantage_rate) / 100));
  } else if (price_advantage < 0) {
    const price_disadvantage_rate = 20 + price_advantage * price_advantage * 2;
    salable_count = Math.round(salable_count * ((100 - price_disadvantage_rate) / 100));
    if (salable_count < 0) {
      const minimum_sale = Math.ceil(staff.sale_skill * 0.3);
      salable_count = random_int(0, minimum_sale);
    }
  }

  // チュートリアル中なら10個固定にする
  if (nextTutorial.value === "sale") {
    salable_count = 10;
    price_advantage = 0;
  }

  const sale_count = Math.min(salable_count, store.state.gameState.product);
  const sale_total_price = sale_unit_price * sale_count;

  // チュートリアル中なら完了にする
  if (nextTutorial.value === "sale") {
    store.commit("gameState/doneTutorial", "sale");
  }

  store.commit("gameState/decreaseProduct", sale_count);
  store.commit("gameState/increaseCash", sale_total_price);
  store.commit(
    "gameState/addResult",
    newResult({
      staff: staff,
      action: "sale",
      sale_unit_price: sale_unit_price,
      sale_count: sale_count,
      sale_total_price: sale_total_price,
      sale_price_advantage: price_advantage
    })
  );
};

export default sale;
