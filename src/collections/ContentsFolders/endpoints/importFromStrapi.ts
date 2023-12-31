import payload from "payload";
import QueryString from "qs";
import { Collections } from "../../../constants";
import { CollectionEndpoint } from "../../../types/payload";
import { StrapiLanguage } from "../../../types/strapi";
import { isUndefined } from "../../../utils/asserts";
import { findContent } from "../../../utils/localApi";

type StrapiContentsFolder = {
  id: string;
  attributes: {
    slug: string;
    titles?: { title: string; language: StrapiLanguage }[];
    subfolders: { data: StrapiContentsFolder[] };
    contents: { data: { attributes: { slug: string } }[] };
  };
};

const getStrapiContentFolder = async (id: number): Promise<StrapiContentsFolder> => {
  const paramsWithPagination = QueryString.stringify({
    populate: [
      "contents",
      "subfolders",
      "subfolders.contents",
      "subfolders.titles",
      "subfolders.titles.language",
      "subfolders.subfolders",
      "subfolders.subfolders.contents",
      "subfolders.subfolders.titles",
      "subfolders.subfolders.titles.language",
      "subfolders.subfolders.subfolders",
      "subfolders.subfolders.subfolders.contents",
      "subfolders.subfolders.subfolders.titles",
      "subfolders.subfolders.subfolders.titles.language",
      "subfolders.subfolders.subfolders.subfolders",
      "subfolders.subfolders.subfolders.subfolders.contents",
      "subfolders.subfolders.subfolders.subfolders.titles",
      "subfolders.subfolders.subfolders.subfolders.titles.language",
      "subfolders.subfolders.subfolders.subfolders.subfolders",
      "subfolders.subfolders.subfolders.subfolders.subfolders.contents",
      "subfolders.subfolders.subfolders.subfolders.subfolders.titles",
      "subfolders.subfolders.subfolders.subfolders.subfolders.titles.language",
      "subfolders.subfolders.subfolders.subfolders.subfolders.subfolders",
      "subfolders.subfolders.subfolders.subfolders.subfolders.subfolders.contents",
      "subfolders.subfolders.subfolders.subfolders.subfolders.subfolders.titles",
      "subfolders.subfolders.subfolders.subfolders.subfolders.subfolders.titles.language",
      "subfolders.subfolders.subfolders.subfolders.subfolders.subfolders.subfolders",
      "subfolders.subfolders.subfolders.subfolders.subfolders.subfolders.subfolders.contents",
      "subfolders.subfolders.subfolders.subfolders.subfolders.subfolders.subfolders.titles",
      "subfolders.subfolders.subfolders.subfolders.subfolders.subfolders.subfolders.titles.language",
    ],
  });
  const uri = `${process.env.STRAPI_URI}/api/contents-folders/${id}?${paramsWithPagination}`;
  const fetchResult = await fetch(uri, {
    method: "get",
    headers: { authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
  });
  const { data } = await fetchResult.json();
  return data;
};

export const importFromStrapi: CollectionEndpoint = {
  method: "post",
  path: "/strapi",
  handler: async (req, res) => {
    if (!req.user) {
      return res.status(403).send({
        errors: [
          {
            message: "You are not allowed to perform this action.",
          },
        ],
      });
    }

    let foldersCreated = 0;
    const errors: string[] = [];

    const createContentFolder = async (data: StrapiContentsFolder): Promise<string> => {
      const { slug, titles } = data.attributes;

      const subfolders = await Promise.all(
        data.attributes.subfolders.data.map(createContentFolder)
      );

      const contents: string[] = [];
      for (const content of data.attributes.contents.data) {
        try {
          const result = await findContent(content.attributes.slug);
          contents.push(result);
        } catch (e) {
          errors.push(`Couldn't add ${content.attributes.slug} to folder ${slug}`);
        }
      }

      const result = await payload.create({
        collection: Collections.ContentsFolders,
        data: {
          slug,
          subfolders,
          contents,
          translations: titles?.map(({ title, language }) => {
            if (isUndefined(language.data))
              throw new Error("A language is required for a content folder translation");
            return { language: language.data.attributes.code, name: title };
          }),
        },
        user: req.user,
      });
      foldersCreated++;
      return result.id;
    };

    const rootFolder = await getStrapiContentFolder(72);
    try {
      await createContentFolder(rootFolder);
    } catch (e) {
      res.status(500).json({ message: "Something went wrong", error: e });
    }

    res
      .status(200)
      .json({ message: `${foldersCreated} entries have been added successfully.`, errors });
  },
};
