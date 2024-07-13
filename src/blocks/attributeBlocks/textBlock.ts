import { Block } from "payload/types";
import { rowField } from "../../fields/rowField/rowField";
import { AttributeTypes, Collections } from "../../shared/payload/constants";

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
