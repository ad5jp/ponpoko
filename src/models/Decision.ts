export type Action = "none" | "purchase" | "sale" | "produce" | "develop" | "marketing" | "recruit";

export type MarketingMedia = "flyer" | "web" | "tv";

export function marketingMediaCost(media: MarketingMedia): number {
  switch (media) {
    case "flyer":
      return 20;
    case "web":
      return 40;
    case "tv":
      return 100;
  }
}

export function marketingMediaName(media: MarketingMedia): string {
  switch (media) {
    case "flyer":
      return "チラシ";
    case "web":
      return "ネット広告";
    case "tv":
      return "テレビCM";
  }
}

export type Decision = {
  action: Action;
  purchase_count: number | null;
  sale_price: number | null;
  produce_count: number | null;
  marketing_media: MarketingMedia | null;
};

const defaultDecision = {
  action: "none" as Action,
  purchase_count: null,
  sale_price: null,
  produce_count: null,
  marketing_media: null
};

export function newDecision(params: Partial<Decision>): Decision {
  return {
    ...defaultDecision,
    ...params
  };
}
