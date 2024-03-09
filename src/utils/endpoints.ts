import { Collections } from "../constants";
import { EndpointRecorder, ParentPage, TagGroup } from "../sdk";
import { Collectible, Folder, Recorder, Tag } from "../types/collections";
import { isPayloadArrayType, isPayloadType, isValidPayloadImage } from "./asserts";

export const convertTagsToGroups = (tags: (string | Tag)[] | null | undefined): TagGroup[] => {
  if (!isPayloadArrayType(tags)) {
    return [];
  }

  const groups: TagGroup[] = [];

  tags.forEach(({ group, slug }) => {
    if (isPayloadType(group)) {
      const existingGroup = groups.find((existingGroup) => existingGroup.slug === group.slug);
      if (existingGroup) {
        existingGroup.values.push(slug);
      } else {
        groups.push({
          slug: group.slug,
          icon: group.icon ?? "material-symbols:category-outline",
          values: [slug],
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
    collectibles.forEach(({ slug, translations }) => {
      result.push({
        collection: Collections.Collectibles,
        slug,
        translations: translations.map(({ language, title }) => ({
          language: isPayloadType(language) ? language.id : language,
          name: title, // TODO: Use the entire pretitle + title + subtitle
        })),
        tag: "collectible",
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
        tag: "folders",
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
