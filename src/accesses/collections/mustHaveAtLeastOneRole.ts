import { Access } from "payload/config";
import { Recorder } from "../../types/collections";
import { isDefined, isUndefined } from "../../utils/asserts";

export const mustHaveAtLeastOneRole: Access<unknown, Recorder> = ({ req: { user } }): boolean => {
  if (isUndefined(user)) return false;
  return isDefined(user.role) && user.role.length > 0;
};
