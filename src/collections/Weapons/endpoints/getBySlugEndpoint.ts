import { Collections } from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointBasicWeapon, EndpointWeapon, PayloadImage } from "../../../sdk";
import { Key, Language, Recorder, Weapon, WeaponsThumbnail } from "../../../types/collections";
import { isDefined, isUndefined, isValidPayloadImage } from "../../../utils/asserts";

export const getBySlugEndpoint = createGetByEndpoint(
  Collections.Weapons,
  "slug",
  (weapon: Weapon): EndpointWeapon => {
    let group: EndpointWeapon["group"] = undefined;

    // We only send the group if the group has at least 2 weapons (1 weapon beside the current one)
    // The weapons are ordered alphabetically using their slugs
    if (
      typeof weapon.group === "object" &&
      isDefined(weapon.group.weapons) &&
      weapon.group.weapons.length > 1
    ) {
      const { slug, translations = [], weapons } = weapon.group;

      const groupWeapons: EndpointBasicWeapon[] = [];
      weapons.forEach((groupWeapon) => {
        if (typeof groupWeapon === "object" && groupWeapon.id !== weapon.id) {
          groupWeapons.push(convertWeaponToEndpointBasicWeapon(groupWeapon));
        }
      });

      groupWeapons.sort((a, b) => a.slug.localeCompare(b.slug));

      group = {
        slug,
        translations: translations.map(({ language, name }) => ({
          language: getLanguageId(language),
          name,
        })),
        weapons: groupWeapons,
      };
    }

    return {
      ...convertWeaponToEndpointBasicWeapon(weapon),
      appearances: weapon.appearances.map(({ categories, translations }) => ({
        categories: categories.map(getKeyId),
        translations: translations.map(
          ({
            language,
            sourceLanguage,
            transcribers = [],
            translators = [],
            proofreaders = [],
            ...otherTranslatedProps
          }) => ({
            language: getLanguageId(language),
            sourceLanguage: getLanguageId(sourceLanguage),
            transcribers: transcribers.map(getRecorderId),
            translators: translators.map(getRecorderId),
            proofreaders: proofreaders.map(getRecorderId),
            ...otherTranslatedProps,
          })
        ),
      })),
      group,
    };
  }
);

const getRecorderId = (recorder: string | Recorder) =>
  typeof recorder === "object" ? recorder.id : recorder;
const getKeyId = (key: string | Key) => (typeof key === "object" ? key.id : key);
const getLanguageId = (language: string | Language) =>
  typeof language === "object" ? language.id : language;

const getThumbnail = (thumbnail?: string | WeaponsThumbnail): WeaponsThumbnail | undefined => {
  if (isUndefined(thumbnail)) return undefined;
  if (typeof thumbnail === "string") return undefined;
  delete thumbnail.weapon;
  return thumbnail;
};

const getPayloadImage = (
  image: Partial<PayloadImage> | undefined,
  fallback: PayloadImage
): PayloadImage =>
  isValidPayloadImage(image)
    ? {
        filename: image.filename,
        height: image.height,
        mimeType: image.mimeType,
        width: image.width,
        url: image.url,
      }
    : {
        filename: fallback.filename,
        height: fallback.height,
        mimeType: fallback.mimeType,
        width: fallback.width,
        url: fallback.url,
      };

const convertWeaponToEndpointBasicWeapon = ({
  slug,
  thumbnail: rawThumbnail,
  type,
  appearances,
}: Weapon): EndpointBasicWeapon => {
  const categories = new Set<string>();
  appearances.forEach((appearance) =>
    appearance.categories.forEach((category) => categories.add(getKeyId(category)))
  );

  const languages = new Set<string>();
  appearances.forEach(({ translations }) =>
    translations.forEach(({ language }) => languages.add(getLanguageId(language)))
  );

  const translations: EndpointWeapon["translations"] = [...languages.values()].map(
    (targetLanguage) => {
      const names = new Set<string>();
      appearances.forEach(({ translations }) => {
        const translation = translations.find(
          ({ language }) => getLanguageId(language) === targetLanguage
        );
        if (translation) {
          names.add(translation.name);
        }
      });
      const [name, ...aliases] = names;

      if (isUndefined(name))
        throw new Error("A weapon should always have a name for each of its translatiion");

      return { language: targetLanguage, name: name, aliases };
    }
  );

  const thumbnail = getThumbnail(rawThumbnail);
  const images: EndpointBasicWeapon["images"] =
    isValidPayloadImage(thumbnail) && isDefined(thumbnail.sizes)
      ? {
          openGraph: getPayloadImage(thumbnail.sizes.og, thumbnail),
          previewCard: getPayloadImage(thumbnail.sizes.small, thumbnail),
          thumbnailHeader: getPayloadImage(thumbnail.sizes.medium, thumbnail),
          lightBox: getPayloadImage(thumbnail, thumbnail),
        }
      : undefined;

  return {
    slug,
    images,
    type: getKeyId(type),
    categories: [...categories.values()],
    translations,
  };
};
