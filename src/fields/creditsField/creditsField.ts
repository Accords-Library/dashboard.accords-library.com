import { array } from "payload/dist/fields/validations";
import { ArrayField } from "payload/types";
import { rowField } from "src/fields/rowField/rowField";
import { Collections } from "src/shared/payload/constants";
import { Credits } from "src/types/collections";
import { isDefined, isUndefined, isPayloadType, hasDuplicates } from "src/utils/asserts";

type Props = Omit<ArrayField, "type" | "fields">;

export const creditsField = ({ validate, admin, ...props }: Props): ArrayField => ({
  ...props,
  type: "array",
  admin: { initCollapsed: true, ...admin },
  interfaceName: "Credits",
  validate: (value, options) => {
    const defaultValidation = array(value, options);
    if (defaultValidation !== true) return defaultValidation;

    if (isDefined(validate)) {
      const propsValidation = validate(value, options);
      if (propsValidation !== true) return propsValidation;
    }

    const data = options.data[props.name] as Credits | undefined | null;
    if (isUndefined(data) || typeof data !== "object") return true;

    const roles = data.map((row) => (isPayloadType(row.role) ? row.role.id : row.role));
    if (hasDuplicates(roles)) {
      return `There cannot be multiple ${props.name} with the same role`;
    }

    return true;
  },
  fields: [
    rowField([
      { name: "role", type: "relationship", relationTo: Collections.CreditsRole, required: true },
      {
        name: "recorders",
        type: "relationship",
        relationTo: Collections.Recorders,
        required: true,
        hasMany: true,
      },
    ]),
  ],
});
