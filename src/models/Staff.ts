export type StaffImage = "chara01" | "chara02" | "chara03" | "chara04" | "chara05" | "chara06";

export type Staff = {
  code: number;
  name: string;
  image: string;
  isChief: boolean;
  purchase_skill: number;
  produce_skill: number;
  sale_skill: number;
  develop_skill: number;
  marketing_skill: number;
};

const defaultStaff = {
  code: 0,
  name: "",
  image: "chara01",
  isChief: false,
  purchase_skill: 1,
  produce_skill: 1,
  sale_skill: 1,
  develop_skill: 1,
  marketing_skill: 1
};

export function newStaff(params: Partial<Staff>): Staff {
  return {
    ...defaultStaff,
    ...params
  };
}
