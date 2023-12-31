import { CollectionGroups, Collections } from "../../constants";
import { backPropagationField } from "../../fields/backPropagationField/backPropagationField";
import { rowField } from "../../fields/rowField/rowField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { createEditor } from "../../utils/editor";

const fields = {
  slug: "slug",
  translations: "translations",
  name: "name",
  description: "description",
  subfolders: "subfolders",
  items: "items",
  parentFolders: "parentFolders",
} as const satisfies Record<string, string>;

export const LibraryFolders = buildCollectionConfig({
  slug: Collections.LibraryFolders,
  labels: {
    singular: "Library Folder",
    plural: "Library Folders",
  },
  defaultSort: fields.slug,
  admin: {
    useAsTitle: fields.slug,
    defaultColumns: [fields.slug, fields.translations],
    disableDuplicate: true,
    group: CollectionGroups.Collections,
  },
  timestamps: false,
  versions: false,
  fields: [
    slugField({ name: fields.slug }),
    translatedFields({
      name: fields.translations,
      admin: {
        useAsTitle: fields.name,
      },
      fields: [
        { name: fields.name, type: "text", required: true },
        {
          name: fields.description,
          type: "richText",
          editor: createEditor({ inlines: true, lists: true, links: true }),
        },
      ],
    }),
    rowField([
      backPropagationField({
        name: fields.parentFolders,
        relationTo: Collections.LibraryFolders,
        hasMany: true,
        where: ({ id }) => ({ [fields.subfolders]: { equals: id } }),
      }),
      {
        type: "relationship",
        name: fields.subfolders,
        relationTo: Collections.LibraryFolders,
        hasMany: true,
      },
      {
        type: "relationship",
        name: fields.items,
        relationTo: Collections.LibraryItems,
        hasMany: true,
      },
    ]),
  ],
});
