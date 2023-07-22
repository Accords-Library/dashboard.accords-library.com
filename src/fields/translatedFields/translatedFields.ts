import { ArrayField, Field } from "payload/types";
import { hasDuplicates } from "../../utils/validation";
import { isDefined, isUndefined } from "../../utils/asserts";
import { Languages } from "../../collections/Languages";
import { RowLabel } from "./RowLabel";
import { Cell } from "./Cell";

const fieldsNames = {
  language: "language",
  sourceLanguage: "sourceLanguage",
} as const satisfies Record<string, string>;

type LocalizedFieldsProps = Omit<ArrayField, "type" | "admin"> & {
  admin?: ArrayField["admin"] & { useAsTitle?: string; hasSourceLanguage?: boolean };
};
type ArrayData = { [fieldsNames.language]?: string }[] | number | undefined;

const languageField: Field = {
  name: fieldsNames.language,
  type: "relationship",
  relationTo: Languages.slug,
  required: true,
  admin: { allowCreate: false, width: "50%" },
};

const sourceLanguageField: Field = {
  name: fieldsNames.sourceLanguage,
  type: "relationship",
  relationTo: Languages.slug,
  required: true,
  admin: { allowCreate: false, width: "50%" },
};

export const localizedFields = ({
  fields,
  validate,
  admin: { useAsTitle, hasSourceLanguage, ...admin },
  ...otherProps
}: LocalizedFieldsProps): ArrayField => ({
  ...otherProps,
  type: "array",
  admin: {
    initCollapsed: true,
    components: {
      Cell: ({ cellData }) =>
        Cell({
          cellData:
            cellData?.map((row) => ({
              language: row.language,
              title: isDefined(useAsTitle) ? row[useAsTitle] : undefined,
            })) ?? [],
        }),
      RowLabel: ({ data }) =>
        RowLabel({
          language: data.language,
          title: isDefined(useAsTitle) ? data[useAsTitle] : undefined,
        }),
    },
    ...admin,
  },
  validate: (value, options) => {
    const data = options.data[otherProps.name] as ArrayData;
    if (isUndefined(data)) return true;
    if (typeof data === "number") return true;

    const languages = data.map((biography) => biography.language);
    if (hasDuplicates(languages)) {
      return `There cannot be multiple ${otherProps.name} with the same ${fieldsNames.language}`;
    }

    return isDefined(validate) ? validate(value, options) : true;
  },
  fields: [
    hasSourceLanguage
      ? { type: "row", fields: [languageField, sourceLanguageField] }
      : languageField,
    ...fields,
  ],
});
