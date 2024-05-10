import payload from "payload";
import { Collections } from "../../../constants";
import { EndpointCollectibleGalleryImage } from "../../../sdk";
import { Collectible, Image } from "../../../types/collections";
import { CollectionEndpoint } from "../../../types/payload";
import { isDefined, isNotEmpty, isPayloadType, isValidPayloadImage } from "../../../utils/asserts";
import { convertSourceToEndpointSource } from "../../../utils/endpoints";
import { convertImageToEndpointImage } from "../../Images/endpoints/getByID";

export const getBySlugEndpointGalleryImage: CollectionEndpoint = {
  path: "/slug/:slug/gallery/:index",
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

    if (!collectible || !collectible.gallery) {
      return res.sendStatus(404);
    }

    const image = getImageFromIndex(index, collectible.gallery);

    if (!image || !isValidPayloadImage(image)) {
      return res.sendStatus(404);
    }

    const previousIndex = getPreviousIndex(index);
    const nextIndex = getNextIndex(index, collectible.gallery);

    const scanPage: EndpointCollectibleGalleryImage = {
      image: convertImageToEndpointImage(image),
      parentPages: convertSourceToEndpointSource({ gallery: [collectible] }),
      slug,
      ...(isValidPayloadImage(collectible.thumbnail)
        ? { thumbnail: convertImageToEndpointImage(collectible.thumbnail) }
        : {}),
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

const getPreviousIndex = (index: string): string | undefined => {
  const pageIndex = parseInt(index, 10);
  if (isNaN(pageIndex)) return;
  if (pageIndex <= 0) return;
  return (pageIndex - 1).toString();
};

const getNextIndex = (
  index: string,
  gallery: NonNullable<Collectible["gallery"]>
): string | undefined => {
  const pageIndex = parseInt(index, 10);
  if (isNaN(pageIndex)) return;
  if (pageIndex >= gallery.length - 1) return;
  return (pageIndex + 1).toString();
};

const getImageFromIndex = (
  index: string,
  gallery: NonNullable<Collectible["gallery"]>
): string | Image | null | undefined => {
  const pageIndex = parseInt(index, 10);
  if (isNaN(pageIndex)) return;

  const page = gallery[pageIndex];
  if (!page) return;

  return page.image;
};
