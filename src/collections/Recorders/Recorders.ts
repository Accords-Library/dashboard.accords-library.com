import { mustBeAdminOrSelf } from "src/accesses/collections/mustBeAdminOrSelf";
import { QuickFilters } from "src/components/QuickFilters";
import { imageField } from "src/fields/imageField/imageField";
import { rowField } from "src/fields/rowField/rowField";
import { translatedFields } from "src/fields/translatedFields/translatedFields";
import { Collections, CollectionGroups, RecordersRoles } from "src/shared/payload/constants";
import { buildCollectionConfig } from "src/utils/collectionConfig";
import { createEditor } from "src/utils/editor";
import { getByID } from "./endpoints/getByID";
import { importFromStrapi } from "./endpoints/importFromStrapi";
import { beforeLoginMustHaveAtLeastOneRole } from "./hooks/beforeLoginMustHaveAtLeastOneRole";
import { mustBeAdmin as mustBeAdminForCollections } from "src/accesses/collections/mustBeAdmin";
import { mustBeAdmin as mustBeAdminForFields } from "src/accesses/fields/mustBeAdmin";

const fields = {
  username: "username",
  anonymize: "anonymize",
  languages: "languages",
  translations: "translations",
  translationsBiography: "biography",
  avatar: "avatar",
  role: "role",
} as const satisfies Record<string, string>;

export const Recorders = buildCollectionConfig({
  slug: Collections.Recorders,
  labels: {
    singular: "Recorder",
    plural: "Recorders",
  },
  defaultSort: fields.username,
  admin: {
    useAsTitle: fields.username,
    preview: ({ id }) => `${process.env.PAYLOAD_PUBLIC_FRONTEND_BASE_URL}/en/recorders/${id}`,
    description:
      "Recorders are contributors of the Accord's Library project. Ask an admin to create a \
      Recorder here to be able to credit them in other collections.",
    defaultColumns: [
      fields.avatar,
      fields.username,
      fields.anonymize,
      fields.translations,
      fields.languages,
      fields.role,
    ],
    disableDuplicate: true,
    group: CollectionGroups.Meta,
    components: {
      BeforeListTable: [
        () =>
          QuickFilters({
            slug: Collections.Recorders,
            filterGroups: [
              [
                ...Object.values(RecordersRoles).map((value) => ({
                  label: value,
                  filter: { where: { role: { equals: value } } },
                })),
                {
                  label: "∅ Role",
                  filter: { where: { role: { not_in: Object.keys(RecordersRoles).join(",") } } },
                },
              ],
              [{ label: "Anonymized", filter: { where: { anonymize: { equals: true } } } }],
            ],
          }),
      ],
    },
  },
  auth: {
    tokenExpiration: 24 * 60 * 60, // 1 day
    maxLoginAttempts: 5,
    lockTime: 900_000, // 15 minutes
  },
  access: {
    unlock: mustBeAdminForCollections,
    update: mustBeAdminOrSelf,
    delete: mustBeAdminForCollections,
    create: mustBeAdminForCollections,
  },
  hooks: {
    beforeLogin: [beforeLoginMustHaveAtLeastOneRole],
  },
  endpoints: [importFromStrapi, getByID],
  timestamps: false,
  fields: [
    rowField([
      {
        name: fields.username,
        type: "text",
        unique: true,
        required: true,
        admin: { description: "The username must be unique" },
      },
      imageField({
        name: fields.avatar,
        relationTo: Collections.Images,
      }),
    ]),
    {
      name: fields.languages,
      type: "relationship",
      relationTo: Collections.Languages,
      hasMany: true,
      admin: {
        allowCreate: false,
        description: "List of language(s) that this recorder is familiar with",
      },
    },
    translatedFields({
      name: fields.translations,
      fields: [
        {
          name: fields.translationsBiography,
          type: "richText",
          editor: createEditor({ inlines: true, lists: true, links: true }),
          required: true,
        },
      ],
    }),
    {
      name: fields.role,
      type: "select",
      access: {
        update: mustBeAdminForFields,
        create: mustBeAdminForFields,
      },
      hasMany: true,
      options: Object.values(RecordersRoles).map((value) => ({
        label: value,
        value: value,
      })),
    },
    {
      name: fields.anonymize,
      type: "checkbox",
      required: true,
      defaultValue: false,
      admin: {
        description:
          "If enabled, this recorder's username will not be made public. Instead they will be referred to as 'Recorder#0000' where '0000' is a random four digit number",
      },
    },
  ],
});
