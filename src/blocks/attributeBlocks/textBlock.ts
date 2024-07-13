import { Block } from "payload/types";
import { rowField } from "src/fields/rowField/rowField";
import { Collections, AttributeTypes } from "src/shared/payload/constants";

export const textBlock: Block = {
  slug: "textBlock",
  interfaceName: "TextBlock",
  labels: { singular: "Text attribute", plural: "Text attributes" },
  fields: [
    rowField([
      {
        name: "name",
        type: "relationship",
        relationTo: Collections.Attributes,
        filterOptions: () => ({ type: { equals: AttributeTypes.Text } }),
        required: true,
      },
      {
        name: "text",
        type: "textarea",
        required: true,
      },
    ]),
  ],
};
