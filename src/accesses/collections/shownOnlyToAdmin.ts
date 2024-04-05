import { User } from "payload/auth";
import { RecordersRoles } from "../../constants";
import { Recorder } from "../../types/collections";
import { isDefined, isUndefined } from "../../utils/asserts";

export const shownOnlyToAdmin = ({ user }: { user: User }): boolean => {
  if (isUndefined(user)) return false;
  const recorder = user as unknown as Recorder;
  const isAdmin = isDefined(recorder.role) && recorder.role.includes(RecordersRoles.Admin);
  return !isAdmin;
};
