export type Staff = {
  name: string;
  isChief: boolean;
};

const defaultStaff = {
  name: "",
  isChief: false
};

export function newStaff(params: Partial<Staff>): Staff {
  return {
    ...defaultStaff,
    ...params
  };
}
