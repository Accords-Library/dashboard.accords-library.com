import { User } from "payload/auth";
import { RecordersRoles } from "src/shared/payload/constants";
import { Recorder } from "src/types/collections";
import { isUndefined, isDefined } from "src/utils/asserts";

export const shownOnlyToAdmin = ({ user }: { user: User }): boolean => {
  if (isUndefined(user)) return false;
  const recorder = user as unknown as Recorder;
  const isAdmin = isDefined(recorder.role) && recorder.role.includes(RecordersRoles.Admin);
  return !isAdmin;
};
