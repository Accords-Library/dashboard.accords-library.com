import { UploadField } from "payload/types";
import { Images } from "../../collections/Images/Images";
import { Cell } from "./Cell";

type Props = Omit<UploadField, "type" | "relationTo">;

export const imageField = ({ admin, ...otherProps }: Props): UploadField => ({
  ...otherProps,
  type: "upload",
  relationTo: Images.slug,
  admin: {
    components: {
      Cell,
    },
    ...admin,
  },
});
