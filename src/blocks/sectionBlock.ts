import { Block } from "payload/types";
import { createEditor } from "../utils/editor";
import { transcriptBlock } from "./transcriptBlock";

const generateRecursiveSectionBlock = (depth = 1, maxDepth = 5): Block => ({
  slug: "sectionBlock",
  interfaceName: "SectionBlock",
  labels: { singular: "Section", plural: "Sections" },
  fields: [
    {
      name: "content",
      type: "richText",
      label: false,
      required: true,
      editor: createEditor({
        images: true,
        inlines: true,
        lists: true,
        links: true,
        relations: true,
        alignment: true,
        blocks: [
          transcriptBlock,
          ...(depth < maxDepth ? [generateRecursiveSectionBlock(depth + 1, maxDepth)] : []),
        ],
      }),
    },
  ],
});

export const sectionBlock: Block = generateRecursiveSectionBlock();
