import { ArrayField } from "payload/types";

type Props = Omit<ArrayField, "type" | "maxRows" | "minRows">;

export const optionalGroupField = ({
  admin: { className = "", ...otherAdmin } = {},
  ...otherProps
}: Props): ArrayField => ({
  ...otherProps,
  type: "array",
  minRows: 0,
  maxRows: 1,
  admin: { ...otherAdmin, className: `${className} group-array` },
});
