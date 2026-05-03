export type Action = "none" | "purchase" | "sale" | "produce";

export type Decision = {
  action: Action;
  purchase_count: number | null;
  sale_price: number | null;
  produce_count: number | null;
};

const defaultDecision = {
  action: "none" as Action,
  purchase_count: null,
  sale_price: null,
  produce_count: null
};

export function newDecision(params: Partial<Decision>): Decision {
  return {
    ...defaultDecision,
    ...params
  };
}
