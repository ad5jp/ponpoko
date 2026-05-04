export type StaffImage = "chara01" | "chara02";

export type Staff = {
  name: string;
  image: string;
  isChief: boolean;
};

const defaultStaff = {
  name: "",
  image: "chara01",
  isChief: false
};

export function newStaff(params: Partial<Staff>): Staff {
  return {
    ...defaultStaff,
    ...params
  };
}
