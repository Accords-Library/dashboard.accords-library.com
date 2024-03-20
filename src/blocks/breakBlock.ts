import { Block } from "payload/types";
import { BreakBlockType } from "../constants";

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
      options: Object.entries(BreakBlockType).map(([_, value]) => ({
        label: value,
        value: value,
      })),
    },
  ],
};