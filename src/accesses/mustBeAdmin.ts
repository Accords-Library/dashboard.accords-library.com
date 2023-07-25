import { Recorder } from "../types/collections";
import { RecordersRoles } from "../constants";
import { isUndefined } from "../utils/asserts";

export const mustBeAdmin = ({ req }): boolean => {
  const user = req.user as Recorder | undefined;
  if (isUndefined(user)) return false;
  return user.role.includes(RecordersRoles.Admin);
};
