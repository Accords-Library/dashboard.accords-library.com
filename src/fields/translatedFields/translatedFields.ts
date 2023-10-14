import { RowLabelArgs } from "payload/dist/admin/components/forms/RowLabel/types";
import { array } from "payload/dist/fields/validations";
import { ArrayField, Field } from "payload/types";
import { Collections } from "../../constants";
import { hasDuplicates, isDefined, isUndefined } from "../../utils/asserts";
import { Cell } from "./Cell";
import { RowLabel } from "./RowLabel";

const fieldsNames = {
  language: "language",
  sourceLanguage: "sourceLanguage",
  transcribers: "transcribers",
  translators: "translators",
  proofreaders: "proofreaders",
} as const satisfies Record<string, string>;

type LocalizedFieldsProps = Omit<ArrayField, "type" | "admin"> & {
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
  admin: { allowCreate: false, width: "0%" },
};

const sourceLanguageField: Field = {
  name: fieldsNames.sourceLanguage,
  type: "relationship",
  relationTo: Collections.Languages,
  required: true,
  admin: { allowCreate: false, width: "0%" },
};

const creditFields: Field = {
  type: "row",
  admin: {
    condition: (_, siblingData) =>
      isDefined(siblingData[fieldsNames.language]) &&
      isDefined(siblingData[fieldsNames.sourceLanguage]),
  },
  fields: [
    {
      name: fieldsNames.transcribers,
      label: "Transcribers",
      type: "relationship",
      relationTo: "recorders",
      hasMany: true,
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            if (siblingData[fieldsNames.language] !== siblingData[fieldsNames.sourceLanguage]) {
              delete siblingData[fieldsNames.transcribers];
            }
          },
        ],
      },
      admin: {
        condition: (_, siblingData) => siblingData.language === siblingData.sourceLanguage,
        width: "0%",
      },
      validate: (count, { siblingData }) => {
        if (siblingData[fieldsNames.language] !== siblingData[fieldsNames.sourceLanguage]) {
          return true;
        }
        if (isDefined(count) && count.length > 0) {
          return true;
        }
        return `This field is required when the ${fieldsNames.language} \
        is the same as the ${fieldsNames.sourceLanguage}.`;
      },
    },
    {
      name: fieldsNames.translators,
      label: "Translators",
      type: "relationship",
      relationTo: "recorders",
      hasMany: true,
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            if (siblingData[fieldsNames.language] === siblingData[fieldsNames.sourceLanguage]) {
              delete siblingData[fieldsNames.translators];
            }
          },
        ],
      },
      admin: {
        condition: (_, siblingData) =>
          siblingData[fieldsNames.language] !== siblingData[fieldsNames.sourceLanguage],
        width: "0%",
      },
      validate: (count, { siblingData }) => {
        if (siblingData[fieldsNames.language] === siblingData[fieldsNames.sourceLanguage]) {
          return true;
        }
        if (isDefined(count) && count.length > 0) {
          return true;
        }
        return `This field is required when the ${fieldsNames.language} \
        is different from the ${fieldsNames.sourceLanguage}.`;
      },
    },
    {
      name: fieldsNames.proofreaders,
      label: "Proofreaders",
      type: "relationship",
      relationTo: "recorders",
      hasMany: true,
      admin: { width: "0%" },
    },
  ],
};

type FieldData = Record<string, any> & { [fieldsNames.language]: string };

export const translatedFields = ({
  fields,
  validate,
  admin: { useAsTitle, hasSourceLanguage, hasCredits, ...admin } = {},
  ...otherProps
}: LocalizedFieldsProps): ArrayField => ({
  ...otherProps,
  type: "array",
  admin: {
    initCollapsed: true,
    components: {
      Cell: ({ cellData }: { cellData: FieldData[] }) =>
        Cell({
          cellData:
            cellData?.map((row) => ({
              language: row[fieldsNames.language],
              title: isDefined(useAsTitle) ? row[useAsTitle] : undefined,
            })) ?? [],
        }),
      RowLabel: ({ data }: RowLabelArgs) =>
        RowLabel({
          language: data[fieldsNames.language],
          title: isDefined(useAsTitle) ? data[useAsTitle] : undefined,
        }),
    },
    ...admin,
  },
  validate: (value, options) => {
    const defaultValidation = array(value, options);
    if (defaultValidation !== true) return defaultValidation;

    if (isDefined(validate)) {
      const propsValidation = validate(value, options);
      if (propsValidation !== true) return propsValidation;
    }

    const data = options.data[otherProps.name] as ArrayData;
    if (isUndefined(data)) return true;
    if (typeof data === "number") return true;

    const languages = data.map((rows) => rows[fieldsNames.language]);
    if (hasDuplicates(languages)) {
      return `There cannot be multiple ${otherProps.name} with the same ${fieldsNames.language}`;
    }

    return true;
  },
  fields: [
    hasSourceLanguage
      ? { type: "row", fields: [languageField, sourceLanguageField] }
      : languageField,
    ...fields,
    ...(hasCredits ? [creditFields] : []),
  ],
});
