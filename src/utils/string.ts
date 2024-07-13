import tags from "language-tags";
import { isUndefined } from "./asserts";
import { RichTextContent } from "../shared/payload/rich-text";

export const shortenEllipsis = (text: string, length: number): string =>
  text.length - 3 > length ? `${text.substring(0, length)}...` : text;

export const formatLanguageCode = (code: string): string =>
  tags(code).valid() ? tags(code).language()?.descriptions()[0] ?? code : code;

export const capitalize = (string: string): string => {
  const [firstLetter, ...otherLetters] = string;
  if (isUndefined(firstLetter)) return "";
  return [firstLetter.toUpperCase(), ...otherLetters].join("");
};

const formatToCamelCase = (name: string): string =>
  name
    .toLowerCase()
    .split(/[ \_-]/g)
    .map((part, index) => (index > 0 ? capitalize(part) : part))
    .join("");

export const formatToPascalCase = (name: string): string => capitalize(formatToCamelCase(name));

export const plainTextToLexical = (text: string): RichTextContent => ({
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text,
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
  },
});
