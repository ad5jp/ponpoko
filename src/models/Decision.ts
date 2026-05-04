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

export type RecruitSkill = "purchase" | "produce" | "sale" | "develop" | "marketing";

export function recruitSkillImage(media: RecruitSkill): string {
  switch (media) {
    case "purchase":
      return "chara02";
    case "produce":
      return "chara03";
    case "sale":
      return "chara04";
    case "develop":
      return "chara05";
    case "marketing":
      return "chara06";
  }
}

export type Decision = {
  action: Action;
  purchase_count: number | null;
  sale_price: number | null;
  produce_count: number | null;
  marketing_media: MarketingMedia | null;
  recruit_skill: RecruitSkill;
};

const defaultDecision = {
  action: "none" as Action,
  purchase_count: null,
  sale_price: null,
  produce_count: null,
  marketing_media: null,
  recruit_skill: "purchase" as RecruitSkill
};

export function newDecision(params: Partial<Decision>): Decision {
  return {
    ...defaultDecision,
    ...params
  };
}
