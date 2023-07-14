import { ArrayField } from "payload/types";
import { hasDuplicates } from "../../utils/validation";
import { isDefined, isUndefined } from "../../utils/asserts";
import { Languages } from "../../collections/Languages";
import { RowLabel } from "./RowLabel";
import { Cell } from "./Cell";

const LANGUAGE_FIELD_NAME = "language";

type LocalizedFieldsProps = Omit<ArrayField, "type" | "admin"> & {
  admin?: ArrayField["admin"] & { useAsTitle?: string };
};
type ArrayData = { [LANGUAGE_FIELD_NAME]?: string }[] | number | undefined;

export const localizedFields = ({
  fields,
  validate,
  admin: { useAsTitle, ...admin },
  ...otherProps
}: LocalizedFieldsProps): ArrayField => ({
  ...otherProps,
  type: "array",
  admin: {
    initCollapsed: true,
    components: {
      Cell: ({ cellData }) =>
        Cell({
          cellData: cellData.map((row) => ({
            language: row.language,
            title: isDefined(useAsTitle) ? row[useAsTitle] : undefined,
          })),
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
      return `There cannot be multiple ${otherProps.name} with the same ${LANGUAGE_FIELD_NAME}`;
    }

    return isDefined(validate) ? validate(value, options) : true;
  },
  fields: [
    {
      name: LANGUAGE_FIELD_NAME,
      type: "relationship",
      relationTo: Languages.slug,
      required: true,
      admin: { allowCreate: false },
    },
    ...fields,
  ],
});
