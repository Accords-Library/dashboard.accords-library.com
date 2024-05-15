import { LexicalBlock } from "@payloadcms/richtext-lexical";
import { BreakBlockType } from "../constants";

export const breakBlock: LexicalBlock = {
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
