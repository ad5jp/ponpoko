import { newSettlement, Settlement } from "@/logics/settle";
import { Action } from "@/models/Decision";
import { Event } from "@/models/Event";
import { Result } from "@/models/Result";
import { Staff } from "@/models/Staff";

export type Scene = "start" | "decision" | "result" | "settlement" | "game_over" | "finish";

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
  rival_price: number;
  rival_strength: number;
  rival_popularity: number;
  // 結果情報
  events: Event[];
  results: Result[];
  monthly_settlement: Settlement;
  yearly_settlement: Settlement;
  // その他
  sale_price: number;
  purchase_count: number;
  last_staff_code: number;
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
  getters: {
    wholeMonths: (state: GameState) => {
      return (state.year - 1) * 12 + (state.month < 4 ? state.month + 9 : state.month - 3);
    }
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
          code: 1,
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
      state.rival_price = 36;
      state.rival_strength = 3;
      state.rival_popularity = 2;
      state.events = [];
      state.results = [];
      state.monthly_settlement = newSettlement({});
      state.yearly_settlement = newSettlement({});
      state.sale_price = 35;
      state.purchase_count = 10;
      state.last_staff_code = 1;
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
    removeStaff: (state: GameState, staff: Staff) => {
      state.staffs = state.staffs.filter((row) => row.code !== staff.code);
    },
    // 市場情報
    increaseMaterialPrice: (state: GameState, count: number) => {
      state.material_price += count;
    },
    decreaseMaterialPrice: (state: GameState, count: number) => {
      state.material_price -= count;
    },
    increaseRivalPrice: (state: GameState, count: number) => {
      state.rival_price += count;
    },
    decreaseRivalPrice: (state: GameState, count: number) => {
      state.rival_price -= count;
    },
    increaseRivalStrength: (state: GameState, count: number) => {
      state.rival_strength += count;
    },
    decreaseRivalStrength: (state: GameState, count: number) => {
      state.rival_strength -= count;
    },
    // 結果情報
    clearResults: (state: GameState) => {
      state.results = [];
    },
    addResult: (state: GameState, result: Result) => {
      state.results.push(result);
    },
    clearEvents: (state: GameState) => {
      state.events = [];
    },
    addEvent: (state: GameState, event: Event) => {
      state.events.push(event);
    },
    setMonthlySettlement: (state: GameState, settlement: Settlement) => {
      state.monthly_settlement = settlement;
    },
    setYearlySettlement: (state: GameState, settlement: Settlement) => {
      state.yearly_settlement = settlement;
    },
    // その他
    setSalePrice: (state: GameState, price: number) => {
      state.sale_price = price;
    },
    setPurchaseCount: (state: GameState, count: number) => {
      state.purchase_count = count;
    },
    setLastStaffCode: (state: GameState, code: number) => {
      state.last_staff_code = code;
    }
  }
};
