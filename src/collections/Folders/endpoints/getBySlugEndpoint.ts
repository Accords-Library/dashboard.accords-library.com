import { Collections } from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointFolder, EndpointFolderPreview, PayloadImage } from "../../../sdk";
import { Folder, FoldersThumbnail, Language } from "../../../types/collections";
import { isDefined, isUndefined, isValidPayloadImage } from "../../../utils/asserts";

export const getBySlugEndpoint = createGetByEndpoint(
  Collections.Folders,
  "slug",
  (folder: Folder): EndpointFolder => {
    return {
      ...convertFolderToPreview(folder),
      sections:
        folder.sections?.length === 1
          ? {
              type: "single",
              subfolders:
                folder.sections[0]?.subfolders?.filter(isValidFolder).map(convertFolderToPreview) ??
                [],
            }
          : {
              type: "multiple",
              sections:
                folder.sections?.filter(isValidSection).map(({ translations, subfolders }) => ({
                  translations: translations.map(({ language, name }) => ({
                    language: getLanguageId(language),
                    name,
                  })),
                  subfolders: subfolders.map(convertFolderToPreview),
                })) ?? [],
            },
    };
  }
);

export const convertFolderToPreview = ({
  slug,
  darkThumbnail,
  lightThumbnail,
  translations,
  icon,
}: Folder): EndpointFolderPreview => {
  return {
    slug,
    ...(isDefined(icon) ? { icon } : {}),
    translations:
      translations?.map(({ language, name, description }) => ({
        language: getLanguageId(language),
        name,
        description: JSON.stringify(description),
      })) ?? [],
    darkThumbnail: getThumbnail(darkThumbnail),
    lightThumbnail: getThumbnail(lightThumbnail),
  };
};

const isValidSection = (section: {
  translations?:
    | {
        language: string | Language;
        name: string;
        id?: string | null;
      }[]
    | null;
  subfolders?: (string | Folder)[] | null | undefined;
}): section is {
  translations: {
    language: string | Language;
    name: string;
    id?: string | null;
  }[];
  subfolders: Folder[];
} => {
  if (!section.translations) {
    return false;
  }
  if (!section.subfolders) {
    return false;
  }
  return section.subfolders.every(isValidFolder);
};

export const isValidFolder = (folder: string | Folder): folder is Folder =>
  typeof folder !== "string";

const getThumbnail = (
  thumbnail: string | FoldersThumbnail | null | undefined
): PayloadImage | undefined => {
  if (isUndefined(thumbnail)) return undefined;
  if (typeof thumbnail === "string") return undefined;
  if (!isValidPayloadImage(thumbnail)) return undefined;
  return thumbnail;
};

const getLanguageId = (language: string | Language) =>
  typeof language === "object" ? language.id : language;
