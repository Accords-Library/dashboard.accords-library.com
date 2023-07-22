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
import { Logo } from "./components/Logo";
import { Icon } from "./components/Icon";

export default buildConfig({
  serverURL: "http://localhost:3000",
  admin: {
    user: Users.slug,
    components: { graphics: { Logo, Icon } },
    meta: {
      favicon: "/public/favicon.ico",
      ogImage: "og.jpg",
      titleSuffix: "- Accord’s Library",
  },
    css: path.resolve(__dirname, "styles.scss"),
  },
  globals: [],
  telemetry: false,
  typescript: {
    outputFile: path.resolve(__dirname, "types/collections.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
});
