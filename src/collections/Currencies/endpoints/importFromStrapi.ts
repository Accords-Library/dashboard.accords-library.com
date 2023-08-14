import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { Language } from "../../../types/collections";

type StrapiLanguage = {
  code: string;
  name: string;
};

export const importFromStrapi = createStrapiImportEndpoint<Language, StrapiLanguage>({
  strapi: {
    collection: "currencies",
    params: {},
  },
  payload: {
    collection: Collections.Currencies,
    convert: ({ code, name }) => ({ id: code, name }),
  },
});
