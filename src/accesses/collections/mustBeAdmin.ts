import { Access } from "payload/config";
import { RecordersRoles } from "src/shared/payload/constants";
import { Recorder } from "src/types/collections";
import { isUndefined, isDefined } from "src/utils/asserts";

export const mustBeAdmin: Access<unknown, Recorder> = ({ req: { user } }): boolean => {
  if (isUndefined(user)) return false;
  return isDefined(user.role) && user.role.includes(RecordersRoles.Admin);
};
