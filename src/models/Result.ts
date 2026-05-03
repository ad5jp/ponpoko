import { Action } from "./Decision";
import { newStaff, Staff } from "./Staff";

export type Result = {
  staff: Staff;
  action: Action;
  purchasing_count: number;
  purchased_count: number;
  purchased_unit_price: number;
  purchased_total_price: number;
  sale_unit_price: number;
  sale_count: number;
  sale_total_price: number;
  producing_count: number;
  produce_success_count: number;
  produce_failure_count: number;
};

const defaultResult = {
  staff: newStaff({}),
  action: "purchase" as Action,
  purchasing_count: 0,
  purchased_count: 0,
  purchased_unit_price: 0,
  purchased_total_price: 0,
  sale_unit_price: 0,
  sale_count: 0,
  sale_total_price: 0,
  producing_count: 0,
  produce_success_count: 0,
  produce_failure_count: 0
};

export function newResult(params: Partial<Result>): Result {
  return {
    ...defaultResult,
    ...params
  };
}
