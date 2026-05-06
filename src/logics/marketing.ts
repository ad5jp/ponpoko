import { MarketingMedia, marketingMediaCost } from "@/models/Decision";
import { newResult } from "@/models/Result";
import { Staff } from "@/models/Staff";
import { store } from "@/store";
import { random_float } from "@/utilities/random";

const marketing = (staff: Staff, media: MarketingMedia) => {
  // 効果（媒体による・ランダム・スキルにより上昇）
  let marketing_increment = 0;
  if (media === "flyer") {
    marketing_increment = Math.round(random_float(1, 2) * (1 + staff.marketing_skill * 0.2));
  } else if (media === "web") {
    marketing_increment = Math.round(random_float(2, 5) * (1 + staff.marketing_skill * 0.2));
  } else if (media === "tv") {
    marketing_increment = Math.round(random_float(6, 8) * (1 + staff.marketing_skill * 0.2));
  }

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

export default marketing;
