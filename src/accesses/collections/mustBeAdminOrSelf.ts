import { Access } from "payload/config";
import { RecordersRoles } from "../../constants";
import { Recorder } from "../../types/collections";
import { isUndefined } from "../../utils/asserts";

export const mustBeAdminOrSelf: Access<unknown, Recorder> = ({ req: { user } }) => {
  if (isUndefined(user)) return false;
  if (user.role?.includes(RecordersRoles.Admin)) return true;
  return { id: { equals: user.id } };
};
