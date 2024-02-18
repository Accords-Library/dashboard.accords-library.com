import { TextField } from "payload/types";

type Props = Omit<TextField, "type" | "hasMany" | "maxRows" | "minRows">;

export const iconField = (props: Props): TextField => ({
  ...props,
  type: "text",
});
