import { CollectionGroups, Collections } from "../../constants";
import { iconField } from "../../fields/iconField/iconField";
import { imageField } from "../../fields/imageField/imageField";
import { rowField } from "../../fields/rowField/rowField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { createEditor } from "../../utils/editor";
import { getBySlugEndpoint } from "./endpoints/getBySlugEndpoint";
import { getRootFoldersEndpoint } from "./endpoints/rootEndpoint";

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
  darkThumbnail: "darkThumbnail",
  lightThumbnail: "lightThumbnail",
  icon: "icon",
} as const satisfies Record<string, string>;

export const Folders = buildCollectionConfig({
  slug: Collections.Folders,
  labels: { singular: "Folder", plural: "Folders" },
  admin: {
    useAsTitle: fields.slug,
    group: CollectionGroups.Collections,
  },
  endpoints: [getRootFoldersEndpoint, getBySlugEndpoint],
  fields: [
    rowField([slugField({ name: fields.slug }), iconField({ name: fields.icon })]),
    rowField([
      imageField({ name: fields.lightThumbnail, relationTo: Collections.FoldersThumbnails }),
      imageField({ name: fields.darkThumbnail, relationTo: Collections.FoldersThumbnails }),
    ]),
    translatedFields({
      name: fields.translations,
      admin: { useAsTitle: fields.translationsName },
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
      relationTo: [Collections.LibraryItems, Collections.Contents, Collections.Pages],
      hasMany: true,
    },
  ],
});
