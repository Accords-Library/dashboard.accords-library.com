import { CollectionBeforeValidateHook } from "payload/types";
import { FileTypes } from "../../../constants";
import { File } from "../../../types/collections";
import { isUndefined } from "../../../utils/asserts";

const reshareSubFolderFromType: Record<keyof typeof FileTypes, string> = {
  ContentAudio: "/contents/audios",
  ContentVideo: "/contents/videos",
  LibraryScans: "/library/scans",
  LibrarySoundtracks: "/library/tracks",
};

const expectedMimeFromType = {
  ContentAudio: "audio/",
  ContentVideo: "video/",
  LibraryScans: "application/zip",
  LibrarySoundtracks: "audio/",
};

export const generatePathForFile = (type: keyof typeof FileTypes, filename: string) =>
  `https://resha.re/accords${reshareSubFolderFromType[type]}/${filename}`;

export const beforeValidateCheckFileExists: CollectionBeforeValidateHook<File> = async ({
  data,
}) => {
  if (isUndefined(data)) throw new Error("The data is undefined");
  const { type, filename } = data;
  if (isUndefined(filename)) throw new Error("Filename is undefined");
  if (isUndefined(type)) throw new Error("Filename is undefined");

  const url = generatePathForFile(type, filename);

  const result = await fetch(url, { method: "HEAD" });

  if (result.status !== 200) {
    throw new Error(`Unable to locate the file at the following address: ${url}`);
  }

  const contentType = result.headers.get("content-type");
  if (isUndefined(contentType) || !contentType.startsWith(expectedMimeFromType[type])) {
    throw new Error(
      `Wrong MIME type found: ${contentType}. The expected MIME type was ${expectedMimeFromType[type]}`
    );
  }
};
