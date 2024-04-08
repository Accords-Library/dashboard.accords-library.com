import { RowLabelArgs } from "payload/dist/admin/components/forms/RowLabel/types";
import { array } from "payload/dist/fields/validations";
import { ArrayField, Field } from "payload/types";
import { Collections } from "../../constants";
import { hasDuplicates, isDefined, isUndefined } from "../../utils/asserts";
import { rowField } from "../rowField/rowField";
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
  };
};
type ArrayData = { [fieldsNames.language]?: string }[] | number | undefined;

const languageField: Field = {
  name: fieldsNames.language,
  type: "relationship",
  relationTo: Collections.Languages,
  required: true,
  admin: { allowCreate: false },
};

const sourceLanguageField: Field = {
  name: fieldsNames.sourceLanguage,
  type: "relationship",
  relationTo: Collections.Languages,
  required: true,
  admin: { allowCreate: false },
};

type FieldData = Record<string, any> & { [fieldsNames.language]: string };

export const translatedFields = ({
  fields,
  validate,
  admin: { useAsTitle, hasSourceLanguage, ...admin } = {},
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
    rowField(hasSourceLanguage ? [languageField, sourceLanguageField] : [languageField]),
    ...fields,
  ],
});
