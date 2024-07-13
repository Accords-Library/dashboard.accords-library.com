import { Block } from "payload/types";
import { rowField } from "src/fields/rowField/rowField";
import { Collections, AttributeTypes } from "src/shared/payload/constants";

export const numberBlock: Block = {
  slug: "numberBlock",
  interfaceName: "NumberBlock",
  labels: { singular: "Number attribute", plural: "Number attributes" },
  fields: [
    rowField([
      {
        name: "name",
        type: "relationship",
        relationTo: Collections.Attributes,
        filterOptions: () => ({ type: { equals: AttributeTypes.Number } }),
        required: true,
      },
      {
        name: "number",
        type: "number",
        required: true,
      },
    ]),
  ],
};
