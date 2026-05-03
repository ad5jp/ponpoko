import { Decision } from "@/models/Decision";
import { newResult } from "@/models/Result";
import { Staff } from "@/models/Staff";
import { store } from "@/store";

const purchase = (staff: Staff, purchase_count: number) => {
  const purchasing_count = purchase_count;
  const purchased_count = purchase_count; // TODO ランダムと能力加味
  const purchased_unit_price = store.state.gameState.material_price; // TODO ランダムと能力加味
  const purchased_total_price = purchased_count * purchased_unit_price;

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

const sale = (staff: Staff, sale_price: number) => {
  const sale_unit_price = sale_price;
  const sale_count = store.state.gameState.product; // TODO ランダムと能力と市場加味
  const sale_total_price = sale_unit_price * sale_count;

  store.commit("gameState/decreaseProduct", sale_count);
  store.commit("gameState/increaseCash", sale_total_price);
  store.commit(
    "gameState/addResult",
    newResult({
      staff: staff,
      action: "purchase",
      sale_unit_price: sale_unit_price,
      sale_count: sale_count,
      sale_total_price: sale_total_price
    })
  );
};

const produce = (staff: Staff, produce_count: number) => {
  const producing_count = produce_count;
  const produce_success_count = produce_count; // TODO ランダムと能力加味
  const produce_failure_count = 0; // TODO ランダムと能力加味

  store.commit("gameState/decreaseMaterial", produce_success_count + produce_failure_count);
  store.commit("gameState/increaseProduct", produce_success_count);
  store.commit(
    "gameState/addResult",
    newResult({
      staff: staff,
      action: "purchase",
      producing_count: producing_count,
      produce_success_count: produce_success_count,
      produce_failure_count: produce_failure_count
    })
  );
};

const makeDecisions = (decisions: Decision[]) => {
  store.commit("gameState/clearResults");

  for (let i = 0; i < store.state.gameState.staffs.length; i++) {
    if (decisions[i].action === "purchase") {
      console.log(decisions[i].purchase_count);
      purchase(store.state.gameState.staffs[i], decisions[i]?.purchase_count ?? 1);
    }
    if (decisions[i].action === "sale") {
      sale(store.state.gameState.staffs[i], decisions[i].sale_price ?? 1);
    }
    if (decisions[i].action === "produce") {
      produce(store.state.gameState.staffs[i], decisions[i].produce_count ?? 1);
    }
  }

  // TODO 給与と家賃の支払

  store.commit("gameState/toScene", "result");
};

export default makeDecisions;
