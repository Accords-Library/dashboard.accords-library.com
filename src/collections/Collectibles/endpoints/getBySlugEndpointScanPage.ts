import payload from "payload";
import { Collections } from "src/shared/payload/constants";
import { EndpointCollectibleScanPage } from "src/shared/payload/endpoint-types";
import { Collectible, Scan } from "src/types/collections";
import { CollectionEndpoint } from "src/types/payload";
import { isScan, isPayloadType, isNotEmpty, isDefined } from "src/utils/asserts";
import { convertScanToEndpointScanImage, convertSourceToEndpointSource } from "src/utils/endpoints";

export const getBySlugEndpointScanPage: CollectionEndpoint = {
  path: "/slug/:slug/scans/:index",
  method: "get",
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

    const { slug, index } = req.params;

    if (!slug) {
      return res.status(400).send({ error: "Missing 'slug' in endpoint path" });
    }
    if (!index) {
      return res.status(400).send({ error: "Missing 'index' in endpoint path" });
    }

    const result = await payload.find({
      collection: Collections.Collectibles,
      where: { slug: { equals: slug } },
    });

    const collectible = result.docs[0];

    if (!collectible || !collectible.scansEnabled || !collectible.scans) {
      return res.sendStatus(404);
    }

    const scan = getScanFromIndex(index, collectible.scans);

    if (!isScan(scan)) {
      return res.sendStatus(404);
    }

    const previousIndex = getPreviousIndex(index, collectible.scans);
    const nextIndex = getNextIndex(index, collectible.scans);

    const scanPage: EndpointCollectibleScanPage = {
      image: convertScanToEndpointScanImage(scan, index),
      parentPages: convertSourceToEndpointSource({ scans: [collectible] }),
      slug,
      translations:
        collectible.translations?.map(({ language, title, description, pretitle, subtitle }) => ({
          language: isPayloadType(language) ? language.id : language,
          title,
          ...(isNotEmpty(pretitle) ? { pretitle } : {}),
          ...(isNotEmpty(subtitle) ? { subtitle } : {}),
          ...(isNotEmpty(description) ? { description } : {}),
        })) ?? [],
      ...(isDefined(previousIndex) ? { previousIndex } : {}),
      ...(isDefined(nextIndex) ? { nextIndex } : {}),
    };

    res.status(200).send(scanPage);
  },
};

const getPreviousIndex = (
  index: string,
  scans: NonNullable<Collectible["scans"]>
): string | undefined => {
  const pageIndex = parseInt(index, 10);
  if (isNaN(pageIndex)) return;

  const page = scans.pages?.find(({ page }) => page === pageIndex - 1);
  if (!page) return;

  return page.page.toString();
};

const getNextIndex = (
  index: string,
  scans: NonNullable<Collectible["scans"]>
): string | undefined => {
  const pageIndex = parseInt(index, 10);
  if (isNaN(pageIndex)) return;

  const page = scans.pages?.find(({ page }) => page === pageIndex + 1);
  if (!page) return;

  return page.page.toString();
};

const getScanFromIndex = (
  index: string,
  scans: NonNullable<Collectible["scans"]>
): string | Scan | null | undefined => {
  switch (index) {
    case "cover-flap-front":
      return scans.cover?.flapFront;
    case "cover-front":
      return scans.cover?.front;
    case "cover-spine":
      return scans.cover?.spine;
    case "cover-back":
      return scans.cover?.back;
    case "cover-flap-back":
      return scans.cover?.flapBack;

    case "cover-inside-flap-front":
      return scans.cover?.insideFlapFront;
    case "cover-inside-front":
      return scans.cover?.insideFront;
    case "cover-inside-back":
      return scans.cover?.insideBack;
    case "cover-inside-flap-back":
      return scans.cover?.insideFlapBack;

    case "dustjacket-flap-front":
      return scans.dustjacket?.flapFront;
    case "dustjacket-front":
      return scans.dustjacket?.front;
    case "dustjacket-spine":
      return scans.dustjacket?.spine;
    case "dustjacket-back":
      return scans.dustjacket?.back;
    case "dustjacket-flap-back":
      return scans.dustjacket?.flapBack;

    case "dustjacket-inside-flap-front":
      return scans.dustjacket?.insideFlapFront;
    case "dustjacket-inside-front":
      return scans.dustjacket?.insideFront;
    case "dustjacket-inside-spine":
      return scans.dustjacket?.insideSpine;
    case "dustjacket-inside-back":
      return scans.dustjacket?.insideBack;
    case "dustjacket-inside-flap-back":
      return scans.dustjacket?.insideFlapBack;

    case "obi-flap-front":
      return scans.obi?.flapFront;
    case "obi-front":
      return scans.obi?.front;
    case "obi-spine":
      return scans.obi?.spine;
    case "obi-back":
      return scans.obi?.back;
    case "obi-flap-back":
      return scans.obi?.flapBack;

    case "obi-inside-flap-front":
      return scans.obi?.insideFlapFront;
    case "obi-inside-front":
      return scans.obi?.insideFront;
    case "obi-inside-spine":
      return scans.obi?.insideSpine;
    case "obi-inside-back":
      return scans.obi?.insideBack;
    case "obi-inside-flap-back":
      return scans.obi?.insideFlapBack;
  }

  const pageIndex = parseInt(index, 10);
  if (isNaN(pageIndex)) return;

  const page = scans.pages?.find(({ page }) => page === pageIndex);
  if (!page) return;

  return page.image;
};
