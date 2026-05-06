import { Decision, MarketingMedia, marketingMediaCost, RecruitSkill } from "@/models/Decision";
import { store } from "@/store";
import purchase from "./purchase";
import recruit from "./recruit";
import produce from "./produce";
import sale from "./sale";
import develop from "./develop";
import marketing from "./marketing";

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
