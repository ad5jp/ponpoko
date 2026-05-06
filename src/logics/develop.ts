import { newResult } from "@/models/Result";
import { Staff } from "@/models/Staff";
import { store } from "@/store";
import { chance } from "@/utilities/random";

const develop = (staff: Staff) => {
  // 成功率（現在の商品力が高いほど低い。能力が高いほど高い）
  const rate = (40 - store.state.gameState.strength * 4) * (1 + staff.develop_skill * 0.2);

  if (chance(rate)) {
    store.commit("gameState/increaseStrength", 1);
    store.commit(
      "gameState/addResult",
      newResult({
        staff: staff,
        action: "develop",
        develop_increment: 1
      })
    );
  } else {
    store.commit(
      "gameState/addResult",
      newResult({
        staff: staff,
        action: "develop",
        develop_increment: 0
      })
    );
  }
};

export default develop;
