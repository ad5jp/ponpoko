import { newResult } from "@/models/Result";
import { Staff } from "@/models/Staff";
import { nextTutorial } from "@/presentations/Tutorial";
import { store } from "@/store";
import { chance } from "@/utilities/random";

const develop = (staff: Staff) => {
  // 成功率（現在の商品力が高いほど低い。能力が高いほど高い）
  let rate = (40 - store.state.gameState.strength * 4) * (1 + staff.develop_skill * 0.2);

  // チュートリアル中なら100%
  if (nextTutorial.value === "develop") {
    rate = 100;
  }
  // チュートリアル中なら完了させる
  if (nextTutorial.value === "develop") {
    store.commit("gameState/doneTutorial", "develop");
  }

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
