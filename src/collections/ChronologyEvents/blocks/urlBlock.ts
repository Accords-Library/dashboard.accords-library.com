import { Block } from "payload/types";

export const urlBlock: Block = {
  slug: "urlBlock",
  interfaceName: "UrlBlock",
  labels: { singular: "URL", plural: "URLs" },
  fields: [{ name: "url", type: "text", required: true }],
};
