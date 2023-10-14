import { RowLabelArgs } from "payload/dist/admin/components/forms/RowLabel/types";
import { CollectionGroups, Collections, KeysTypes } from "../../constants";
import { imageField } from "../../fields/imageField/imageField";
import { keysField } from "../../fields/keysField/keysField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
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
    {
      type: "row",
      fields: [
        slugField({ name: fields.slug, admin: { width: "0%" } }),
        imageField({
          name: fields.thumbnail,
          relationTo: Collections.WeaponsThumbnails,
          admin: { width: "0%" },
        }),
      ],
    },
    {
      type: "row",
      fields: [
        keysField({
          name: fields.type,
          relationTo: KeysTypes.Weapons,
          required: true,
          admin: { allowCreate: false, width: "0%" },
        }),
        {
          name: fields.group,
          type: "relationship",
          relationTo: Collections.WeaponsGroups,
          admin: { width: "0%" },
        },
      ],
    },
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
          admin: { allowCreate: false },
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
            {
              type: "row",
              fields: [
                {
                  name: fields.appearancesTranslationsName,
                  type: "text",
                  required: true,
                  admin: { width: "0%" },
                },
                {
                  name: fields.appearancesTranslationsDescription,
                  type: "textarea",
                  admin: { width: "0%" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: fields.appearancesTranslationsLevel1,
                  label: "Level 1",
                  type: "textarea",
                  admin: { width: "0%" },
                },
                {
                  name: fields.appearancesTranslationsLevel2,
                  label: "Level 2",
                  type: "textarea",
                  admin: { width: "0%" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: fields.appearancesTranslationsLevel3,
                  label: "Level 3",
                  type: "textarea",
                  admin: { width: "0%" },
                },
                {
                  name: fields.appearancesTranslationsLevel4,
                  label: "Level 4",
                  type: "textarea",
                  admin: { width: "0%" },
                },
              ],
            },
          ],
        }),
      ],
    },
  ],
});
