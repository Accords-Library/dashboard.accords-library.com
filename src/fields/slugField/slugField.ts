import { TextField } from "payload/types";
import { isUndefined } from "../../utils/asserts";

type Props = Omit<TextField, "type" | "hasMany" | "minRows" | "maxRows">;

const validateSlug = (value?: string) => {
  if (isUndefined(value) || value === "") return "This field is required.";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) return "This is not a valid slug.";
  return true;
};

export const slugField = ({ admin, ...otherProps }: Props): TextField => ({
  ...otherProps,
  type: "text",
  required: true,
  unique: true,
  index: true,
  validate: validateSlug,
  admin: {
    description:
      "A slug must only include lowercase letters and digits. Instead of spaces you can use dashes.",
    ...admin,
  },
});
