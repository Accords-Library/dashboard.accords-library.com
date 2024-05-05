import { LexicalBlock } from "@payloadcms/richtext-lexical";
import { createEditor } from "../utils/editor";
import { breakBlock } from "./breakBlock";
import { transcriptBlock } from "./transcriptBlock";

const generateRecursiveSectionBlock = (depth = 1, maxDepth = 5): LexicalBlock => ({
  slug: "sectionBlock",
  interfaceName: "SectionBlock",
  labels: { singular: "Section", plural: "Sections" },
  fields: [
    {
      name: "content",
      type: "richText",
      label: false,
      required: true,
      admin: {
        className: "section-reduced-margins",
      },
      editor: createEditor({
        images: true,
        inlines: true,
        lists: true,
        links: true,
        relations: true,
        alignment: true,
        blocks: [
          ...(depth < maxDepth ? [generateRecursiveSectionBlock(depth + 1, maxDepth)] : []),
          transcriptBlock,
          breakBlock,
        ],
      }),
    },
  ],
});

export const sectionBlock: LexicalBlock = generateRecursiveSectionBlock();
