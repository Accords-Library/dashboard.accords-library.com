import { Access } from "payload/config";
import { RecordersRoles } from "src/shared/payload/constants";
import { Recorder } from "src/types/collections";
import { isUndefined } from "src/utils/asserts";

export const mustBeAdminOrSelf: Access<unknown, Recorder> = ({ req: { user } }) => {
  if (isUndefined(user)) return false;
  if (user.role?.includes(RecordersRoles.Admin)) return true;
  return { id: { equals: user.id } };
};
