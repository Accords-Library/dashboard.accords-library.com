import payload from "payload";
import { Collections } from "../../../constants";
import { createStrapiImportEndpoint } from "../../../endpoints/createStrapiImportEndpoint";
import { findContent } from "../../../utils/localApi";

type StrapiContent = {
  slug: string;
  next_contents: { data: { attributes: { slug: string } }[] };
};

export const importRelationsFromStrapi = createStrapiImportEndpoint<StrapiContent>({
  strapi: {
    collection: "contents",
    params: {
      populate: ["next_contents"],
    },
  },
  payload: {
    path: "/strapi/related-content",
    collection: Collections.Contents,
    import: async ({ slug, next_contents }, user) => {
      if (next_contents.data.length === 0) return;
      const currentContent = await findContent(slug);
      const nextContents: string[] = [];
      for (const nextContent of next_contents.data) {
        const result = await findContent(nextContent.attributes.slug);
        nextContents.push(result);
      }

      payload.update({
        collection: Collections.Contents,
        id: currentContent,
        data: { nextContents },
        user,
      });
    },
  },
});
