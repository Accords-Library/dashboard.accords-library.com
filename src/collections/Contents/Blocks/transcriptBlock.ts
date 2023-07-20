import { Block } from "payload/types";
import { lineBlock } from "./lineBlock";
import { cueBlock } from "./cueBlock";

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
      admin: { initCollapsed: true },
      blocks: [lineBlock, cueBlock],
    },
  ],
};
