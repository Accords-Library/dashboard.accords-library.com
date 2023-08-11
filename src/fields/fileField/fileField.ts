import { RelationshipField, UploadField } from "payload/types";
import { Collections } from "../../constants";

type Props = Omit<UploadField, "type" | "relationTo">;

export const fileField = (props: Props): RelationshipField => ({
  ...props,
  type: "relationship",
  relationTo: Collections.Files,
});
