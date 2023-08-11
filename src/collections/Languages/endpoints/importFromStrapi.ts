import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { Language } from "../../../types/collections";

export const importFromStrapi = createStrapiImportEndpoint<Language>({
  strapi: {
    collection: "languages",
    params: {},
  },
  payload: {
    collection: Collections.Languages,
    convert: ({ code, name }) => ({ id: code, name }),
  },
});
