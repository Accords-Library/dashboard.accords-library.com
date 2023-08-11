import payload from "payload";
import { CollectionConfig } from "payload/types";
import QueryString from "qs";
import { Recorder } from "../types/collections";
import { isDefined } from "../utils/asserts";
import { PayloadCreateData } from "../utils/types";

export const getAllStrapiEntries = async <T>(
  collectionSlug: string,
  params: Object
): Promise<T[]> => {
  let page = 1;
  let totalPage = 1;
  const result: T[] = [];

  while (page <= totalPage) {
    const paramsWithPagination = QueryString.stringify({
      ...params,
      pagination: { pageSize: 100, page },
    });
    const uri = `${process.env.STRAPI_URI}/api/${collectionSlug}?${paramsWithPagination}`;
    const fetchResult = await fetch(uri, {
      method: "GET",
      headers: { authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
    });
    const { data, meta } = await fetchResult.json();
    result.push(...data);
    totalPage = meta.pagination.pageCount;
    page++;
  }
  return result;
};

type Params<T> = {
  strapi: {
    collection: string;
    params: any;
  };
  payload: {
    collection: string;
    import?: (strapiObject: any, user: any) => Promise<void>;
    convert?: (strapiObject: any) => PayloadCreateData<T>;
  };
};

export const importStrapiEntries = async <T>({
  strapi: strapiParams,
  payload: payloadParams,
  user,
}: Params<T> & { user: Recorder }) => {
  const entries = await getAllStrapiEntries<any>(strapiParams.collection, strapiParams.params);

  const errors = [];

  await Promise.all(
    entries.map(async ({ attributes, id }) => {
      try {
        if (isDefined(payloadParams.import)) {
          await payloadParams.import(attributes, user);
        } else if (isDefined(payloadParams.convert)) {
          await payload.create({
            collection: payloadParams.collection,
            data: payloadParams.convert(attributes),
            user,
          });
        } else {
          throw new Error("No function was provided to handle importing the Strapi data");
        }
      } catch (e) {
        console.warn(e);
        errors.push(`${e.name} with ${id}`);
      }
    })
  );

  return { count: entries.length, errors };
};

export const createStrapiImportEndpoint = <T>(
  params: Params<T>
): CollectionConfig["endpoints"][number] => ({
  method: "get",
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
