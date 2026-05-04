import { RecruitSkill, recruitSkillImage } from "@/models/Decision";
import { newResult } from "@/models/Result";
import { newStaff, Staff } from "@/models/Staff";
import { nextTutorial } from "@/presentations/Tutorial";
import { store } from "@/store";

const recruit = (staff: Staff, skill: RecruitSkill) => {
  // チュートリアル中は100%成功する。それ以外は50％。
  let success = nextTutorial.value === "recruit" || Math.random() < 0.5;

  // チュートリアル中なら完了にする
  if (nextTutorial.value === "recruit") {
    store.commit("gameState/doneTutorial", "recruit");
  }

  if (success) {
    // 成功時
    // スタッフを作成
    const new_staff = newStaff({
      name: name(),
      image: recruitSkillImage(skill),
      purchase_skill: skill === "purchase" ? randomHigh() : randomLow(),
      produce_skill: skill === "produce" ? randomHigh() : randomLow(),
      sale_skill: skill === "sale" ? randomHigh() : randomLow(),
      develop_skill: skill === "develop" ? randomHigh() : randomLow(),
      marketing_skill: skill === "marketing" ? randomHigh() : randomLow()
    });

    store.commit("gameState/addStaff", new_staff);

    // 結果を記録
    store.commit(
      "gameState/addResult",
      newResult({
        staff: staff,
        action: "recruit",
        recruit_success: true,
        recruit_staff: new_staff
      })
    );
  } else {
    // 失敗時
    // 結果を記録
    store.commit(
      "gameState/addResult",
      newResult({
        staff: staff,
        action: "recruit",
        recruit_success: false
      })
    );
  }
};

// 既存社員とかぶらない名前をつける
const name = (): string => {
  const dictionary = ["ポン太", "ポン吉", "ポン助", "ポコ太郎", "ポコ次郎", "ポコ道"];
  const existing = store.state.gameState.staffs.map((staff) => staff.name);
  const nominees = dictionary.filter((name) => existing.indexOf(name) === -1);

  return nominees[Math.floor(Math.random() * nominees.length)];
};

// 1〜2 をランダムに返す
const randomLow = () => {
  return Math.ceil(Math.random() * 2);
};

// 3〜5 をランダムに返す
const randomHigh = () => {
  return Math.ceil(Math.random() * 3) + 2;
};

export default recruit;
