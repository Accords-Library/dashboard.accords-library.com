import { Collections } from "../shared/payload/constants";
import { SDKEndpointNames, getSDKEndpoint } from "../shared/payload/sdk";
import { EndpointChange } from "../shared/payload/webhooks";
import {
  Audio,
  ChronologyEvent,
  Collectible,
  File,
  Folder,
  Image,
  Page,
  Recorder,
  Relationship,
  Video,
} from "../types/collections";
import { isPayloadType } from "../utils/asserts";
import {
  AfterChangeHook,
  AfterDeleteHook,
  BeforeDeleteHook,
} from "payload/dist/collections/config/types";
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

  const changes = await getChanges(collection.slug as keyof GeneratedTypes["collections"], doc);
  await sendWebhookMessage(changes);

  return doc;
};

export const beforeDeletePrepareChanges: BeforeDeleteHook = async ({ id, collection, context }) => {
  const changes = await getChanges(collection.slug as keyof GeneratedTypes["collections"], { id });
  context.beforeDeleteChanges = changes;
};

export const afterDeleteSendChangesWebhook: AfterDeleteHook = async ({ doc, context }) => {
  const changes = context.beforeDeleteChanges as EndpointChange[] | undefined;
  if (changes) {
    await sendWebhookMessage(changes);
  }
  return doc;
};

export const globalAfterChangeSendChangesWebhook: GlobalAfterChangeHook = async ({
  doc,
  global,
}) => {
  const changes: EndpointChange[] = [];

  switch (global.slug as keyof GeneratedTypes["globals"]) {
    case Collections.WebsiteConfig:
      changes.push(...getEndpointChangesForWebsiteConfig());
      break;

    default:
      break;
  }
  await sendWebhookMessage(uniqueBy(changes, ({ url }) => url));
  return doc;
};

const getChanges = async (
  slug: keyof GeneratedTypes["collections"],
  doc: any
): Promise<EndpointChange[]> => {
  if (slug === "relationships") return [];
  if (slug === "payload-migrations") return [];
  if (slug === "payload-preferences") return [];

  let relation: Relationship;
  try {
    relation = await findRelationByID(slug, doc.id);
  } catch (e) {
    relation = {
      id: "",
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

  return uniqueBy(changes, ({ url }) => url);
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
      return getEndpointChangesForLanguage();

    case Collections.Currencies:
      return getEndpointChangesForCurrency();

    case Collections.Wordings:
      return getEndpointChangesForWording();

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

export const getEndpointChangesForWebsiteConfig = (): EndpointChange[] => [
  {
    type: SDKEndpointNames.getWebsiteConfig,
    url: getSDKEndpoint.getWebsiteConfig(),
  },
];

export const getEndpointChangesForFolder = ({ slug }: Folder): EndpointChange[] => [
  { type: SDKEndpointNames.getFolder, slug, url: getSDKEndpoint.getFolder(slug) },
];

export const getEndpointChangesForLanguage = (): EndpointChange[] => [
  { type: SDKEndpointNames.getLanguages, url: getSDKEndpoint.getLanguages() },
];

export const getEndpointChangesForCurrency = (): EndpointChange[] => [
  { type: SDKEndpointNames.getCurrencies, url: getSDKEndpoint.getCurrencies() },
];

export const getEndpointChangesForWording = (): EndpointChange[] => [
  { type: SDKEndpointNames.getWordings, url: getSDKEndpoint.getWordings() },
];

export const getEndpointChangesForPage = ({ slug }: Page): EndpointChange[] => [
  { type: SDKEndpointNames.getPage, slug, url: getSDKEndpoint.getPage(slug) },
];

export const getEndpointChangesForCollectible = ({
  slug,
  gallery,
  scans,
  scansEnabled,
}: Collectible): EndpointChange[] => {
  const changes: EndpointChange[] = [];

  changes.push({
    type: SDKEndpointNames.getCollectible,
    slug,
    url: getSDKEndpoint.getCollectible(slug),
  });

  if (gallery && gallery.length > 0) {
    changes.push({
      type: SDKEndpointNames.getCollectibleGallery,
      slug,
      url: getSDKEndpoint.getCollectibleGallery(slug),
    });
    gallery.forEach((_, indexNumber) => {
      const index = indexNumber.toString();
      changes.push({
        type: SDKEndpointNames.getCollectibleGalleryImage,
        slug,
        index: index,
        url: getSDKEndpoint.getCollectibleGalleryImage(slug, index),
      });
    });
  }

  if (scans && scansEnabled) {
    changes.push({
      type: SDKEndpointNames.getCollectibleScans,
      slug,
      url: getSDKEndpoint.getCollectibleScans(slug),
    });

    // TODO: Add other changes for cover, obi, dustjacket...

    scans.pages?.forEach(({ page }) => {
      const index = page.toString();
      changes.push({
        type: SDKEndpointNames.getCollectibleScanPage,
        slug,
        index: index,
        url: getSDKEndpoint.getCollectibleScanPage(slug, index),
      });
    });
  }

  return changes;
};

export const getEndpointChangesForAudio = ({ id }: Audio): EndpointChange[] => [
  { type: SDKEndpointNames.getAudioByID, id, url: getSDKEndpoint.getAudioByID(id) },
];

export const getEndpointChangesForImage = ({ id }: Image): EndpointChange[] => [
  { type: SDKEndpointNames.getImageByID, id, url: getSDKEndpoint.getImageByID(id) },
];

export const getEndpointChangesForVideo = ({ id }: Video): EndpointChange[] => [
  { type: SDKEndpointNames.getVideoByID, id, url: getSDKEndpoint.getVideoByID(id) },
];

export const getEndpointChangesForFile = ({ id }: File): EndpointChange[] => [
  { type: SDKEndpointNames.getFileByID, id, url: getSDKEndpoint.getFileByID(id) },
];

export const getEndpointChangesForRecorder = ({ id }: Recorder): EndpointChange[] => [
  { type: SDKEndpointNames.getRecorderByID, id, url: getSDKEndpoint.getRecorderByID(id) },
];

export const getEndpointChangesForChronologyEvent = ({ id }: ChronologyEvent): EndpointChange[] => [
  {
    type: SDKEndpointNames.getChronologyEventByID,
    id,
    url: getSDKEndpoint.getChronologyEventByID(id),
  },
  {
    type: SDKEndpointNames.getChronologyEvents,
    url: getSDKEndpoint.getChronologyEvents(),
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
    if (e instanceof Error) {
      console.warn("Error while sending webhook", e.message);
    } else {
      console.warn("Error while sending webhook", e);
    }
  }
};
