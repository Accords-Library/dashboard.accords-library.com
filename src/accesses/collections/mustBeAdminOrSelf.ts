import { Access } from "payload/config";
import { Recorder } from "../../types/collections";
import { RecordersRoles } from "../../constants";
import { isUndefined } from "../../utils/asserts";

export const mustBeAdminOrSelf: Access = ({ req }) => {
  const user = req.user as Recorder | undefined;
  if (isUndefined(user)) return false;
  if (user.role.includes(RecordersRoles.Admin)) return true;
  return { id: { equals: user.id } };
};
