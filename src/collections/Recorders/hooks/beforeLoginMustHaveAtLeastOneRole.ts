import { BeforeLoginHook } from "payload/dist/collections/config/types";

export const beforeLoginMustHaveAtLeastOneRole: BeforeLoginHook = ({ user }) => {
  if (user.role.length === 0) {
    throw new Error("User is not authorized to log-in.");
  }
};
