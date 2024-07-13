import { Block } from "payload/types";
import { createEditor } from "src/utils/editor";

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
        className: "reduced-margins",
      },
      editor: createEditor({ inlines: true, lists: true, links: true }),
    },
  ],
};
