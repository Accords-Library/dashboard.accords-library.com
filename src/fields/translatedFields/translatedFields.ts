import { array } from "payload/dist/fields/validations";
import { ArrayField, Field } from "payload/types";
import { Collections } from "../../constants";
import { isDefined, isUndefined } from "../../utils/asserts";
import { hasDuplicates } from "../../utils/validation";
import { Cell } from "./Cell";
import { RowLabel } from "./RowLabel";

const fieldsNames = {
  language: "language",
  sourceLanguage: "sourceLanguage",
  transcribers: "transcribers",
  translators: "translators",
  proofreaders: "proofreaders",
} as const satisfies Record<string, string>;

type LocalizedFieldsProps = Omit<ArrayField, "type" | "admin" | "validate"> & {
  admin?: ArrayField["admin"] & {
    useAsTitle?: string;
    hasSourceLanguage?: boolean;
    hasCredits?: boolean;
  };
};
type ArrayData = { [fieldsNames.language]?: string }[] | number | undefined;

const languageField: Field = {
  name: fieldsNames.language,
  type: "relationship",
  relationTo: Collections.Languages,
  required: true,
  admin: { allowCreate: false, width: "50%" },
};

const sourceLanguageField: Field = {
  name: fieldsNames.sourceLanguage,
  type: "relationship",
  relationTo: Collections.Languages,
  required: true,
  admin: { allowCreate: false, width: "50%" },
};

const creditFields: Field = {
  type: "row",
  admin: {
    condition: (_, siblingData) =>
      isDefined(siblingData.language) && isDefined(siblingData.sourceLanguage),
  },
  fields: [
    {
      name: fieldsNames.transcribers,
      label: "Transcribers",
      type: "relationship",
      relationTo: "recorders",
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData.language === siblingData.sourceLanguage,
        width: "50%",
      },
      validate: (count, { siblingData }) => {
        if (siblingData.language !== siblingData.sourceLanguage) {
          return true;
        }
        if (isDefined(count) && count.length > 0) {
          return true;
        }
        return "This field is required when the language is the same as the source language.";
      },
    },
    {
      name: fieldsNames.translators,
      label: "Translators",
      type: "relationship",
      relationTo: "recorders",
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData.language !== siblingData.sourceLanguage,
        width: "50%",
      },
      validate: (count, { siblingData }) => {
        if (siblingData.language === siblingData.sourceLanguage) {
          return true;
        }
        if (isDefined(count) && count.length > 0) {
          return true;
        }
        return "This field is required when the language is different from the source language.";
      },
    },
    {
      name: fieldsNames.proofreaders,
      label: "Proofreaders",
      type: "relationship",
      relationTo: "recorders",
      hasMany: true,
      admin: { width: "50%" },
    },
  ],
};

export const localizedFields = ({
  fields,
  admin: { useAsTitle, hasSourceLanguage, hasCredits, ...admin } = {},
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
    const defaultValidation = array(value, options);
    if (defaultValidation !== true) return defaultValidation;

    const data = options.data[otherProps.name] as ArrayData;
    if (isUndefined(data)) return true;
    if (typeof data === "number") return true;

    const languages = data.map((biography) => biography.language);
    if (hasDuplicates(languages)) {
      return `There cannot be multiple ${otherProps.name} with the same ${fieldsNames.language}`;
    }
  },
  fields: [
    hasSourceLanguage
      ? { type: "row", fields: [languageField, sourceLanguageField] }
      : languageField,
    ...fields,
    ...(hasCredits ? [creditFields] : []),
  ],
});
