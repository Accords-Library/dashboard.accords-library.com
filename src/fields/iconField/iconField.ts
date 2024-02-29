import { TextField } from "payload/types";

type Props = Omit<TextField, "type" | "hasMany" | "maxRows" | "minRows">;

export const iconField = (props: Props): TextField => ({
  ...props,
  type: "text",
  admin: {
    description:
      "Select an icon from here: https://icones.js.org/collection/material-symbols. Only outline and regular variants are usable on the website.",
  },
});
