import { Block } from "payload/types";
import { BreakBlockType } from "src/shared/payload/constants";

export const breakBlock: Block = {
  slug: "breakBlock",
  interfaceName: "BreakBlock",
  labels: { singular: "Break", plural: "Breaks" },
  fields: [
    {
      name: "type",
      type: "radio",
      required: true,
      defaultValue: BreakBlockType.sceneBreak,
      options: Object.values(BreakBlockType).map((value) => ({
        label: value,
        value: value,
      })),
    },
  ],
};
