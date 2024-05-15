import { BlockField } from "payload/dist/fields/config/types";
import { numberBlock } from "../../blocks/attributeBlocks/numberBlock";
import { tagsBlock } from "../../blocks/attributeBlocks/tagsBlock";
import { textBlock } from "../../blocks/attributeBlocks/textBlock";

type AttributesFieldProps = Omit<BlockField, "type" | "blocks">;

export const attributesField = ({ ...props }: AttributesFieldProps): BlockField => ({
  ...props,
  type: "blocks",
  blocks: [tagsBlock, numberBlock, textBlock],
});
