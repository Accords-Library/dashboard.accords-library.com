import { localizedFields } from "../../fields/translatedFields/translatedFields";
import { Languages } from "../Languages/Languages";
import { CollectionGroup, RecordersRoles } from "../../constants";
import { RecorderThumbnails } from "../RecorderThumbnails/RecorderThumbnails";
import { imageField } from "../../fields/imageField/imageField";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import { mustBeAdmin } from "../../accesses/mustBeAdmin";
import { mustBeAdminOrSelf } from "../../accesses/collections/mustBeAdminOrSelf";
import { beforeLoginMustHaveAtLeastOneRole } from "./hooks/beforeLoginMustHaveAtLeastOneRole";
import { QuickFilters } from "../../components/QuickFilters";

const fields = {
  username: "username",
  anonymize: "anonymize",
  languages: "languages",
  biographies: "biographies",
  biography: "biography",
  avatar: "avatar",
  role: "role",
} as const satisfies Record<string, string>;

export const Recorders = buildCollectionConfig(
  {
    singular: "Recorder",
    plural: "Recorders",
  },
  () => ({
    defaultSort: fields.username,
    admin: {
      useAsTitle: fields.username,
      description:
        "Recorders are contributors of the Accord's Library project. Ask an admin to create a \
      Recorder here to be able to credit them in other collections.",
      defaultColumns: [
        fields.username,
        fields.avatar,
        fields.anonymize,
        fields.biographies,
        fields.languages,
        fields.role,
      ],
      disableDuplicate: true,
      group: CollectionGroup.Meta,
      components: {
        BeforeListTable: [
          () =>
            QuickFilters({
              route: "/admin/collections/recorders",
              filters: [
                { label: "Admins", filter: "where[role][equals]=Admin" },
                { label: "Recorders", filter: "where[role][equals]=Recorder" },
                { label: "∅ Role", filter: "where[role][not_in]=Admin,Recorder" },
                { label: "Anonymized", filter: "where[anonymize][equals]=true" },
              ],
            }),
        ],
      },
    },
    auth: true,
    access: {
      unlock: mustBeAdmin,
      update: mustBeAdminOrSelf,
      delete: mustBeAdmin,
      create: mustBeAdmin,
    },
    hooks: {
      beforeLogin: [beforeLoginMustHaveAtLeastOneRole],
    },
    timestamps: false,
    fields: [
      {
        type: "row",
        fields: [
          {
            name: fields.username,
            type: "text",
            unique: true,
            required: true,
            admin: { description: "The username must be unique", width: "33%" },
          },
          imageField({
            name: fields.avatar,
            relationTo: RecorderThumbnails.slug,
            admin: { width: "66%" },
          }),
        ],
      },
      {
        name: fields.languages,
        type: "relationship",
        relationTo: Languages.slug,
        hasMany: true,
        admin: {
          allowCreate: false,
          description: "List of language(s) that this recorder is familiar with",
        },
      },
      localizedFields({
        name: fields.biographies,
        interfaceName: "RecorderBiographies",
        admin: {
          useAsTitle: fields.biography,
          description:
            "A short personal description about you or your involvement with this project or the franchise",
        },
        fields: [{ name: fields.biography, type: "textarea" }],
      }),
      {
        name: fields.role,
        type: "select",
        access: {
          update: mustBeAdmin,
          create: mustBeAdmin,
        },
        hasMany: true,
        options: Object.entries(RecordersRoles).map(([value, label]) => ({
          label,
          value,
        })),
        admin: { position: "sidebar" },
      },
      {
        name: fields.anonymize,
        type: "checkbox",
        required: true,
        defaultValue: false,
        admin: {
          description:
            "If enabled, this recorder's username will not be made public. Instead they will be referred to as 'Recorder#0000' where '0000' is a random four digit number",
          position: "sidebar",
        },
      },
    ],
  })
);
