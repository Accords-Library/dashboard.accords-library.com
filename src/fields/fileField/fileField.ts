import { RelationshipField, UploadField } from "payload/types";
import { Files } from "../../collections/Files/Files";

type Props = Omit<UploadField, "type" | "relationTo">;

export const fileField = (props: Props): RelationshipField => ({
  ...props,
  type: "relationship",
  relationTo: Files.slug,
});
