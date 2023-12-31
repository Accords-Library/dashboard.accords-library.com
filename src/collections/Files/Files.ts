import { CollectionGroups, Collections, FileTypes } from "../../constants";
import { File } from "../../types/collections";
import { buildCollectionConfig } from "../../utils/collectionConfig";
import {
  beforeValidateCheckFileExists,
  generatePathForFile,
} from "./hooks/beforeValidateCheckFileExists";

const fields = {
  filename: "filename",
  type: "type",
} as const satisfies Record<string, string>;

export const Files = buildCollectionConfig({
  slug: Collections.Files,
  labels: {
    singular: "File",
    plural: "Files",
  },
  defaultSort: fields.filename,
  admin: {
    useAsTitle: fields.filename,
    disableDuplicate: true,
    group: CollectionGroups.Media,
    preview: (doc) => {
      const { filename, type } = doc as unknown as File;
      return generatePathForFile(type, filename);
    },
  },
  hooks: {
    beforeValidate: [beforeValidateCheckFileExists],
  },
  fields: [
    {
      name: fields.filename,
      required: true,
      type: "text",
    },
    {
      name: fields.type,
      type: "select",
      required: true,
      options: Object.entries(FileTypes).map(([value, label]) => ({ label, value })),
    },
  ],
});
