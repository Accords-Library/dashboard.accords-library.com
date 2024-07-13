import { icons } from "@iconify-json/material-symbols";
import { TextField } from "payload/types";
import { isEmpty } from "src/utils/asserts";

type Props = Omit<TextField, "type" | "hasMany" | "maxRows" | "minRows">;

const validNames = Object.keys(icons.icons).map((name) => `material-symbols:${name}`);

export const iconField = (props: Props): TextField => ({
  ...props,
  type: "text",
  admin: {
    description:
      "Select an icon from here: https://icones.js.org/collection/material-symbols. Only regular variants are usable on the website.",
  },
  validate: (value) => {
    if (isEmpty(value)) return true;
    if (!validNames.includes(value)) {
      return `The icon "${value}" doesn't exist in material-symbols`;
    }
    return true;
  },
});
