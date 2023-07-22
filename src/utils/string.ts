import ISO6391 from "iso-639-1";

export const shortenEllipsis = (text: string, length: number): string =>
  text.length - 3 > length ? `${text.substring(0, length)}...` : text;

export const formatLanguageCode = (code: string): string =>
  ISO6391.validate(code) ? ISO6391.getName(code) : code;