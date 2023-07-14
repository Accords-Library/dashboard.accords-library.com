import { CollectionConfig } from "payload/types";
import { localizedFields } from "../../elements/translatedFields/translatedFields";
import { Languages } from "../Languages";
import { Images } from "../Images/Images";
import { ImageCell } from "../Images/components/ImageCell";
import { beforeDuplicate } from "./hooks/beforeDuplicate";

const fields = {
  username: "username",
  anonymize: "anonymize",
  languages: "languages",
  biographies: "biographies",
  biography: "biography",
  avatar: "avatar",
} as const satisfies Record<string, string>;

const labels = {
  singular: "Recorder",
  plural: "Recorders",
} as const satisfies { singular: string; plural: string };

export const Recorders: CollectionConfig = {
  slug: labels.plural,
  labels,
  typescript: { interface: labels.singular },
  defaultSort: fields.username,
  admin: {
    useAsTitle: fields.username,
    hooks: { beforeDuplicate },
    description:
      "Recorders are contributors of the Accord's Library project. Create a Recorder here to be able to credit them in other collections",
    defaultColumns: [fields.username, fields.anonymize, fields.biographies, fields.languages],
  },
  timestamps: false,
  fields: [
    {
      type: "row",
      fields: [
        {
          name: fields.avatar,
          type: "upload",
          relationTo: Images.slug,
          admin: {
            components: {
              Cell: ImageCell,
            },
          },
        },
        {
          name: fields.username,
          type: "text",
          unique: true,
          required: true,
          admin: { description: "The username must be unique" },
        },
        {
          name: fields.anonymize,
          type: "checkbox",
          required: true,
          defaultValue: false,
          admin: {
            width: "50%",
            description:
              "If enabled, this recorder's username will not be made public. Instead they will be referred to as 'Recorder#0000' where '0000' is a random four digit number",
          },
        },
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
  ],
};
