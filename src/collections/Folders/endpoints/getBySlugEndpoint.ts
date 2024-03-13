import { Collections } from "../../../constants";
import { createGetByEndpoint } from "../../../endpoints/createGetByEndpoint";
import { EndpointFolder, EndpointFolderPreview } from "../../../sdk";
import { Folder, Language } from "../../../types/collections";
import { isDefined, isPayloadType } from "../../../utils/asserts";
import { convertCollectibleToPreview } from "../../Collectibles/endpoints/getBySlugEndpoint";
import { convertPageToPreview } from "../../Pages/endpoints/getBySlugEndpoint";

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
                folder.sections[0]?.subfolders?.filter(isPayloadType).map(convertFolderToPreview) ??
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
      files:
        folder.files?.flatMap<EndpointFolder["files"][number]>(({ relationTo, value }) => {
          if (!isPayloadType(value)) {
            return [];
          }
          switch (relationTo) {
            case "collectibles":
              return [{ relationTo, value: convertCollectibleToPreview(value) }];
            case "pages":
              return [{ relationTo, value: convertPageToPreview(value) }];
          }
        }) ?? [],
    };
  },
  3
);

export const convertFolderToPreview = ({
  slug,
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
        ...(description ? { description } : {}),
      })) ?? [],
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
  return section.subfolders.every(isPayloadType);
};

const getLanguageId = (language: string | Language) =>
  typeof language === "object" ? language.id : language;
