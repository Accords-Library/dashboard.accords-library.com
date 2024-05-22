import { Collections } from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointCollectibleScans } from "../../../sdk";
import { Collectible } from "../../../types/collections";
import { isNotEmpty, isPayloadType, isValidPayloadImage } from "../../../utils/asserts";
import {
  convertCreditsToEndpointCredits,
  convertScanToEndpointScanImage,
  convertSourceToEndpointSource,
} from "../../../utils/endpoints";
import { convertImageToEndpointImage } from "../../Images/endpoints/getByID";

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
      ...(isValidPayloadImage(thumbnail)
        ? { thumbnail: convertImageToEndpointImage(thumbnail) }
        : {}),
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
      isValidPayloadImage(image) ? convertScanToEndpointScanImage(image, page.toString()) : []
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
  ...(isValidPayloadImage(back)
    ? { back: convertScanToEndpointScanImage(back, "cover-back") }
    : {}),
  ...(isValidPayloadImage(flapBack)
    ? { flapBack: convertScanToEndpointScanImage(flapBack, "cover-flap-back") }
    : {}),
  ...(isValidPayloadImage(flapFront)
    ? { flapFront: convertScanToEndpointScanImage(flapFront, "cover-flap-front") }
    : {}),
  ...(isValidPayloadImage(front)
    ? { front: convertScanToEndpointScanImage(front, "cover-front") }
    : {}),
  ...(isValidPayloadImage(insideBack)
    ? { insideBack: convertScanToEndpointScanImage(insideBack, "cover-inside-back") }
    : {}),
  ...(isValidPayloadImage(insideFlapBack)
    ? { insideFlapBack: convertScanToEndpointScanImage(insideFlapBack, "cover-inside-flap-back") }
    : {}),
  ...(isValidPayloadImage(insideFlapFront)
    ? {
        insideFlapFront: convertScanToEndpointScanImage(insideFlapFront, "cover-inside-flap-front"),
      }
    : {}),
  ...(isValidPayloadImage(insideFront)
    ? { insideFront: convertScanToEndpointScanImage(insideFront, "cover-inside-front") }
    : {}),
  ...(isValidPayloadImage(spine)
    ? { spine: convertScanToEndpointScanImage(spine, "cover-spine") }
    : {}),
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
  ...(isValidPayloadImage(back)
    ? { back: convertScanToEndpointScanImage(back, "dustjacket-back") }
    : {}),
  ...(isValidPayloadImage(flapBack)
    ? { flapBack: convertScanToEndpointScanImage(flapBack, "dustjacket-flap-back") }
    : {}),
  ...(isValidPayloadImage(flapFront)
    ? { flapFront: convertScanToEndpointScanImage(flapFront, "dustjacket-flap-front") }
    : {}),
  ...(isValidPayloadImage(front)
    ? { front: convertScanToEndpointScanImage(front, "dustjacket-front") }
    : {}),
  ...(isValidPayloadImage(insideBack)
    ? { insideBack: convertScanToEndpointScanImage(insideBack, "dustjacket-inside-back") }
    : {}),
  ...(isValidPayloadImage(insideFlapBack)
    ? {
        insideFlapBack: convertScanToEndpointScanImage(
          insideFlapBack,
          "dustjacket-inside-flap-back"
        ),
      }
    : {}),
  ...(isValidPayloadImage(insideFlapFront)
    ? {
        insideFlapFront: convertScanToEndpointScanImage(
          insideFlapFront,
          "dustjacket-inside-flap-front"
        ),
      }
    : {}),
  ...(isValidPayloadImage(insideFront)
    ? { insideFront: convertScanToEndpointScanImage(insideFront, "dustjacket-inside-front") }
    : {}),
  ...(isValidPayloadImage(spine)
    ? { spine: convertScanToEndpointScanImage(spine, "dustjacket-spine") }
    : {}),
  ...(isValidPayloadImage(insideSpine)
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
  ...(isValidPayloadImage(back) ? { back: convertScanToEndpointScanImage(back, "obi-back") } : {}),
  ...(isValidPayloadImage(flapBack)
    ? { flapBack: convertScanToEndpointScanImage(flapBack, "obi-flap-back") }
    : {}),
  ...(isValidPayloadImage(flapFront)
    ? { flapFront: convertScanToEndpointScanImage(flapFront, "obi-flap-front") }
    : {}),
  ...(isValidPayloadImage(front)
    ? { front: convertScanToEndpointScanImage(front, "obi-front") }
    : {}),
  ...(isValidPayloadImage(insideBack)
    ? { insideBack: convertScanToEndpointScanImage(insideBack, "obi-inside-back") }
    : {}),
  ...(isValidPayloadImage(insideFlapBack)
    ? { insideFlapBack: convertScanToEndpointScanImage(insideFlapBack, "obi-inside-flap-back") }
    : {}),
  ...(isValidPayloadImage(insideFlapFront)
    ? { insideFlapFront: convertScanToEndpointScanImage(insideFlapFront, "obi-inside-flap-front") }
    : {}),
  ...(isValidPayloadImage(insideFront)
    ? { insideFront: convertScanToEndpointScanImage(insideFront, "obi-inside-front") }
    : {}),
  ...(isValidPayloadImage(spine)
    ? { spine: convertScanToEndpointScanImage(spine, "obi-spine") }
    : {}),
  ...(isValidPayloadImage(insideSpine)
    ? { insideSpine: convertScanToEndpointScanImage(insideSpine, "obi-inside-spine") }
    : {}),
});
