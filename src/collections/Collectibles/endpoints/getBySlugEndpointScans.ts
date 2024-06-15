import { Collections } from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointCollectibleScans } from "../../../sdk";
import { Collectible } from "../../../types/collections";
import { isImage, isNotEmpty, isPayloadType, isScan } from "../../../utils/asserts";
import {
  convertCreditsToEndpointCredits,
  convertImageToEndpointPayloadImage,
  convertScanToEndpointScanImage,
  convertSourceToEndpointSource,
} from "../../../utils/endpoints";

export const getBySlugEndpointScans = createGetByEndpoint({
  collection: Collections.Collectibles,
  attribute: "slug",
  suffix: "/scans",
  depth: 3,
  handler: (collectible): EndpointCollectibleScans => {
    const { slug, thumbnail, translations, scans, scansEnabled } = collectible;
    return {
      slug,
      translations:
        translations?.map(({ language, title, description, pretitle, subtitle }) => ({
          language: isPayloadType(language) ? language.id : language,
          title,
          ...(isNotEmpty(pretitle) ? { pretitle } : {}),
          ...(isNotEmpty(subtitle) ? { subtitle } : {}),
          ...(isNotEmpty(description) ? { description } : {}),
        })) ?? [],
      ...(isImage(thumbnail) ? { thumbnail: convertImageToEndpointPayloadImage(thumbnail) } : {}),
      ...(scansEnabled && scans ? handleScans(scans) : { credits: [], pages: [] }),
      parentPages: convertSourceToEndpointSource({ collectibles: [collectible] }),
    };
  },
});

const handleScans = ({
  credits,
  cover,
  coverEnabled,
  dustjacket,
  dustjacketEnabled,
  obi,
  obiEnabled,
  pages,
}: NonNullable<Collectible["scans"]>): Pick<
  EndpointCollectibleScans,
  "cover" | "obi" | "dustjacket" | "pages" | "credits"
> => ({
  credits: convertCreditsToEndpointCredits(credits),
  pages:
    pages?.flatMap(({ image, page }) =>
      isScan(image) ? convertScanToEndpointScanImage(image, page.toString()) : []
    ) ?? [],
  ...(coverEnabled && cover ? { cover: handleCover(cover) } : {}),
  ...(dustjacketEnabled && dustjacket ? { dustjacket: handleDustjacket(dustjacket) } : {}),
  ...(obiEnabled && obi ? { obi: handleObi(obi) } : {}),
});

const handleCover = ({
  back,
  flapBack,
  flapFront,
  front,
  insideBack,
  insideFlapBack,
  insideFlapFront,
  insideFront,
  spine,
}: NonNullable<NonNullable<Collectible["scans"]>["cover"]>): EndpointCollectibleScans["cover"] => ({
  ...(isScan(back) ? { back: convertScanToEndpointScanImage(back, "cover-back") } : {}),
  ...(isScan(flapBack)
    ? { flapBack: convertScanToEndpointScanImage(flapBack, "cover-flap-back") }
    : {}),
  ...(isScan(flapFront)
    ? { flapFront: convertScanToEndpointScanImage(flapFront, "cover-flap-front") }
    : {}),
  ...(isScan(front) ? { front: convertScanToEndpointScanImage(front, "cover-front") } : {}),
  ...(isScan(insideBack)
    ? { insideBack: convertScanToEndpointScanImage(insideBack, "cover-inside-back") }
    : {}),
  ...(isScan(insideFlapBack)
    ? { insideFlapBack: convertScanToEndpointScanImage(insideFlapBack, "cover-inside-flap-back") }
    : {}),
  ...(isScan(insideFlapFront)
    ? {
        insideFlapFront: convertScanToEndpointScanImage(insideFlapFront, "cover-inside-flap-front"),
      }
    : {}),
  ...(isScan(insideFront)
    ? { insideFront: convertScanToEndpointScanImage(insideFront, "cover-inside-front") }
    : {}),
  ...(isScan(spine) ? { spine: convertScanToEndpointScanImage(spine, "cover-spine") } : {}),
});

const handleDustjacket = ({
  back,
  flapBack,
  flapFront,
  front,
  insideBack,
  insideFlapBack,
  insideFlapFront,
  insideFront,
  insideSpine,
  spine,
}: NonNullable<
  NonNullable<Collectible["scans"]>["dustjacket"]
>): EndpointCollectibleScans["dustjacket"] => ({
  ...(isScan(back) ? { back: convertScanToEndpointScanImage(back, "dustjacket-back") } : {}),
  ...(isScan(flapBack)
    ? { flapBack: convertScanToEndpointScanImage(flapBack, "dustjacket-flap-back") }
    : {}),
  ...(isScan(flapFront)
    ? { flapFront: convertScanToEndpointScanImage(flapFront, "dustjacket-flap-front") }
    : {}),
  ...(isScan(front) ? { front: convertScanToEndpointScanImage(front, "dustjacket-front") } : {}),
  ...(isScan(insideBack)
    ? { insideBack: convertScanToEndpointScanImage(insideBack, "dustjacket-inside-back") }
    : {}),
  ...(isScan(insideFlapBack)
    ? {
        insideFlapBack: convertScanToEndpointScanImage(
          insideFlapBack,
          "dustjacket-inside-flap-back"
        ),
      }
    : {}),
  ...(isScan(insideFlapFront)
    ? {
        insideFlapFront: convertScanToEndpointScanImage(
          insideFlapFront,
          "dustjacket-inside-flap-front"
        ),
      }
    : {}),
  ...(isScan(insideFront)
    ? { insideFront: convertScanToEndpointScanImage(insideFront, "dustjacket-inside-front") }
    : {}),
  ...(isScan(spine) ? { spine: convertScanToEndpointScanImage(spine, "dustjacket-spine") } : {}),
  ...(isScan(insideSpine)
    ? { insideSpine: convertScanToEndpointScanImage(insideSpine, "dustjacket-inside-spine") }
    : {}),
});

const handleObi = ({
  back,
  flapBack,
  flapFront,
  front,
  insideBack,
  insideFlapBack,
  insideFlapFront,
  insideFront,
  insideSpine,
  spine,
}: NonNullable<NonNullable<Collectible["scans"]>["obi"]>): EndpointCollectibleScans["obi"] => ({
  ...(isScan(back) ? { back: convertScanToEndpointScanImage(back, "obi-back") } : {}),
  ...(isScan(flapBack)
    ? { flapBack: convertScanToEndpointScanImage(flapBack, "obi-flap-back") }
    : {}),
  ...(isScan(flapFront)
    ? { flapFront: convertScanToEndpointScanImage(flapFront, "obi-flap-front") }
    : {}),
  ...(isScan(front) ? { front: convertScanToEndpointScanImage(front, "obi-front") } : {}),
  ...(isScan(insideBack)
    ? { insideBack: convertScanToEndpointScanImage(insideBack, "obi-inside-back") }
    : {}),
  ...(isScan(insideFlapBack)
    ? { insideFlapBack: convertScanToEndpointScanImage(insideFlapBack, "obi-inside-flap-back") }
    : {}),
  ...(isScan(insideFlapFront)
    ? { insideFlapFront: convertScanToEndpointScanImage(insideFlapFront, "obi-inside-flap-front") }
    : {}),
  ...(isScan(insideFront)
    ? { insideFront: convertScanToEndpointScanImage(insideFront, "obi-inside-front") }
    : {}),
  ...(isScan(spine) ? { spine: convertScanToEndpointScanImage(spine, "obi-spine") } : {}),
  ...(isScan(insideSpine)
    ? { insideSpine: convertScanToEndpointScanImage(insideSpine, "obi-inside-spine") }
    : {}),
});
