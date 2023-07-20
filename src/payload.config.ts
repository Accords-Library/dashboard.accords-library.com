import { buildConfig } from "payload/config";
import path from "path";
import { Users } from "./collections/Users";
import { Languages } from "./collections/Languages";
import { Recorders } from "./collections/Recorders/Recorders";
import { Images } from "./collections/Images/Images";
import { Posts } from "./collections/Posts/Posts";
import { Tags } from "./collections/Tags/Tags";
import { LibraryItems } from "./collections/LibraryItems/LibraryItems";
import { Contents } from "./collections/Contents/Contents";
import { Files } from "./collections/Files/Files";

export default buildConfig({
  serverURL: "http://localhost:3000",
  admin: {
    user: Users.slug,
  },
  collections: [LibraryItems, Contents, Posts, Images, Files, Languages, Recorders, Tags, Users],
  globals: [],
  telemetry: false,
  typescript: {
    outputFile: path.resolve(__dirname, "types/collections.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
});
