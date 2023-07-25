import { slugField } from "../../fields/slugField/slugField";
import { CollectionGroup } from "../../constants";
import { localizedFields } from "../../fields/translatedFields/translatedFields";
import { Contents } from "../Contents/Contents";
import { buildCollectionConfig } from "../../utils/collectionConfig";

const fields = {
  slug: "slug",
  translations: "translations",
  name: "name",
  subfolders: "subfolders",
  contents: "contents",
} as const satisfies Record<string, string>;

export const ContentFolders = buildCollectionConfig(
  {
    singular: "Content Folder",
    plural: "Content Folders",
  },
  ({ slug }) => ({
    defaultSort: fields.slug,
    admin: {
      useAsTitle: fields.slug,
      defaultColumns: [fields.slug, fields.translations],
      disableDuplicate: true,
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
  })
);
