import { ArrayField } from "payload/types";
import { hasDuplicates } from "./validation";
import { isDefined, isUndefined } from "./asserts";
import { Languages } from "../collections/Languages";

const LANGUAGE_FIELD_NAME = "language";

type LocalizedFieldsProps = Omit<ArrayField, "type">;
type ArrayData = { [LANGUAGE_FIELD_NAME]?: string }[] | number | undefined;

export const localizedFields = ({
  fields,
  validate,
  ...otherProps
}: LocalizedFieldsProps): ArrayField => ({
  ...otherProps,
  type: "array",
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
