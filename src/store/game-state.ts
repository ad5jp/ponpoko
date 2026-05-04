import { Action } from "@/models/Decision";
import { Result } from "@/models/Result";
import { Staff } from "@/models/Staff";

export type Event = {
  title: string;
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
  tutorial: Array<Action>;
  // 会社情報
  cash: number;
  material: number;
  product: number;
  strength: number;
  popularity: number;
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
      state.tutorial = [];
      state.cash = 500;
      state.material = 0;
      state.product = 0;
      state.strength = 1;
      state.popularity = 1;
      state.staffs = [
        {
          name: param.playerName,
          image: "chara01",
          isChief: true,
          purchase_skill: 3,
          produce_skill: 3,
          sale_skill: 3,
          develop_skill: 3,
          marketing_skill: 3
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
    doneTutorial: (state: GameState, tutorial: Action) => {
      state.tutorial.push(tutorial);
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
    increaseStrength: (state: GameState, count: number) => {
      state.strength += count;
    },
    decreaseStrength: (state: GameState, count: number) => {
      state.strength -= count;
    },
    increasePopularity: (state: GameState, count: number) => {
      state.popularity += count;
    },
    decreasePopularity: (state: GameState, count: number) => {
      state.popularity -= count;
    },
    addStaff: (state: GameState, staff: Staff) => {
      state.staffs.push(staff);
    },
    // 市場情報
    // 結果情報
    clearResults: (state: GameState) => {
      state.results = [];
    },
    addResult: (state: GameState, result: Result) => {
      state.results.push(result);
    }
  }
};
