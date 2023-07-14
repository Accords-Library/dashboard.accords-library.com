import { buildConfig } from "payload/config";
import path from "path";
import { Users } from "./collections/Users";
import { Languages } from "./collections/Languages";
import { Recorders } from "./collections/Recorders/Recorders";
import { Images } from "./collections/Images/Images";
import { Categories } from "./collections/Categories/Categories";

export default buildConfig({
  serverURL: "http://localhost:3000",
  admin: {
    user: Users.slug,
  },
  collections: [Users, Languages, Recorders, Images, Categories],
  globals: [],
  telemetry: false,
  typescript: {
    outputFile: path.resolve(__dirname, "types/collections.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
});
