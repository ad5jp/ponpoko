import createPersistedState from "vuex-persistedstate";
import { createStore } from "vuex";
import { gameState, GameState } from "@/store/game-state";

// ストアの型をエクスポート
export type RootState = {
  gameState: GameState;
};

export const store = createStore<RootState>({
  modules: {
    gameState
  },
  plugins: [
    createPersistedState({
      key: "ponpoko"
    })
  ]
});
