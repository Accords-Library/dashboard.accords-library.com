import { createImageSizesRegenerationEndpoint } from "../../endpoints/imageSizesRegenerationEndpoint";
import { attributesField } from "../../fields/attributesField/attributesField";
import { creditsField } from "../../fields/creditsField/creditsField";
import { rowField } from "../../fields/rowField/rowField";
import { translatedFields } from "../../fields/translatedFields/translatedFields";
import { Collections } from "../../shared/payload/constants";
import { createEditor } from "../../utils/editor";
import {
  buildImageCollectionConfig,
  generateOpenGraphSize,
  generateWebpSize,
} from "../../utils/imageCollectionConfig";
import { getByID } from "./endpoints/getByID";

const fields = {
  filename: "filename",
  mimeType: "mimeType",
  filesize: "filesize",
  posts: "posts",
  updatedAt: "updatedAt",
  translations: "translations",
  translationsPretitle: "pretitle",
  translationsTitle: "title",
  translationsSubtitle: "subtitle",
  translationsDescription: "description",
  attributes: "attributes",
  credits: "credits",
} as const satisfies Record<string, string>;

export const Images = buildImageCollectionConfig({
  slug: Collections.Images,
  labels: {
    singular: "Image",
    plural: "Images",
  },
  admin: {
    preview: ({ id }) => `${process.env.PAYLOAD_PUBLIC_FRONTEND_BASE_URL}/en/images/${id}`,
    defaultColumns: [fields.filename, fields.posts, fields.updatedAt],
  },
  upload: {
    imageSizes: [
      generateOpenGraphSize(),
      generateWebpSize(200, 60),
      generateWebpSize(320, 60),
      generateWebpSize(480, 70),
      generateWebpSize(800, 70),
      generateWebpSize(1280, 85),
      generateWebpSize(1920, 85),
      generateWebpSize(2560, 90),
    ],
  },
  endpoints: [getByID, createImageSizesRegenerationEndpoint(Collections.Images)],
  fields: [
    translatedFields({
      name: fields.translations,
      admin: { useAsTitle: fields.translationsTitle },
      fields: [
        rowField([
          { name: fields.translationsPretitle, type: "text" },
          { name: fields.translationsTitle, type: "text", required: true },
          { name: fields.translationsSubtitle, type: "text" },
        ]),
        {
          name: fields.translationsDescription,
          type: "richText",
          editor: createEditor({ inlines: true, lists: true, links: true }),
        },
      ],
    }),
    attributesField({ name: fields.attributes }),
    creditsField({ name: fields.credits }),
  ],
});
