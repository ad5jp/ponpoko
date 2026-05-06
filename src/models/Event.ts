export type EventType =
  | "none"
  | "rival_price_down"
  | "rival_price_up"
  | "rival_new_product"
  | "material_price_up"
  | "material_price_down"
  | "product_stolen"
  | "material_burned"
  | "social_media_buzzed";

export type Event = {
  event_type: EventType;
  rival_price_down_amount: number | null;
  rival_price_up_amount: number | null;
  product_stolen_amount: number | null;
  material_burned_amount: number | null;
};

const defaultEvent = {
  event_type: "none" as EventType,
  rival_price_down_amount: null,
  rival_price_up_amount: null,
  product_stolen_amount: null,
  material_burned_amount: null
};

export function newEvent(params: Partial<Event>): Event {
  return {
    ...defaultEvent,
    ...params
  };
}
