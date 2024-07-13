import { convertAudioToEndpointAudioPreview } from "src/collections/Audios/endpoints/getByID";
import { convertCollectibleToEndpointCollectiblePreview } from "src/collections/Collectibles/endpoints/getBySlugEndpoint";
import { convertFileToEndpointFilePreview } from "src/collections/Files/endpoints/getByID";
import { convertImageToEndpointImagePreview } from "src/collections/Images/endpoints/getByID";
import { convertPageToEndpointPagePreview } from "src/collections/Pages/endpoints/getBySlugEndpoint";
import { convertVideoToEndpointVideoPreview } from "src/collections/Videos/endpoints/getByID";
import { createGetByEndpoint } from "src/endpoints/createGetByEndpoint";
import { Collections } from "src/shared/payload/constants";
import { EndpointFolderPreview, EndpointFolder } from "src/shared/payload/endpoint-types";
import { Folder, Language } from "src/types/collections";
import {
  isDefined,
  isNotEmpty,
  isPayloadType,
  isPublished,
  isImage,
  isAudio,
  isVideo,
  isFile,
} from "src/utils/asserts";
import { getLanguageId, convertSourceToEndpointSource } from "src/utils/endpoints";

export const getBySlugEndpoint = createGetByEndpoint({
  collection: Collections.Folders,
  attribute: "slug",
  depth: 3,
  handler: (folder) => convertFolderToEndpointFolder(folder),
});

export const convertFolderToEndpointFolderPreview = ({
  id,
  slug,
  icon,
  translations,
}: Folder): EndpointFolderPreview => ({
  id,
  slug,
  ...(isDefined(icon) ? { icon } : {}),
  translations:
    translations?.map(({ language, name }) => ({
      language: getLanguageId(language),
      title: name,
    })) ?? [],
});

const convertFolderToEndpointFolder = (folder: Folder): EndpointFolder => {
  const { translations, sections, files, parentFolders } = folder;

  return {
    ...convertFolderToEndpointFolderPreview(folder),
    translations:
      translations?.map(({ language, name, description }) => ({
        language: getLanguageId(language),
        title: name,
        ...(isNotEmpty(description) ? { description } : {}),
      })) ?? [],
    sections:
      sections?.length === 1
        ? {
            type: "single",
            subfolders:
              sections[0]?.subfolders
                ?.filter(isPayloadType)
                .map(convertFolderToEndpointFolderPreview) ?? [],
          }
        : {
            type: "multiple",
            sections:
              sections?.filter(isValidSection).map(({ translations, subfolders }) => ({
                translations: translations.map(({ language, name }) => ({
                  language: getLanguageId(language),
                  name,
                })),
                subfolders: subfolders.map(convertFolderToEndpointFolderPreview),
              })) ?? [],
          },
    files:
      files?.flatMap<EndpointFolder["files"][number]>(({ relationTo, value }) => {
        if (!isPayloadType(value) || ("_status" in value && !isPublished(value))) {
          return [];
        }

        switch (relationTo) {
          case Collections.Collectibles:
            return [
              {
                relationTo: Collections.Collectibles,
                value: convertCollectibleToEndpointCollectiblePreview(value),
              },
            ];
          case Collections.Pages:
            return [
              { relationTo: Collections.Pages, value: convertPageToEndpointPagePreview(value) },
            ];
          case Collections.Images:
            if (!isImage(value)) return [];
            return [
              { relationTo: Collections.Images, value: convertImageToEndpointImagePreview(value) },
            ];
          case Collections.Audios:
            if (!isAudio(value)) return [];
            return [
              { relationTo: Collections.Audios, value: convertAudioToEndpointAudioPreview(value) },
            ];
          case Collections.Videos:
            if (!isVideo(value)) return [];
            return [
              { relationTo: Collections.Videos, value: convertVideoToEndpointVideoPreview(value) },
            ];
          case Collections.Files:
            if (!isFile(value)) return [];
            return [
              { relationTo: Collections.Files, value: convertFileToEndpointFilePreview(value) },
            ];
          default:
            return [];
        }
      }) ?? [],
    parentPages: convertSourceToEndpointSource({ folders: parentFolders }),
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
