import {
  AfterDeleteHook,
  AfterChangeHook as CollectionAfterChangeHook,
} from "payload/dist/collections/config/types";
import { AfterChangeHook as GlobalAfterChangeHook } from "payload/dist/globals/config/types";
import { getSDKUrlsForDocument } from "src/endpoints/getAllSDKUrlsEndpoint";
import { getAddedBackPropagationRelationships } from "src/fields/backPropagationField/backPropagationUtils";
import { Collections } from "src/shared/payload/constants";
import { AfterOperationWebHookMessage } from "src/shared/payload/webhooks";

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
  await fetch(`${process.env.WEB_HOOK_URI}/collection-operation`, {
    headers: {
      Authorization: `Bearer ${process.env.WEB_HOOK_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
    method: "POST",
  }).catch((e) => {
    console.warn("Error while sending webhook", e);
  });
};
