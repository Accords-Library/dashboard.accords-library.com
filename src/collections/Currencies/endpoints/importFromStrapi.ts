import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { Language } from "../../../types/collections";

export const importFromStrapi = createStrapiImportEndpoint<Language>({
  strapi: {
    collection: "currencies",
    params: {},
  },
  payload: {
    collection: Collections.Currencies,
    convert: ({ code, name }) => ({ id: code, name }),
  },
});
