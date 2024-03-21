import { Collections } from "../constants";
import { EndpointRecorder, EndpointTag, EndpointTagsGroup, ParentPage } from "../sdk";
import { Collectible, Folder, Recorder, Tag } from "../types/collections";
import { isPayloadArrayType, isPayloadType, isPublished, isValidPayloadImage } from "./asserts";

export const convertTagsToGroups = (
  tags: (string | Tag)[] | null | undefined
): EndpointTagsGroup[] => {
  if (!isPayloadArrayType(tags)) {
    return [];
  }

  const groups: EndpointTagsGroup[] = [];

  tags.forEach(({ translations, slug, group }) => {
    if (isPayloadType(group)) {
      const existingGroup = groups.find((existingGroup) => existingGroup.slug === group.slug);

      const endpointTag: EndpointTag = {
        slug,
        translations: translations.map(({ language, name }) => ({
          language: isPayloadType(language) ? language.id : language,
          name,
        })),
      };

      if (existingGroup) {
        existingGroup.tags.push(endpointTag);
      } else {
        groups.push({
          slug: group.slug,
          icon: group.icon ?? "material-symbols:category-outline",
          tags: [endpointTag],
          translations: group.translations.map(({ language, name }) => ({
            language: isPayloadType(language) ? language.id : language,
            name,
          })),
        });
      }
    }
  });

  return groups;
};

export const handleParentPages = ({
  collectibles,
  folders,
}: {
  collectibles?: (string | Collectible)[] | null | undefined;
  folders?: (string | Folder)[] | null | undefined;
}): ParentPage[] => {
  const result: ParentPage[] = [];

  if (collectibles && isPayloadArrayType(collectibles)) {
    collectibles.filter(isPublished).forEach(({ slug, translations }) => {
      result.push({
        collection: Collections.Collectibles,
        slug,
        translations: translations.map(({ language, title }) => ({
          language: isPayloadType(language) ? language.id : language,
          name: title, // TODO: Use the entire pretitle + title + subtitle
        })),
      });
    });
  }

  if (folders && isPayloadArrayType(folders)) {
    folders.forEach(({ slug, translations }) => {
      result.push({
        collection: Collections.Folders,
        slug,
        translations:
          translations?.map(({ language, name }) => ({
            language: isPayloadType(language) ? language.id : language,
            name,
          })) ?? [],
      });
    });
  }

  return result;
};

export const handleRecorder = ({
  id,
  biographies,
  languages,
  username,
  avatar,
  anonymize,
}: Recorder): EndpointRecorder => ({
  id,
  biographies:
    biographies?.map(({ biography, language }) => ({
      biography,
      language: isPayloadType(language) ? language.id : language,
    })) ?? [],
  languages: languages?.map((language) => (isPayloadType(language) ? language.id : language)) ?? [],
  username: anonymize ? `Recorder#${id.substring(0, 5)}` : username,
  ...(isValidPayloadImage(avatar) ? { avatar } : {}),
});

export const getDomainFromUrl = (url: string): string => {
  const urlObject = new URL(url);
  let domain = urlObject.hostname;
  if (domain.startsWith("www.")) {
    domain = domain.substring("www.".length);
  }
  return domain;
};
