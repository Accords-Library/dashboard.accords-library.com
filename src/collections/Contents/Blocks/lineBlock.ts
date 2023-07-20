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
      admin: {
        hideGutter: true,
        elements: [],
        leaves: ["bold", "italic", "underline", "strikethrough", "code"],
      },
    },
  ],
};
