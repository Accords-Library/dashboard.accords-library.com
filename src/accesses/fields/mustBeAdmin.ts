import { FieldAccess } from "payload/types";
import { Recorder } from "../../types/collections";
import { isDefined, isUndefined } from "../../utils/asserts";
import { RecordersRoles } from "../../shared/payload/constants";

export const mustBeAdmin: FieldAccess<any, any, Recorder> = ({ req: { user } }): boolean => {
  if (isUndefined(user)) return false;
  return isDefined(user.role) && user.role.includes(RecordersRoles.Admin);
};
