import { CollectionConfig } from "payload/types";
import { Collections } from "../../constants";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { createEditor } from "../../utils/editor";

export const Notes: CollectionConfig = buildCollectionConfig({
  slug: Collections.Notes,
  labels: { singular: "Note", plural: "Notes" },
  admin: {
    // TODO: Reenable when we can use rich text as titles  useAsTitle: fields.biography,
  },
  fields: [
    {
      name: "note",
      type: "richText",
      required: true,
      editor: createEditor({ inlines: true, lists: true, links: true }),
    },
  ],
});
