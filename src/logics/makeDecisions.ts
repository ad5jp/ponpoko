import { Decision, MarketingMedia, marketingMediaCost, RecruitSkill } from "@/models/Decision";
import { newResult } from "@/models/Result";
import { Staff } from "@/models/Staff";
import { nextTutorial } from "@/presentations/Tutorial";
import { store } from "@/store";
import purchase from "./purchase";
import recruit from "./recruit";
import produce from "./produce";

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

  const active_staffs = store.state.gameState.staffs;

  for (let i = 0; i < decisions.length; i++) {
    if (decisions[i].action === "purchase") {
      purchase(active_staffs[i], decisions[i]?.purchase_count ?? 1);
    }
    if (decisions[i].action === "sale") {
      sale(active_staffs[i], decisions[i].sale_price ?? 1);
    }
    if (decisions[i].action === "produce") {
      produce(active_staffs[i], decisions[i].produce_attitude ?? "cautiously");
    }
    if (decisions[i].action === "develop") {
      develop(active_staffs[i]);
    }
    if (decisions[i].action === "marketing") {
      marketing(active_staffs[i], decisions[i].marketing_media ?? "flyer");
    }
    if (decisions[i].action === "recruit") {
      recruit(active_staffs[i], decisions[i].recruit_skill ?? "purchase");
    }
  }
};

export default makeDecisions;
