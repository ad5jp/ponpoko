import { Result } from "@/models/Result";
import { Staff } from "@/models/Staff";

export type Event = {
  title: string;
  message: string;
};

export type Dialog = {
  image: string | null;
  message: string;
};

export type Scene = "start" | "decision" | "result" | "settlement" | "end";

export type GameState = {
  // ゲーム状態
  playerName: string;
  scene: Scene;
  mode: "easy" | "normal" | "real";
  year: number;
  month: number;
  // 会社情報
  cash: number;
  material: number;
  product: number;
  staffs: Staff[];
  // 市場情報
  material_price: number;
  // 結果情報
  event: Event | null;
  results: Result[];
};

export type NewGameParam = {
  playerName: string;
  mode: "easy" | "normal" | "real";
};

export const gameState = {
  namespaced: true,
  state: {
    playerName: "ぽん",
    scene: "start",
    mode: "easy"
  },
  mutations: {
    // ゲーム状態
    startNewGame: (state: GameState, param: NewGameParam) => {
      state.playerName = param.playerName;
      state.mode = param.mode;
      state.scene = "decision";
      state.year = 1;
      state.month = 4;
      state.cash = 500;
      state.material = 0;
      state.product = 0;
      state.staffs = [
        {
          name: param.playerName,
          isChief: true
        },
        {
          name: "ポン吉",
          isChief: false
        }
      ];
      state.material_price = 10;
      state.event = null;
      state.results = [];
    },
    toScene: (state: GameState, scene: Scene) => {
      state.scene = scene;
    },
    nextMonth: (state: GameState) => {
      state.month++;
      if (state.month === 13) {
        state.month = 1;
      }
      if (state.month === 4) {
        state.year++;
      }
    },
    // 会社情報
    increaseCash: (state: GameState, count: number) => {
      state.cash += count;
    },
    decreaseCash: (state: GameState, count: number) => {
      state.cash -= count;
    },
    increaseMaterial: (state: GameState, count: number) => {
      state.material += count;
    },
    decreaseMaterial: (state: GameState, count: number) => {
      state.material -= count;
    },
    increaseProduct: (state: GameState, count: number) => {
      state.product += count;
    },
    decreaseProduct: (state: GameState, count: number) => {
      state.product -= count;
    },
    // 市場情報
    // 結果情報
    clearResults: (state: GameState) => {
      state.results = [];
    },
    addResult: (state: GameState, result: Result) => {
      state.results.push(result);
    }
  },
  getters: {
    dialogs(state: GameState) {
      const dialogs: Dialog[] = [];

      if (state.scene === "decision") {
        dialogs.push({
          image: null,
          message: state.playerName + "さん、" + state.month + "月になりました。"
        });
        dialogs.push({
          image: null,
          message: "今月も頑張りましょう"
        });
      }

      return dialogs;
    }
  }
};
