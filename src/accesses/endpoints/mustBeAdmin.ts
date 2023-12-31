import { RecordersRoles } from "../../constants";
import { Recorder } from "../../types/collections";
import { EndpointAccess } from "../../types/payload";
import { isDefined, isUndefined } from "../../utils/asserts";

export const mustBeAdmin: EndpointAccess<Recorder> = ({ user }) => {
  if (isUndefined(user)) return false;
  return isDefined(user.role) && user.role.includes(RecordersRoles.Admin);
};
