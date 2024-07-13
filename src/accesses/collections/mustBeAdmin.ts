import { Access } from "payload/config";
import { Recorder } from "../../types/collections";
import { isDefined, isUndefined } from "../../utils/asserts";
import { RecordersRoles } from "../../shared/payload/constants";

export const mustBeAdmin: Access<unknown, Recorder> = ({ req: { user } }): boolean => {
  if (isUndefined(user)) return false;
  return isDefined(user.role) && user.role.includes(RecordersRoles.Admin);
};
