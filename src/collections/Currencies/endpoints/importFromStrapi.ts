import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { Collections } from "../../../shared/payload/constants";

type StrapiLanguage = {
  code: string;
  name: string;
};

export const importFromStrapi = createStrapiImportEndpoint<StrapiLanguage>({
  strapi: {
    collection: "currencies",
    params: {},
  },
  payload: {
    collection: Collections.Currencies,
    convert: ({ code, name }) => ({ id: code, name }),
  },
});
