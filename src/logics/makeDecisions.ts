import { Decision, MarketingMedia, marketingMediaCost, RecruitSkill } from "@/models/Decision";
import { newResult } from "@/models/Result";
import { Staff } from "@/models/Staff";
import { store } from "@/store";
import purchase from "./purchase";
import recruit from "./recruit";
import produce from "./produce";
import sale from "./sale";
import develop from "./develop";

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
