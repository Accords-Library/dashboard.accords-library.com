import { BeforeDuplicate } from "payload/types";

export const beforeDuplicatePiping = (hooks: BeforeDuplicate[]): BeforeDuplicate => {
  return ({ data: initialData }) => hooks.reduce((data, hook) => hook({ data }), initialData);
};
