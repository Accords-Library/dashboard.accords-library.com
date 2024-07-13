import { BlockField } from "payload/dist/fields/config/types";
import { numberBlock } from "src/blocks/attributeBlocks/numberBlock";
import { tagsBlock } from "src/blocks/attributeBlocks/tagsBlock";
import { textBlock } from "src/blocks/attributeBlocks/textBlock";

type AttributesFieldProps = Omit<BlockField, "type" | "blocks">;

export const attributesField = ({ ...props }: AttributesFieldProps): BlockField => ({
  ...props,
  admin: {
    description: "The order is important. Try to place the most relevant tags first.",
  },
  type: "blocks",
  blocks: [tagsBlock, numberBlock, textBlock],
});
