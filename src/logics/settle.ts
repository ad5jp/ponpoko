import { store } from "@/store";

export type Settlement = {
  sales: number; // 売上髙
  purchase: number; // 仕入髙
  advertising: number; // 宣伝広告費
  labor_cost: number; // 人件費
  rent: number; // 地代家賃
};

const defaultSettlement = {
  sales: 0,
  purchase: 0,
  advertising: 0,
  labor_cost: 0,
  rent: 0
};

export function newSettlement(params: Partial<Settlement>): Settlement {
  return {
    ...defaultSettlement,
    ...params
  };
}

export function settleMonthly() {
  // 人件費を発生させる
  let labor_cost = store.state.gameState.staffs.length * 20;
  store.commit("gameState/decreaseCash", labor_cost);

  // 家賃を発生させる
  let rent = 20;
  store.commit("gameState/decreaseCash", rent);

  // 結果の計算
  let sales = 0;
  let purchase = 0;
  let advertising = 0;
  store.state.gameState.results.forEach((result) => {
    if (result.action === "purchase") {
      purchase += result.purchased_total_price;
    } else if (result.action === "sale") {
      sales += result.sale_total_price;
    } else if (result.action === "marketing") {
      advertising += result.marketing_price;
    }
  });

  // 保存
  store.commit("gameState/setMonthlySettlement", {
    sales,
    purchase,
    advertising,
    labor_cost,
    rent
  });

  store.commit("gameState/setYearlySettlement", {
    sales: store.state.gameState.yearly_settlement.sales + sales,
    purchase: store.state.gameState.yearly_settlement.purchase + purchase,
    advertising: store.state.gameState.yearly_settlement.advertising + advertising,
    labor_cost: store.state.gameState.yearly_settlement.labor_cost + labor_cost,
    rent: store.state.gameState.yearly_settlement.rent + rent
  });
}
