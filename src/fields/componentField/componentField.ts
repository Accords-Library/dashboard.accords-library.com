import { CollapsibleField, Condition, Field } from "payload/types";
import { capitalize } from "src/utils/string";

type Props = {
  name: string;
  label?: string;
  admin?: {
    description?: string;
    condition?: Condition;
  };
  fields: Field[];
};

export const componentField = ({
  name,
  fields,
  label = capitalize(name),
  admin,
}: Props): CollapsibleField => {
  return {
    type: "collapsible",
    label: name,
    admin: { className: "component-field", condition: admin?.condition },
    fields: [
      {
        name: `${name}Enabled`,
        label,
        type: "checkbox",
        admin: {
          className: "component-field-checkbox",
          description: admin?.description,
        },
      },
      {
        name,
        type: "group",
        hooks: {
          beforeChange: [
            ({ siblingData }) => {
              if (!siblingData[`${name}Enabled`]) {
                delete siblingData[name];
              }
            },
          ],
        },
        admin: {
          className: "component-field-group",
          condition: (_, siblingData) => siblingData[`${name}Enabled`],
          hideGutter: true,
        },
        fields,
      },
    ],
  };
};
