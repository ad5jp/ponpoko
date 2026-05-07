import { ProduceAttitude } from "@/models/Decision";
import { newResult } from "@/models/Result";
import { Staff } from "@/models/Staff";
import { nextTutorial } from "@/presentations/Tutorial";
import { store } from "@/store";
import { random_int, shake } from "@/utilities/random";

const produce = (staff: Staff, produce_attitude: ProduceAttitude) => {
  // 作れる数（能力に比例・素早く作れば1.5倍・ランダムで±25％）。
  let producing_limit = 3 + staff.produce_skill * 2;
  if (produce_attitude === "speedy") {
    producing_limit = producing_limit * 1.5;
  }
  producing_limit = shake(producing_limit, 25);

  // 作った数（材料の数が最大）
  let producing_count = Math.min(producing_limit, store.state.gameState.material);

  // 不良率（能力に反比例・素早く作れば2倍）。
  let failure_rate = 0;
  failure_rate = random_int(5, 30) - staff.produce_skill * 3;
  if (produce_attitude === "speedy") {
    failure_rate = failure_rate * 2;
  }
  if (failure_rate < 0) {
    failure_rate = 0;
  }

  // 不良品数
  let produce_failure_count = Math.floor(producing_count * (failure_rate / 100));
  let produce_success_count = producing_count - produce_failure_count;

  // チュートリアル中なら10個固定にする
  if (nextTutorial.value === "produce") {
    producing_count = 10;
    produce_failure_count = 0;
    produce_success_count = 10;
  }

  // チュートリアル中なら完了させる
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

export default produce;
