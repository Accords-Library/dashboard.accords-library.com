import { BeforeDuplicate } from "payload/types";

export const beforeDuplicatePiping = (hooks: BeforeDuplicate[]): BeforeDuplicate => {
  return (initialArgs: Parameters<BeforeDuplicate>["0"]) =>
    hooks.reduce((data, hook) => hook({ ...initialArgs, data }), initialArgs.data);
};
