import { Recorder } from "../../types/collections";
import { isUndefined } from "../../utils/asserts";

export const mustHaveAtLeastOneRole = ({ req }): boolean => {
  const user = req.user as Recorder | undefined;
  if (isUndefined(user)) return false;
  return user.role.length > 0;
};
