import { buildConfig } from "payload/config";
import path from "path";
import { Languages } from "./collections/Languages/Languages";
import { Recorders } from "./collections/Recorders/Recorders";
import { Posts } from "./collections/Posts/Posts";
import { Keys } from "./collections/Keys/Keys";
import { LibraryItems } from "./collections/LibraryItems/LibraryItems";
import { Contents } from "./collections/Contents/Contents";
import { Files } from "./collections/Files/Files";
import { RecorderThumbnails } from "./collections/RecorderThumbnails/RecorderThumbnails";
import { PostThumbnails } from "./collections/PostThumbnails/PostThumbnails";
import { LibraryItemThumbnails } from "./collections/LibraryItemThumbnails/LibraryItemThumbnails";
import { ContentThumbnails } from "./collections/ContentThumbnails/ContentThumbnails";
import { ContentFolders } from "./collections/ContentFolders/ContentFolders";
import { Logo } from "./components/Logo";
import { Icon } from "./components/Icon";
import { Currencies } from "./collections/Currencies/Currencies";

export default buildConfig({
  serverURL: "https://dashboard.accords-library.com",
  admin: {
    user: Recorders.slug,
    components: { graphics: { Logo, Icon } },
    meta: {
      favicon: "/public/favicon.ico",
      ogImage: "og.jpg",
      titleSuffix: "- Accord’s Library",
    },
    css: path.resolve(__dirname, "styles.scss"),
  },
  collections: [
    LibraryItems,
    Contents,
    ContentFolders,
    Posts,
    ContentThumbnails,
    LibraryItemThumbnails,
    RecorderThumbnails,
    PostThumbnails,
    Files,
    Languages,
    Currencies,
    Recorders,
    Keys,
  ],
  globals: [],
  telemetry: false,
  typescript: {
    outputFile: path.resolve(__dirname, "types/collections.ts"),
  },
  graphQL: {
    disable: true,
  },
});
