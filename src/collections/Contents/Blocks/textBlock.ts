import { Block } from "payload/types";

export const textBlock: Block = {
  slug: "textBlock",
  interfaceName: "TextBlock",
  labels: { singular: "Text", plural: "Texts" },
  fields: [
    {
      name: "content",
      type: "richText",
      label: false,
      required: true,
      admin: {
        hideGutter: true,
        elements: ["ul", "ol", "indent", "link", "relationship", "upload", "blockquote"],
      },
    },
  ],
};
