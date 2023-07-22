import { Block } from "payload/types";

export const quoteBlock: Block = {
  slug: "quoteBlock",
  interfaceName: "QuoteBlock",
  labels: { singular: "Quote", plural: "Quotes" },
  fields: [
    {
      name: "from",
      type: "text",
      required: true,
    },
    {
      name: "content",
      type: "richText",
      label: false,
      required: true,
      admin: {
        hideGutter: true,
        elements: [],
      },
    },
  ],
};
