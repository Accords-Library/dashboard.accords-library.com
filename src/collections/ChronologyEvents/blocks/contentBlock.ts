import { Block } from "payload/types";
import { Collections } from "src/shared/payload/constants";

export const pageBlock: Block = {
  slug: "pageBlock",
  interfaceName: "PageBlock",
  labels: { singular: "Page", plural: "Pages" },
  fields: [
    {
      name: "page",
      type: "relationship",
      hasMany: false,
      required: true,
      relationTo: Collections.Pages,
    },
  ],
};
