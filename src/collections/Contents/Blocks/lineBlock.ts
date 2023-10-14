import { Block } from "payload/types";

export const lineBlock: Block = {
  slug: "lineBlock",
  interfaceName: "LineBlock",
  labels: { singular: "Line", plural: "Lines" },
  fields: [
    {
      name: "content",
      label: false,
      type: "richText",
      required: true,
    },
  ],
};
