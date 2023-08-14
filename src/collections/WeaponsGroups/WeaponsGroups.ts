import { CollectionGroups, Collections } from "../../constants";
import { backPropagationField } from "../../fields/backPropagationField/backPropagationField";
import { slugField } from "../../fields/slugField/slugField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { buildCollectionConfig } from "../../utils/collectionConfig";

const fields = {
  slug: "slug",
  translations: "translations",
  translationsName: "name",
  subgroupOf: "subgroupOf",
  weapons: "weapons",
};

export const WeaponsGroups = buildCollectionConfig({
  slug: Collections.WeaponsGroups,
  labels: { singular: "Weapons Group", plural: "Weapon Groups" },
  defaultSort: fields.slug,
  admin: {
    useAsTitle: fields.slug,
    defaultColumns: [fields.slug, fields.translations, fields.weapons, fields.subgroupOf],
    group: CollectionGroups.Collections,
  },
  timestamps: false,
  fields: [
    slugField({ name: fields.slug }),
    translatedFields({
      name: fields.translations,
      admin: { useAsTitle: fields.translationsName },
      fields: [{ name: fields.translationsName, type: "text", required: true }],
    }),
    backPropagationField({
      name: fields.weapons,
      relationTo: Collections.Weapons,
      hasMany: true,
      where: ({ id }) => ({ group: { equals: id } }),
    }),
  ],
});
