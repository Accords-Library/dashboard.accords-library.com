import { LexicalBlock } from "@payloadcms/richtext-lexical";
import { cueBlock } from "./cueBlock";
import { lineBlock } from "./lineBlock";

export const transcriptBlock: LexicalBlock = {
  slug: "transcriptBlock",
  interfaceName: "TranscriptBlock",
  labels: { singular: "Transcript", plural: "Transcripts" },
  fields: [
    {
      name: "lines",
      type: "blocks",
      required: true,
      minRows: 1,
      admin: { initCollapsed: true, className: "no-label" },
      blocks: [lineBlock, cueBlock],
    },
  ],
};
