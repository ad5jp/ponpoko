import { store } from "@/store";

export type Settlement = {
  // ヘッダ
  year: number;
  month: number;
  // 資産
  cash: number; // 現金
  material: number; // 原材料
  material_count: number; // 原材料（数）
  product: number; // 製品
  product_count: number; // 製品（数）
  // 収益
  sales: number; // 売上髙
  // 売上原価
  sales_cost: number; // 売上原価
  // 販管費
  purchase: number; // 仕入髙（使わない）
  advertising: number; // 宣伝広告費
  labor_cost: number; // 人件費
  rent: number; // 地代家賃
  special_expense: number; // 特別損失
};

const defaultSettlement = {
  // ヘッダ
  year: 1,
  month: 4,
  // 資産
  cash: 0, // 現金
  material: 0, // 原材料
  material_count: 0, // 原材料（数）
  product: 0, // 製品
  product_count: 0, // 製品（数）
  // 収益
  sales: 0, // 売上髙
  // 売上原価
  sales_cost: 0, // 売上原価
  // 販管費
  purchase: 0, // 仕入髙（使わない）
  advertising: 0, // 宣伝広告費
  labor_cost: 0, // 人件費
  rent: 0, // 地代家賃
  special_expense: 0 // 特別損失
};

export function newSettlement(params: Partial<Settlement>): Settlement {
  return {
    ...defaultSettlement,
    ...params
  };
}

export function settleMonthly() {
  // ヘッダ
  const year = store.state.gameState.year;
  const month = store.state.gameState.month;
  // 資産
  let cash = store.state.gameState.cash; // 現金
  let material = store.state.gameState.monthly_settlement.material; // 原材料
  let material_count = store.state.gameState.monthly_settlement.material_count; // 原材料（数）
  let product = store.state.gameState.monthly_settlement.product; // 製品
  let product_count = store.state.gameState.monthly_settlement.product_count; // 製品（数）
  // 収益
  let sales = 0; // 売上髙
  // 売上原価
  let sales_cost = 0; // 売上原価
  // 販管費
  let purchase = 0; // 仕入髙（使わない）
  let advertising = 0; // 宣伝広告費
  let labor_cost = 0; // 人件費
  let rent = 0; // 地代家賃
  let special_expense = 0; // 特別損失

  // 人件費を発生させる
  const unit_labor_cost = 30;
  labor_cost = store.state.gameState.staffs.length * unit_labor_cost;
  cash -= labor_cost;
  store.commit("gameState/decreaseCash", labor_cost);

  // 家賃を発生させる
  rent = 40;
  cash -= rent;
  store.commit("gameState/decreaseCash", rent);

  // イベントの計算
  store.state.gameState.events.forEach((event) => {
    if (event.event_type === "product_stolen") {
      // 商品盗難・・・商品を減らし、特損を増やす
      const stolen_product_cost = Math.round((product / product_count) * (event.product_stolen_amount ?? 0));
      product -= stolen_product_cost;
      product_count -= event.product_stolen_amount ?? 0;
      special_expense += stolen_product_cost;
    } else if (event.event_type === "material_burned") {
      // 材料火災・・・材料を減らし、特損を増やす
      const burned_material_cost = Math.round((material / material_count) * (event.material_burned_amount ?? 0));
      product -= burned_material_cost;
      product_count -= event.material_burned_amount ?? 0;
      special_expense += burned_material_cost;
    }
  });

  // 結果の計算
  store.state.gameState.results.forEach((result) => {
    if (result.action === "purchase") {
      // 購買・・・原材料を増やす
      material += result.purchased_total_price;
      material_count += result.purchased_count;
    } else if (result.action === "produce") {
      // 生産・・・原材料を増やし、商品を増やす。製造分の人件費も製造原価に組み入れる
      const producing_material_cost = Math.round((material / material_count) * result.producing_count);
      material -= producing_material_cost;
      material_count -= result.producing_count;
      product += producing_material_cost + unit_labor_cost;
      product_count += result.produce_success_count;
      labor_cost -= unit_labor_cost;
    } else if (result.action === "sale") {
      // 販売・・・売上を増やし、商品を売上原価に振り返る。
      const selling_product_cost = Math.round((product / product_count) * result.sale_count);
      sales += result.sale_total_price;
      product -= selling_product_cost;
      product_count -= result.sale_count;
      sales_cost += selling_product_cost;
    } else if (result.action === "marketing") {
      advertising += result.marketing_price;
    }
  });

  // 保存
  store.commit("gameState/setMonthlySettlement", {
    year,
    month,
    cash,
    material,
    material_count,
    product,
    product_count,
    sales,
    sales_cost,
    purchase,
    advertising,
    labor_cost,
    rent,
    special_expense
  });

  store.commit("gameState/setYearlySettlement", {
    year,
    month,
    cash,
    material,
    material_count,
    product,
    product_count,
    sales: store.state.gameState.yearly_settlement.sales + sales,
    sales_cost: store.state.gameState.yearly_settlement.sales_cost + sales_cost,
    purchase: store.state.gameState.yearly_settlement.purchase + purchase,
    advertising: store.state.gameState.yearly_settlement.advertising + advertising,
    labor_cost: store.state.gameState.yearly_settlement.labor_cost + labor_cost,
    rent: store.state.gameState.yearly_settlement.rent + rent,
    special_expense: store.state.gameState.yearly_settlement.special_expense + special_expense
  });
}

// 粗利
export const gross_profit = (settlement: Settlement) => {
  return settlement.sales - settlement.sales_cost;
};

// 販管費
export const general_expense = (settlement: Settlement) => {
  return settlement.advertising + settlement.labor_cost + settlement.rent;
};

// 営業利益
export const operating_income = (settlement: Settlement) => {
  return gross_profit(settlement) - general_expense(settlement);
};

// 経常利益
export const ordinary_income = (settlement: Settlement) => {
  return operating_income(settlement) - settlement.special_expense;
};

// 純資産
export const net_assets = (settlement: Settlement) => {
  return settlement.cash + settlement.product + settlement.material;
};
