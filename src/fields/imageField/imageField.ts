import { UploadField } from "payload/types";
import { Cell } from "./Cell";

type Props = Omit<UploadField, "type">;

export const imageField = ({ admin, ...otherProps }: Props): UploadField => ({
  ...otherProps,
  type: "upload",
  admin: {
    components: {
      Cell,
    },
    ...admin,
  },
});
