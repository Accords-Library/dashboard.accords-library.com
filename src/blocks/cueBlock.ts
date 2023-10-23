import { Block } from "payload/types";
import { createEditor } from "../utils/editor";

export const cueBlock: Block = {
  slug: "cueBlock",
  interfaceName: "CueBlock",
  labels: { singular: "Cue", plural: "Cues" },
  fields: [
    {
      name: "content",
      label: false,
      type: "richText",
      required: true,
      admin: {
        className: "reduced-margins",
      },
      editor: createEditor({ inlines: true, lists: true, links: true }),
    },
  ],
};
