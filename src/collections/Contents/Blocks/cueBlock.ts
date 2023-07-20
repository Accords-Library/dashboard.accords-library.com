import { Block } from "payload/types";

export const cueBlock: Block = {
  slug: "cueBlock",
  interfaceName: "CueBlock",
  labels: { singular: "Cue", plural: "Cues" },
  fields: [
    {
      name: "content",
      label: false,
      type: "textarea",
      required: true,
      admin: {
        description:
          "Parenthesis will automatically be added around cues. You don't have to include them here.",
      },
    },
  ],
};
