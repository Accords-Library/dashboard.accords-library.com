import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { Language } from "../../../types/collections";

type StrapiLanguage = {
  name: string;
  code: string;
};

export const importFromStrapi = createStrapiImportEndpoint<Language, StrapiLanguage>({
  strapi: {
    collection: "languages",
    params: {},
  },
  payload: {
    collection: Collections.Languages,
    convert: ({ code, name }) => ({ id: code, name }),
  },
});
