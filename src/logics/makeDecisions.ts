import { Decision, MarketingMedia, marketingMediaCost } from "@/models/Decision";
import { newResult } from "@/models/Result";
import { Staff } from "@/models/Staff";
import { nextTutorial } from "@/presentations/Tutorial";
import { store } from "@/store";

const purchase = (staff: Staff, purchase_count: number) => {
  const purchasing_count = purchase_count;
  const purchased_count = purchase_count; // TODO ランダムと能力加味
  const purchased_unit_price = store.state.gameState.material_price; // TODO ランダムと能力加味
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

const sale = (staff: Staff, sale_price: number) => {
  const sale_unit_price = sale_price;
  const sale_count = store.state.gameState.product; // TODO ランダムと能力と市場加味
  const sale_total_price = sale_unit_price * sale_count;

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
      sale_total_price: sale_total_price
    })
  );
};

const produce = (staff: Staff, produce_count: number) => {
  const producing_count = produce_count;
  const produce_success_count = produce_count; // TODO ランダムと能力加味
  const produce_failure_count = 0; // TODO ランダムと能力加味

  if (nextTutorial.value === "produce") {
    store.commit("gameState/doneTutorial", "produce");
  }

  store.commit("gameState/decreaseMaterial", produce_success_count + produce_failure_count);
  store.commit("gameState/increaseProduct", produce_success_count);
  store.commit(
    "gameState/addResult",
    newResult({
      staff: staff,
      action: "produce",
      producing_count: producing_count,
      produce_success_count: produce_success_count,
      produce_failure_count: produce_failure_count
    })
  );
};

const develop = (staff: Staff) => {
  const develop_increment = 1; // TODO ランダムと現在地と能力加味

  store.commit("gameState/increaseStrength", develop_increment);
  store.commit(
    "gameState/addResult",
    newResult({
      staff: staff,
      action: "develop",
      develop_increment: develop_increment
    })
  );
};

const marketing = (staff: Staff, media: MarketingMedia) => {
  const marketing_increment = marketingMediaCost(media) / 10; // TODO ランダムと現在地と能力加味
  const marketing_price = marketingMediaCost(media);

  store.commit("gameState/increasePopularity", marketing_increment);
  store.commit("gameState/decreaseCash", marketing_price);
  store.commit(
    "gameState/addResult",
    newResult({
      staff: staff,
      action: "marketing",
      marketing_media: media,
      marketing_increment: marketing_increment,
      marketing_price: marketing_price
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
    if (decisions[i].action === "develop") {
      develop(store.state.gameState.staffs[i]);
    }
    if (decisions[i].action === "marketing") {
      marketing(store.state.gameState.staffs[i], decisions[i].marketing_media ?? "flyer");
    }
  }
};

export default makeDecisions;
