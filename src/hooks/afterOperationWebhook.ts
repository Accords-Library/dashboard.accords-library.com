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

if (!process.env.WEB_SERVER_HOOK_URL) throw new Error("Missing WEB_SERVER_HOOK_URL");
if (!process.env.WEB_SERVER_HOOK_TOKEN) throw new Error("Missing WEB_SERVER_HOOK_TOKEN");
if (!process.env.MEILISEARCH_HOOK_URL) throw new Error("Missing MEILISEARCH_HOOK_URL");
if (!process.env.MEILISEARCH_HOOK_TOKEN) throw new Error("Missing MEILISEARCH_HOOK_TOKEN");

const webhookTargets: { url: string; token: string }[] = [
  {
    url: process.env.WEB_SERVER_HOOK_URL,
    token: process.env.WEB_SERVER_HOOK_TOKEN,
  },
  {
    url: process.env.MEILISEARCH_HOOK_URL,
    token: process.env.MEILISEARCH_HOOK_TOKEN,
  },
];

const sendWebhookMessage = async (message: AfterOperationWebHookMessage) => {
  try {
    await Promise.all(
      webhookTargets.flatMap(({ url, token }) => {
        if (!url) return;
        return fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
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
