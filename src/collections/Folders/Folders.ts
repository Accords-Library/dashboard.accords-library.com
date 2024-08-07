import { iconField } from "../../fields/iconField/iconField";
import { rowField } from "../../fields/rowField/rowField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { Collections, CollectionGroups } from "../../shared/payload/constants";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { createEditor } from "../../utils/editor";
import { getBySlugEndpoint } from "./endpoints/getBySlugEndpoint";

const fields = {
  slug: "slug",
  translations: "translations",
  translationsName: "name",
  translationsDescription: "description",
  sections: "sections",
  sectionsSubfolders: "subfolders",
  sectionsTranslations: "translations",
  sectionsTranslationsName: "name",
  files: "files",
  icon: "icon",
  parentFolders: "parentFolders",
} as const satisfies Record<string, string>;

export const Folders = buildCollectionConfig({
  slug: Collections.Folders,
  labels: { singular: "Folder", plural: "Folders" },
  admin: {
    useAsTitle: fields.slug,
    group: CollectionGroups.Collections,
    defaultColumns: [
      fields.slug,
      fields.translations,
      fields.parentFolders,
      fields.sections,
      fields.files,
      fields.icon,
    ],
    description:
      "Folders provide a way to structure our content. A folder can contain subfolders and/or files.",
    preview: ({ slug }) => `${process.env.PAYLOAD_PUBLIC_FRONTEND_BASE_URL}/en/folders/${slug}`,
  },
  endpoints: [getBySlugEndpoint],
  fields: [
    rowField([slugField({ name: fields.slug }), iconField({ name: fields.icon })]),
    translatedFields({
      name: fields.translations,
      admin: { useAsTitle: fields.translationsName },
      required: true,
      minRows: 1,
      fields: [
        {
          name: fields.translationsName,
          type: "text",
          required: true,
        },
        {
          name: fields.translationsDescription,
          type: "richText",
          editor: createEditor({ inlines: true, lists: true, links: true }),
        },
      ],
    }),
    {
      name: "sections",
      type: "array",
      fields: [
        translatedFields({
          name: fields.sectionsTranslations,
          admin: {
            useAsTitle: fields.sectionsTranslationsName,
            condition: (data) => data[fields.sections]?.length > 1,
          },
          fields: [
            {
              name: fields.sectionsTranslationsName,
              type: "text",
              required: true,
            },
          ],
        }),
        {
          name: fields.sectionsSubfolders,
          type: "relationship",
          relationTo: Collections.Folders,
          hasMany: true,
        },
      ],
    },
    {
      type: "relationship",
      name: fields.files,
      relationTo: [
        Collections.Collectibles,
        Collections.Pages,
        Collections.Videos,
        Collections.Images,
        Collections.Audios,
        Collections.Files,
      ],
      hasMany: true,
    },
  ],
});
