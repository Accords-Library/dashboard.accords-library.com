import { CollectionConfig } from "payload/types";
import { slugField } from "../../fields/slugField/slugField";
import { CollectionGroup, KeysTypes } from "../../constants";
import { localizedFields } from "../../fields/translatedFields/translatedFields";
import { collectionSlug } from "../../utils/string";
import { Contents } from "../Contents/Contents";

const fields = {
  slug: "slug",
  translations: "translations",
  name: "name",
  subfolders: "subfolders",
  contents: "contents",
} as const satisfies Record<string, string>;

const labels = {
  singular: "Content Folder",
  plural: "Content Folders",
} as const satisfies { singular: string; plural: string };

const slug = collectionSlug(labels.plural);

export const ContentFolders: CollectionConfig = {
  slug,
  labels,
  typescript: { interface: labels.singular },
  defaultSort: fields.slug,
  admin: {
    useAsTitle: fields.slug,
    defaultColumns: [fields.slug, fields.translations],
    group: CollectionGroup.Collections,
  },
  timestamps: false,
  versions: false,
  fields: [
    slugField({ name: fields.slug }),
    localizedFields({
      name: fields.translations,
      interfaceName: "ContentFoldersTranslation",
      admin: {
        useAsTitle: fields.name,
      },
      fields: [{ name: fields.name, type: "text", required: true }],
    }),
    {
      type: "row",
      fields: [
        {
          type: "relationship",
          name: fields.subfolders,
          relationTo: [slug],
          hasMany: true,
          admin: { width: "50%" },
        },
        {
          type: "relationship",
          name: fields.contents,
          relationTo: [Contents.slug],
          hasMany: true,
          admin: { width: "50%" },
        },
      ],
    },
  ],
};
