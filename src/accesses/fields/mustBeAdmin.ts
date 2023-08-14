import { FieldAccess } from "payload/types";
import { RecordersRoles } from "../../constants";
import { Recorder } from "../../types/collections";
import { isDefined, isUndefined } from "../../utils/asserts";

export const mustBeAdmin: FieldAccess<any, any, Recorder> = ({ req: { user } }): boolean => {
  if (isUndefined(user)) return false;
  return isDefined(user.role) && user.role.includes(RecordersRoles.Admin);
};
