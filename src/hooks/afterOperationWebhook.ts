import {
  AfterDeleteHook,
  AfterChangeHook as CollectionAfterChangeHook,
} from "payload/dist/collections/config/types";
import { AfterChangeHook as GlobalAfterChangeHook } from "payload/dist/globals/config/types";
import { AfterOperationWebHookMessage, Collections } from "../constants";
import { getAddedBackPropagationRelationships } from "../fields/backPropagationField/backPropagationUtils";
import { getSDKEndpoint } from "../sdk";
import { Collectible } from "../types/collections";

const getURLs = (collection: Collections, doc: any): string[] => {
  switch (collection) {
    case Collections.WebsiteConfig:
      return [getSDKEndpoint.getConfigEndpoint()];

    case Collections.Folders:
      return [getSDKEndpoint.getFolderEndpoint(doc.slug)];

    case Collections.Languages:
      return [getSDKEndpoint.getLanguagesEndpoint()];

    case Collections.Currencies:
      return [getSDKEndpoint.getCurrenciesEndpoint()];

    case Collections.Wordings:
      return [getSDKEndpoint.getWordingsEndpoint()];

    case Collections.Pages:
      return [getSDKEndpoint.getPageEndpoint(doc.slug)];

    case Collections.Collectibles: {
      const { slug, gallery, scans, scansEnabled } = doc as Collectible;
      const urls: string[] = [getSDKEndpoint.getCollectibleEndpoint(slug)];
      if (gallery && gallery.length > 0) {
        urls.push(getSDKEndpoint.getCollectibleGalleryEndpoint(slug));
        urls.push(
          ...gallery.map((_, index) =>
            getSDKEndpoint.getCollectibleGalleryImageEndpoint(slug, index.toString())
          )
        );
      }
      if (scans && scansEnabled) {
        urls.push(getSDKEndpoint.getCollectibleScansEndpoint(slug));
        // TODO: Add other pages for cover, obi, dustjacket...
        if (scans.pages) {
          urls.push(
            ...scans.pages.map(({ page }) =>
              getSDKEndpoint.getCollectibleScanPageEndpoint(slug, page.toString())
            )
          );
        }
      }
      return urls;
    }

    case Collections.ChronologyEvents:
      return [
        getSDKEndpoint.getChronologyEventsEndpoint(),
        getSDKEndpoint.getChronologyEventByIDEndpoint(doc.id),
      ];

    case Collections.Images:
      return [getSDKEndpoint.getImageByIDEndpoint(doc.id)];

    case Collections.Audios:
      return [getSDKEndpoint.getAudioByIDEndpoint(doc.id)];

    case Collections.Videos:
      return [getSDKEndpoint.getVideoByIDEndpoint(doc.id)];

    case Collections.Recorders:
      return [getSDKEndpoint.getRecorderByIDEndpoint(doc.id)];

    default: {
      console.warn("Unrecognized collection", collection, "when sending webhook. No URL.");
      return [];
    }
  }
};

export const globalAfterChangeWebhook: GlobalAfterChangeHook = async ({
  global,
  doc,
  previousDoc,
}) => {
  const collection = global.slug as Collections;
  await sendWebhookMessage({
    collection,
    addedDependantIds: await getAddedBackPropagationRelationships(global, doc, previousDoc),
    urls: getURLs(collection, doc),
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
    urls: getURLs(collectionSlug, doc),
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
    urls: getURLs(collectionSlug, doc),
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
