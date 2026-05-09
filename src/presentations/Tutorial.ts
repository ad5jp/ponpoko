import { Action } from "@/models/Decision";
import { store } from "@/store";
import { computed, Ref } from "vue";

// チュートリアルの一覧
const tutorials: Action[] = ["purchase", "produce", "sale", "develop", "recruit"];

// チュートリアルが残っているか
export const hasTutorial: Ref<boolean> = computed(() => {
  return store.state.gameState.tutorial.length < tutorials.length;
});

// 次のチュートリアル
export const nextTutorial: Ref<Action | null> = computed(() => {
  if (!hasTutorial.value) {
    return null;
  }

  for (let i = 0; i < tutorials.length; i++) {
    if (!store.state.gameState.tutorial.includes(tutorials[i])) {
      return tutorials[i];
    }
  }

  return null;
});
