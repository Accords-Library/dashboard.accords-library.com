import { Block } from "payload/types";
import { translatedFields } from "../../../fields/translatedFields/translatedFields";
import { Collections } from "../../../shared/payload/constants";

export const collectibleBlock: Block = {
  slug: "collectibleBlock",
  interfaceName: "CollectibleBlock",
  labels: { singular: "Collectible", plural: "Collectibles" },
  fields: [
    {
      name: "collectible",
      type: "relationship",
      hasMany: false,
      required: true,
      relationTo: Collections.Collectibles,
    },
    {
      name: "range",
      type: "blocks",
      maxRows: 1,
      admin: { className: "no-label" },
      blocks: [
        {
          slug: "page",
          labels: { singular: "Page", plural: "Pages" },
          fields: [
            {
              name: "page",
              type: "number",
              required: true,
              admin: {
                description:
                  "Make sure the page range corresponds to the pages as written\
                      on the collectible. You can use negative page numbers if necessary.",
              },
            },
          ],
        },
        {
          slug: "timestamp",
          labels: { singular: "Timestamp", plural: "Timestamps" },
          fields: [
            {
              name: "timestamp",
              type: "text",
              required: true,
              defaultValue: "00:00:00",
              validate: (value) =>
                /\d{2}:\d{2}:\d{2}/g.test(value)
                  ? true
                  : "The format should be hh:mm:ss\
                      (e.g: 01:23:45 for 1 hour, 23 minutes, and 45 seconds)",
              admin: {
                description: "hh:mm:ss (e.g: 01:23:45 for 1 hour, 23 minutes, and 45 seconds)",
              },
            },
          ],
        },
        {
          slug: "other",
          labels: { singular: "Other", plural: "Others" },
          fields: [
            translatedFields({
              admin: { className: "no-label" },
              name: "translations",
              required: true,
              minRows: 1,
              fields: [
                {
                  name: "note",
                  type: "textarea",
                  required: true,
                },
              ],
            }),
          ],
        },
      ],
    },
  ],
};
