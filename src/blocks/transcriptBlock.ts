import { Block } from "payload/types";
import { cueBlock } from "./cueBlock";
import { lineBlock } from "./lineBlock";

export const transcriptBlock: Block = {
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
