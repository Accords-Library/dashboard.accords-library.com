import { Collections } from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointCollectibleScans } from "../../../sdk";
import { Collectible } from "../../../types/collections";
import { isNotEmpty, isPayloadType, isValidPayloadImage } from "../../../utils/asserts";
import {
  convertCreditsToEndpointCredits,
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
      isValidPayloadImage(image) ? { ...image, index: page.toString() } : []
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
  ...(isValidPayloadImage(back) ? { back: { ...back, index: "cover-back" } } : {}),
  ...(isValidPayloadImage(flapBack) ? { flapBack: { ...flapBack, index: "cover-flap-back" } } : {}),
  ...(isValidPayloadImage(flapFront)
    ? { flapFront: { ...flapFront, index: "cover-flap-front" } }
    : {}),
  ...(isValidPayloadImage(front) ? { front: { ...front, index: "cover-front" } } : {}),
  ...(isValidPayloadImage(insideBack)
    ? { insideBack: { ...insideBack, index: "cover-inside-back" } }
    : {}),
  ...(isValidPayloadImage(insideFlapBack)
    ? { insideFlapBack: { ...insideFlapBack, index: "cover-inside-flap-back" } }
    : {}),
  ...(isValidPayloadImage(insideFlapFront)
    ? { insideFlapFront: { ...insideFlapFront, index: "cover-inside-flap-front" } }
    : {}),
  ...(isValidPayloadImage(insideFront)
    ? { insideFront: { ...insideFront, index: "cover-inside-front" } }
    : {}),
  ...(isValidPayloadImage(spine) ? { spine: { ...spine, index: "cover-spine" } } : {}),
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
  ...(isValidPayloadImage(back) ? { back: { ...back, index: "dustjacket-back" } } : {}),
  ...(isValidPayloadImage(flapBack)
    ? { flapBack: { ...flapBack, index: "dustjacket-flap-back" } }
    : {}),
  ...(isValidPayloadImage(flapFront)
    ? { flapFront: { ...flapFront, index: "dustjacket-flap-front" } }
    : {}),
  ...(isValidPayloadImage(front) ? { front: { ...front, index: "dustjacket-front" } } : {}),
  ...(isValidPayloadImage(insideBack)
    ? { insideBack: { ...insideBack, index: "dustjacket-inside-back" } }
    : {}),
  ...(isValidPayloadImage(insideFlapBack)
    ? { insideFlapBack: { ...insideFlapBack, index: "dustjacket-inside-flap-back" } }
    : {}),
  ...(isValidPayloadImage(insideFlapFront)
    ? { insideFlapFront: { ...insideFlapFront, index: "dustjacket-inside-flap-front" } }
    : {}),
  ...(isValidPayloadImage(insideFront)
    ? { insideFront: { ...insideFront, index: "dustjacket-inside-front" } }
    : {}),
  ...(isValidPayloadImage(spine) ? { spine: { ...spine, index: "dustjacket-spine" } } : {}),
  ...(isValidPayloadImage(insideSpine)
    ? { insideSpine: { ...insideSpine, index: "dustjacket-inside-spine" } }
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
  ...(isValidPayloadImage(back) ? { back: { ...back, index: "obi-back" } } : {}),
  ...(isValidPayloadImage(flapBack) ? { flapBack: { ...flapBack, index: "obi-flap-back" } } : {}),
  ...(isValidPayloadImage(flapFront)
    ? { flapFront: { ...flapFront, index: "obi-flap-front" } }
    : {}),
  ...(isValidPayloadImage(front) ? { front: { ...front, index: "obi-front" } } : {}),
  ...(isValidPayloadImage(insideBack)
    ? { insideBack: { ...insideBack, index: "obi-inside-back" } }
    : {}),
  ...(isValidPayloadImage(insideFlapBack)
    ? { insideFlapBack: { ...insideFlapBack, index: "obi-inside-flap-back" } }
    : {}),
  ...(isValidPayloadImage(insideFlapFront)
    ? { insideFlapFront: { ...insideFlapFront, index: "obi-inside-flap-front" } }
    : {}),
  ...(isValidPayloadImage(insideFront)
    ? { insideFront: { ...insideFront, index: "obi-inside-front" } }
    : {}),
  ...(isValidPayloadImage(spine) ? { spine: { ...spine, index: "obi-spine" } } : {}),
  ...(isValidPayloadImage(insideSpine)
    ? { insideSpine: { ...insideSpine, index: "obi-inside-spine" } }
    : {}),
});
