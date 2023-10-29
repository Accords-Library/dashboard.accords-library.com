import { CollectionGroups, Collections } from "../../constants";
import { rowField } from "../../fields/rowField/rowField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { importFromStrapi } from "./endpoints/importFromStrapi";

const fields = {
  slug: "slug",
  translations: "translations",
  name: "name",
  subfolders: "subfolders",
  contents: "contents",
} as const satisfies Record<string, string>;

export const ContentsFolders = buildCollectionConfig({
  slug: Collections.ContentsFolders,
  labels: {
    singular: "Contents Folder",
    plural: "Contents Folders",
  },
  defaultSort: fields.slug,
  admin: {
    useAsTitle: fields.slug,
    defaultColumns: [fields.slug, fields.translations],
    disableDuplicate: true,
    group: CollectionGroups.Collections,
  },
  endpoints: [importFromStrapi],
  timestamps: false,
  versions: false,
  fields: [
    slugField({ name: fields.slug }),
    translatedFields({
      name: fields.translations,
      admin: {
        useAsTitle: fields.name,
      },
      fields: [{ name: fields.name, type: "text", required: true }],
    }),
    rowField([
      {
        type: "relationship",
        name: fields.subfolders,
        relationTo: Collections.ContentsFolders,
        hasMany: true,
      },
      {
        type: "relationship",
        name: fields.contents,
        relationTo: Collections.Contents,
        hasMany: true,
      },
    ]),
  ],
});
