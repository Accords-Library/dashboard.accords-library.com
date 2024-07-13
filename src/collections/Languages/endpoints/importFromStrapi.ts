import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { Collections } from "../../../shared/payload/constants";

type StrapiLanguage = {
  name: string;
  code: string;
};

export const importFromStrapi = createStrapiImportEndpoint<StrapiLanguage>({
  strapi: {
    collection: "languages",
    params: {},
  },
  payload: {
    collection: Collections.Languages,
    convert: ({ code, name }) => ({ id: code, name }),
  },
});
