import { Block } from "payload/types";
import { SpacerSizes } from "../constants";

export const spacerBlock: Block = {
  slug: "spacerBlock",
  interfaceName: "SpacerBlock",
  labels: { singular: "Spacer", plural: "Spacers" },
  fields: [
    {
      name: "size",
      type: "radio",
      defaultValue: "medium",
      required: true,
      options: Object.entries(SpacerSizes).map(([value, label]) => ({
        label,
        value,
      })),
    },
  ],
};
