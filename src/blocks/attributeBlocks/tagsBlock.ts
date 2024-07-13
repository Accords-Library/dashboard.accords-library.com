import { Block } from "payload/types";
import { rowField } from "src/fields/rowField/rowField";
import { Collections, AttributeTypes } from "src/shared/payload/constants";

export const tagsBlock: Block = {
  slug: "tagsBlock",
  interfaceName: "TagsBlock",
  labels: { singular: "Tags attribute", plural: "Tags attributes" },
  fields: [
    rowField([
      {
        name: "name",
        type: "relationship",
        relationTo: Collections.Attributes,
        filterOptions: () => ({ type: { equals: AttributeTypes.Tags } }),
        required: true,
      },
      {
        name: "tags",
        type: "relationship",
        relationTo: Collections.Tags,
        required: true,
        hasMany: true,
        minRows: 1,
      },
    ]),
  ],
};
