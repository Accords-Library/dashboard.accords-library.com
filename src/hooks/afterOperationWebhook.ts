import {
  AfterDeleteHook,
  AfterChangeHook as CollectionAfterChangeHook,
} from "payload/dist/collections/config/types";
import { AfterChangeHook as GlobalAfterChangeHook } from "payload/dist/globals/config/types";
import { getSDKUrlsForDocument } from "../endpoints/getAllSDKUrlsEndpoint";
import { getAddedBackPropagationRelationships } from "../fields/backPropagationField/backPropagationUtils";
import { Collections } from "../shared/payload/constants";
import { AfterOperationWebHookMessage } from "../shared/payload/webhooks";

export const globalAfterChangeWebhook: GlobalAfterChangeHook = async ({
  global,
  doc,
  previousDoc,
}) => {
  const collection = global.slug as Collections;
  await sendWebhookMessage({
    collection,
    addedDependantIds: await getAddedBackPropagationRelationships(global, doc, previousDoc),
    urls: getSDKUrlsForDocument(collection, doc),
  });
  return doc;
};

export const collectionAfterChangeWebhook: CollectionAfterChangeHook = async ({
  collection,
  doc,
  previousDoc,
  operation,
}) => {
  const collectionSlug = collection.slug as Collections;
  console.log("afterChange", operation, collectionSlug, doc.id);

  if ("_status" in doc && doc._status === "draft") {
    return doc;
  }

  if (!("id" in doc)) {
    return doc;
  }

  await sendWebhookMessage({
    collection: collectionSlug,
    id: doc.id,
    addedDependantIds: await getAddedBackPropagationRelationships(collection, doc, previousDoc),
    urls: getSDKUrlsForDocument(collectionSlug, doc),
  });

  return doc;
};

export const afterDeleteWebhook: AfterDeleteHook = async ({ collection, doc }) => {
  const collectionSlug = collection.slug as Collections;
  console.log("afterDelete", collection.slug, doc.id);

  if (!("id" in doc)) {
    return doc;
  }

  await sendWebhookMessage({
    collection: collectionSlug,
    id: doc.id,
    addedDependantIds: [],
    urls: getSDKUrlsForDocument(collectionSlug, doc),
  });

  return doc;
};

const sendWebhookMessage = async (message: AfterOperationWebHookMessage) => {
  try {
    await Promise.all(
      [process.env.WEB_SERVER_HOOK_URL, process.env.MEILISEARCH_HOOK_URL].flatMap((url) => {
        if (!url) return;
        return fetch(url, {
          headers: {
            Authorization: `Bearer ${process.env.WEB_SERVER_HOOK_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
          method: "POST",
        });
      })
    );
  } catch (e) {
    console.warn("Error while sending webhook", e);
  }
};
