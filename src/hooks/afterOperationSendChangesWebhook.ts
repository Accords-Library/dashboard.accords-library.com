import { Collections } from "../shared/payload/constants";
import { getSDKEndpoint } from "../shared/payload/sdk";
import { EndpointChange } from "../shared/payload/webhooks";
import {
  Audio,
  ChronologyEvent,
  Collectible,
  Currency,
  File,
  Folder,
  Image,
  Language,
  Page,
  Recorder,
  Relationship,
  Video,
  Wording,
} from "../types/collections";
import { isPayloadType } from "../utils/asserts";
import { AfterChangeHook, AfterDeleteHook } from "payload/dist/collections/config/types";
import { GeneratedTypes } from "payload";
import { uniqueBy } from "../utils/array";
import { GlobalAfterChangeHook } from "payload/types";
import { findRelationByID } from "payloadcms-relationships/dist/utils";
import { RelationshipRemoved } from "payloadcms-relationships";

export const afterOutgoingRelationRemovedSendChangesWebhook = async ({
  removedOutgoingRelations,
}: RelationshipRemoved) => {
  const changes: EndpointChange[] = [];

  removedOutgoingRelations?.forEach((relation) =>
    changes.push(...getEndpointChangesFromOutgoingRelation(relation))
  );

  await sendWebhookMessage(uniqueBy(changes, ({ url }) => url));
};

export const afterChangeSendChangesWebhook: AfterChangeHook = async ({ doc, collection }) => {
  if ("_status" in doc && doc._status === "draft") return doc;
  await commonLogic(collection.slug as keyof GeneratedTypes["collections"], doc);
  return doc;
};

export const afterDeleteSendChangesWebhook: AfterDeleteHook = async ({ doc, collection }) => {
  await commonLogic(collection.slug as keyof GeneratedTypes["collections"], doc);
  return doc;
};

export const globalAfterChangeSendChangesWebhook: GlobalAfterChangeHook = async ({
  doc,
  global,
}) => {
  const changes: EndpointChange[] = [];

  switch (global.slug as keyof GeneratedTypes["globals"]) {
    case Collections.WebsiteConfig:
      changes.push({ type: "getConfig", url: getSDKEndpoint.getConfigEndpoint() });
      break;

    default:
      break;
  }
  await sendWebhookMessage(uniqueBy(changes, ({ url }) => url));
  return doc;
};

const commonLogic = async (slug: keyof GeneratedTypes["collections"], doc: any) => {
  if (slug === "relationships") return doc;
  if (slug === "payload-migrations") return doc;
  if (slug === "payload-preferences") return doc;

  let relation: Relationship;
  try {
    relation = await findRelationByID(slug, doc.id);
  } catch (e) {
    relation = {
      id: doc.id,
      document: {
        relationTo: slug,
        value: doc,
      },
      outgoingRelations: [],
    };
  }

  const changes: EndpointChange[] = getEndpointChangesFromDocument(relation.document);

  relation.incomingRelations?.forEach((relation) =>
    changes.push(...getEndpointChangesFromIncomingRelation(relation))
  );

  relation.outgoingRelations?.forEach((relation) =>
    changes.push(...getEndpointChangesFromOutgoingRelation(relation))
  );

  await sendWebhookMessage(uniqueBy(changes, ({ url }) => url));
};

// -------------------------------------------------------------------------------------------------

const getEndpointChangesFromDocument = ({
  relationTo,
  value,
}: NonNullable<Relationship["document"]>): EndpointChange[] => {
  if (!isPayloadType(value)) return [];
  switch (relationTo) {
    case Collections.Folders:
      return getEndpointChangesForFolder(value);

    case Collections.Pages:
      return getEndpointChangesForPage(value);

    case Collections.Collectibles:
      return getEndpointChangesForCollectible(value);

    case Collections.Audios:
      return getEndpointChangesForAudio(value);

    case Collections.Images:
      return getEndpointChangesForImage(value);

    case Collections.Videos:
      return getEndpointChangesForVideo(value);

    case Collections.Files:
      return getEndpointChangesForFile(value);

    case Collections.Recorders:
      return getEndpointChangesForRecorder(value);

    case Collections.ChronologyEvents:
      return getEndpointChangesForChronologyEvent(value);

    case Collections.Languages:
      return getEndpointChangesForLanguage(value);

    case Collections.Currencies:
      return getEndpointChangesForCurrency(value);

    case Collections.Wordings:
      return getEndpointChangesForWording(value);

    case Collections.Attributes:
    case Collections.CreditsRole:
    case Collections.GenericContents:
    case Collections.MediaThumbnails:
    case Collections.Scans:
    case Collections.Tags:
    case Collections.VideosChannels:
    case Collections.VideosSubtitles:
    default:
      return [];
  }
};

const getEndpointChangesFromIncomingRelation = ({
  relationTo,
  value,
}: NonNullable<Relationship["incomingRelations"]>[number]): EndpointChange[] => {
  if (!isPayloadType(value)) return [];
  switch (relationTo) {
    case Collections.Folders:
      return getEndpointChangesForFolder(value);

    case Collections.Pages:
      return getEndpointChangesForPage(value);

    case Collections.Collectibles:
      return getEndpointChangesForCollectible(value);

    case Collections.Audios:
      return getEndpointChangesForAudio(value);

    case Collections.Images:
      return getEndpointChangesForImage(value);

    case Collections.Videos:
      return getEndpointChangesForVideo(value);

    case Collections.Files:
      return getEndpointChangesForFile(value);

    case Collections.Recorders:
      return getEndpointChangesForRecorder(value);

    case Collections.ChronologyEvents:
      return getEndpointChangesForChronologyEvent(value);

    case Collections.Languages:
    case Collections.Currencies:
    case Collections.Wordings:
    case Collections.Attributes:
    case Collections.CreditsRole:
    case Collections.GenericContents:
    case Collections.MediaThumbnails:
    case Collections.Scans:
    case Collections.Tags:
    case Collections.VideosChannels:
    case Collections.VideosSubtitles:
    default:
      return [];
  }
};

const getEndpointChangesFromOutgoingRelation = ({
  relationTo,
  value,
}: NonNullable<Relationship["outgoingRelations"]>[number]): EndpointChange[] => {
  if (!isPayloadType(value)) return [];
  switch (relationTo) {
    case Collections.Folders:
      return getEndpointChangesForFolder(value);

    case Collections.Pages:
      return getEndpointChangesForPage(value);

    case Collections.Collectibles:
      return getEndpointChangesForCollectible(value);

    case Collections.Audios:
      return getEndpointChangesForAudio(value);

    case Collections.Images:
      return getEndpointChangesForImage(value);

    case Collections.Videos:
      return getEndpointChangesForVideo(value);

    case Collections.Files:
      return getEndpointChangesForFile(value);

    case Collections.Languages:
    case Collections.Currencies:
    case Collections.Wordings:
    case Collections.Attributes:
    case Collections.CreditsRole:
    case Collections.GenericContents:
    case Collections.MediaThumbnails:
    case Collections.Scans:
    case Collections.Tags:
    case Collections.VideosChannels:
    case Collections.VideosSubtitles:
    case Collections.ChronologyEvents:
    case Collections.Recorders:
    default:
      return [];
  }
};

const getEndpointChangesForFolder = ({ slug }: Folder): EndpointChange[] => [
  { type: "getFolder", slug, url: getSDKEndpoint.getFolderEndpoint(slug) },
];

const getEndpointChangesForLanguage = (_: Language): EndpointChange[] => [
  { type: "getLanguages", url: getSDKEndpoint.getLanguagesEndpoint() },
];

const getEndpointChangesForCurrency = (_: Currency): EndpointChange[] => [
  { type: "getCurrencies", url: getSDKEndpoint.getCurrenciesEndpoint() },
];

const getEndpointChangesForWording = (_: Wording): EndpointChange[] => [
  { type: "getWordings", url: getSDKEndpoint.getWordingsEndpoint() },
];

const getEndpointChangesForPage = ({ slug }: Page): EndpointChange[] => [
  { type: "getPage", slug, url: getSDKEndpoint.getPageEndpoint(slug) },
];

const getEndpointChangesForCollectible = ({
  slug,
  gallery,
  scans,
  scansEnabled,
}: Collectible): EndpointChange[] => {
  const changes: EndpointChange[] = [];

  if (gallery && gallery.length > 0) {
    changes.push({
      type: "getCollectibleGallery",
      slug,
      url: getSDKEndpoint.getCollectibleGalleryEndpoint(slug),
    });
    gallery.forEach((_, indexNumber) => {
      const index = indexNumber.toString();
      changes.push({
        type: "getCollectibleGalleryImage",
        slug,
        index: index,
        url: getSDKEndpoint.getCollectibleGalleryImageEndpoint(slug, index),
      });
    });
  }

  if (scans && scansEnabled) {
    changes.push({
      type: "getCollectibleScans",
      slug,
      url: getSDKEndpoint.getCollectibleScansEndpoint(slug),
    });

    // TODO: Add other changes for cover, obi, dustjacket...

    scans.pages?.forEach((_, indexNumber) => {
      const index = indexNumber.toString();
      changes.push({
        type: "getCollectibleScanPage",
        slug,
        index: index,
        url: getSDKEndpoint.getCollectibleScanPageEndpoint(slug, index),
      });
    });
  }

  return changes;
};

const getEndpointChangesForAudio = ({ id }: Audio): EndpointChange[] => [
  { type: "getAudioByID", id, url: getSDKEndpoint.getAudioByIDEndpoint(id) },
];

const getEndpointChangesForImage = ({ id }: Image): EndpointChange[] => [
  { type: "getImageByID", id, url: getSDKEndpoint.getImageByIDEndpoint(id) },
];

const getEndpointChangesForVideo = ({ id }: Video): EndpointChange[] => [
  { type: "getVideoByID", id, url: getSDKEndpoint.getVideoByIDEndpoint(id) },
];

const getEndpointChangesForFile = ({ id }: File): EndpointChange[] => [
  { type: "getFileByID", id, url: getSDKEndpoint.getFileByIDEndpoint(id) },
];

const getEndpointChangesForRecorder = ({ id }: Recorder): EndpointChange[] => [
  { type: "getRecorderByID", id, url: getSDKEndpoint.getRecorderByIDEndpoint(id) },
];

const getEndpointChangesForChronologyEvent = ({ id }: ChronologyEvent): EndpointChange[] => [
  {
    type: "getChronologyEventByID",
    id,
    url: getSDKEndpoint.getChronologyEventByIDEndpoint(id),
  },
  {
    type: "getChronologyEvents",
    url: getSDKEndpoint.getChronologyEventsEndpoint(),
  },
];

// -------------------------------------------------------------------------------------------------

const webhookTargets: { url: string; token: string }[] = [
  {
    url: process.env.WEB_SERVER_HOOK_URL ?? "",
    token: process.env.WEB_SERVER_HOOK_TOKEN ?? "",
  },
  {
    url: process.env.MEILISEARCH_HOOK_URL ?? "",
    token: process.env.MEILISEARCH_HOOK_TOKEN ?? "",
  },
];

const sendWebhookMessage = async (changes: EndpointChange[]) => {
  if (changes.length === 0) return;
  try {
    await Promise.all(
      webhookTargets.flatMap(({ url, token }) => {
        if (!url) return;
        return fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changes),
          method: "POST",
        });
      })
    );
  } catch (e) {
    console.warn("Error while sending webhook", e);
  }
};
