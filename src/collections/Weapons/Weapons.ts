import { RowLabelArgs } from "payload/dist/admin/components/forms/RowLabel/types";
import { CollectionGroups, Collections, KeysTypes } from "../../constants";
import { imageField } from "../../fields/imageField/imageField";
import { keysField } from "../../fields/keysField/keysField";
import { rowField } from "../../fields/rowField/rowField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { createEditor } from "../../utils/editor";
import { buildVersionedCollectionConfig } from "../../utils/versionedCollectionConfig";
import { AppearanceRowLabel } from "./components/AppearanceRowLabel";
import { getBySlugEndpoint } from "./endpoints/getBySlugEndpoint";
import { importFromStrapi } from "./endpoints/importFromStrapi";

const fields = {
  slug: "slug",
  thumbnail: "thumbnail",
  type: "type",
  group: "group",
  appearances: "appearances",
  appearancesCategories: "categories",
  appearancesTranslations: "translations",
  appearancesTranslationsName: "name",
  appearancesTranslationsDescription: "description",
  appearancesTranslationsLevel1: "level1",
  appearancesTranslationsLevel2: "level2",
  appearancesTranslationsLevel3: "level3",
  appearancesTranslationsLevel4: "level4",
  status: "_status",
};

export const Weapons = buildVersionedCollectionConfig({
  slug: Collections.Weapons,
  labels: { singular: "Weapon", plural: "Weapons" },
  defaultSort: fields.slug,
  admin: {
    useAsTitle: fields.slug,
    defaultColumns: [
      fields.thumbnail,
      fields.slug,
      fields.group,
      fields.type,
      fields.appearances,
      fields.status,
    ],
    group: CollectionGroups.Collections,
  },
  endpoints: [importFromStrapi, getBySlugEndpoint],
  fields: [
    rowField([
      slugField({ name: fields.slug }),
      imageField({
        name: fields.thumbnail,
        relationTo: Collections.WeaponsThumbnails,
      }),
    ]),
    rowField([
      keysField({
        name: fields.type,
        relationTo: KeysTypes.Weapons,
        required: true,
      }),
      {
        name: fields.group,
        type: "relationship",
        relationTo: Collections.WeaponsGroups,
      },
    ]),
    {
      name: fields.appearances,
      type: "array",
      required: true,
      minRows: 1,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: ({ data }: RowLabelArgs) =>
            AppearanceRowLabel({ keyIds: data[fields.appearancesCategories] ?? [] }),
        },
      },
      fields: [
        keysField({
          name: fields.appearancesCategories,
          required: true,
          hasMany: true,
          relationTo: KeysTypes.Categories,
        }),
        translatedFields({
          name: fields.appearancesTranslations,
          required: true,
          minRows: 1,
          admin: {
            useAsTitle: fields.appearancesTranslationsName,
            hasSourceLanguage: true,
            hasCredits: true,
          },
          fields: [
            rowField([
              {
                name: fields.appearancesTranslationsName,
                type: "text",
                required: true,
              },
              {
                name: fields.appearancesTranslationsDescription,
                type: "richText",
                editor: createEditor({ inlines: true }),
              },
            ]),
            rowField([
              {
                name: fields.appearancesTranslationsLevel1,
                label: "Level 1",
                type: "richText",
                editor: createEditor({ inlines: true }),
              },
              {
                name: fields.appearancesTranslationsLevel2,
                label: "Level 2",
                type: "richText",
                editor: createEditor({ inlines: true }),
              },
            ]),
            rowField([
              {
                name: fields.appearancesTranslationsLevel3,
                label: "Level 3",
                type: "richText",
                editor: createEditor({ inlines: true }),
              },
              {
                name: fields.appearancesTranslationsLevel4,
                label: "Level 4",
                type: "richText",
                editor: createEditor({ inlines: true }),
              },
            ]),
          ],
        }),
      ],
    },
  ],
});
