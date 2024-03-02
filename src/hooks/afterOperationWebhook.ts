import { AfterOperationHook } from "payload/dist/collections/config/types";

export const afterOperationWebhook: AfterOperationHook = async ({
  result,
  collection,
  operation,
}) => {
  if (["create", "delete", "deleteByID", "update", "updateByID"].includes(operation)) {
    const url = `${process.env.WEB_HOOK_URI}/collection-operation`;
    await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.WEB_HOOK_TOKEN}`,
        Collection: collection.slug,
      },
    });
  }
  return result;
};
