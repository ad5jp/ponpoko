import { newResult } from "@/models/Result";
import { Staff } from "@/models/Staff";
import { nextTutorial } from "@/presentations/Tutorial";
import { store } from "@/store";
import { rate } from "@/utilities/random";

const purchase = (staff: Staff, purchasing_count: number) => {
  // 仕入可能数。仕入スキルに比例（ランダムで±25％）。
  const purchasable_count = rate(5 + staff.purchase_skill * 5, 0.75, 1.25);
  // 実際に買えた数（買おうとした数と仕入可能数の低い方）
  const purchased_count = Math.min(purchasing_count, purchasable_count);

  // ベース単価
  const base_unit_price = store.state.gameState.material_price;
  // ボリュームによる値下げ
  const volume_discount = Math.round(Math.log10(purchased_count) * Math.random());
  // スキルによる値下げ
  const skill_discount = Math.round((staff.purchase_skill / 5) * Math.random());
  // 実際に買った単価
  const purchased_unit_price = base_unit_price - volume_discount - skill_discount;

  // 総額
  const purchased_total_price = purchased_count * purchased_unit_price;

  if (nextTutorial.value === "purchase") {
    store.commit("gameState/doneTutorial", "purchase");
  }

  store.commit("gameState/increaseMaterial", purchased_count);
  store.commit("gameState/decreaseCash", purchased_total_price);
  store.commit(
    "gameState/addResult",
    newResult({
      staff: staff,
      action: "purchase",
      purchasing_count: purchasing_count,
      purchased_count: purchased_count,
      purchased_unit_price: purchased_unit_price,
      purchased_total_price: purchased_total_price
    })
  );
};

export default purchase;
