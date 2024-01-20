import { CollectionGroups, Collections } from "../../constants";
import { rowField } from "../../fields/rowField/rowField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { buildCollectionConfig } from "../../utils/collectionConfig";

const fields = {
  slug: "slug",
  translations: "translations",
  translationsName: "name",
  sections: "sections",
  sectionsSubfolders: "subfolders",
  sectionsName: "name",
  files: "files",
} as const satisfies Record<string, string>;

export const Folders = buildCollectionConfig({
  slug: Collections.Folders,
  labels: { singular: "Folder", plural: "Folders" },
  admin: {
    useAsTitle: fields.slug,
    group: CollectionGroups.Collections,
  },
  fields: [
    slugField({ name: fields.slug }),
    translatedFields({
      name: fields.translations,
      fields: [
        {
          name: fields.translationsName,
          type: "text",
          required: true,
        },
      ],
    }),
    {
      name: "sections",
      type: "array",
      fields: [
        rowField([
          {
            name: fields.sectionsName,
            type: "text",
            admin: {
              condition: (data) => data[fields.sections]?.length > 1,
            },
          },
          {
            name: fields.sectionsSubfolders,
            type: "relationship",
            relationTo: Collections.Folders,
            hasMany: true,
          },
        ]),
      ],
    },
    {
      type: "relationship",
      name: fields.files,
      relationTo: [Collections.LibraryItems, Collections.Contents],
      hasMany: true,
    },
  ],
});
