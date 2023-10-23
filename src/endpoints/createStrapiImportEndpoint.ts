import payload, { GeneratedTypes } from "payload";
import { BasePayload } from "payload/dist/payload";
import QueryString from "qs";
import { Collections } from "../constants";
import { Recorder } from "../types/collections";
import { CollectionEndpoint } from "../types/payload";
import { isDefined } from "../utils/asserts";

export const getAllStrapiEntries = async (
  collectionSlug: string,
  params: Object
): Promise<any[]> => {
  let page = 1;
  let totalPage = 1;
  const result: any[] = [];

  while (page <= totalPage) {
    const paramsWithPagination = QueryString.stringify({
      ...params,
      pagination: { pageSize: 100, page },
    });
    const uri = `${process.env.STRAPI_URI}/api/${collectionSlug}?${paramsWithPagination}`;
    const fetchResult = await fetch(uri, {
      method: "get",
      headers: { authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
    });
    const { data, meta } = await fetchResult.json();
    result.push(...data);
    totalPage = meta.pagination.pageCount;
    page++;
  }
  return result;
};

type Params<S> = {
  strapi: {
    collection: string;
    params: any;
  };
  payload: {
    collection: Collections;
    import?: (strapiObject: S, user: any) => Promise<void>;
    convert?: (
      strapiObject: S,
      user: any
    ) => Promise<Parameters<BasePayload<GeneratedTypes>["create"]>[0]["data"]>;
  };
};

export const importStrapiEntries = async <S>({
  strapi: strapiParams,
  payload: payloadParams,
  user,
}: Params<S> & { user: Recorder }) => {
  const entries = await getAllStrapiEntries(strapiParams.collection, strapiParams.params);

  const errors: string[] = [];

  await Promise.all(
    entries.map(async ({ attributes, id }) => {
      try {
        if (isDefined(payloadParams.import)) {
          await payloadParams.import(attributes, user);
        } else if (isDefined(payloadParams.convert)) {
          await payload.create({
            collection: payloadParams.collection,
            data: await payloadParams.convert(attributes, user),
            user,
          });
        } else {
          throw new Error("No function was provided to handle importing the Strapi data");
        }
      } catch (e) {
        console.warn(e);
        if (typeof e === "object" && isDefined(e) && "name" in e) {
          errors.push(`${e.name} with ${id}`);
        }
      }
    })
  );

  return { count: entries.length, errors };
};

export const createStrapiImportEndpoint = <S>(params: Params<S>): CollectionEndpoint => ({
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

    const { count, errors } = await importStrapiEntries({ ...params, user: req.user });

    res.status(200).json({ message: `${count} entries have been added successfully.`, errors });
  },
});
