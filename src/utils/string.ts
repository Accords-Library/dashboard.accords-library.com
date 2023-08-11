import tags from "language-tags";

export const shortenEllipsis = (text: string, length: number): string =>
  text.length - 3 > length ? `${text.substring(0, length)}...` : text;

export const formatLanguageCode = (code: string): string =>
  tags(code).valid() ? tags(code).language().descriptions()[0] : code;

export const capitalize = (string: string): string => {
  const [firstLetter, ...otherLetters] = string;
  return [firstLetter.toUpperCase(), ...otherLetters].join("");
};

export const formatToCamelCase = (name: string): string =>
  name
    .toLowerCase()
    .split(/[ \_-]/g)
    .map((part, index) => (index > 0 ? capitalize(part) : part))
    .join("");

export const formatToKebabCase = (name: string): string =>
  name.toLowerCase().replaceAll(/[ \_]/g, "-");
