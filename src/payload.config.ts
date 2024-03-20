import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import path from "path";
import { buildConfig } from "payload/config";
import { BackgroundImages } from "./collections/BackgroundImages/BackgroundImages";
import { ChronologyEvents } from "./collections/ChronologyEvents/ChronologyEvents";
import { Collectibles } from "./collections/Collectibles/Collectibles";
import { Currencies } from "./collections/Currencies/Currencies";
import { Folders } from "./collections/Folders/Folders";
import { GenericContents } from "./collections/GenericContents/GenericContents";
import { HomeFolders } from "./collections/HomeFolders/HomeFolders";
import { Images } from "./collections/Images/Images";
import { Languages } from "./collections/Languages/Languages";
import { Notes } from "./collections/Notes/Notes";
import { Pages } from "./collections/Pages/Pages";
import { Recorders } from "./collections/Recorders/Recorders";
import { RecordersThumbnails } from "./collections/RecordersThumbnails/RecordersThumbnails";
import { Tags } from "./collections/Tags/Tags";
import { TagsGroups } from "./collections/TagsGroups/TagsGroups";
import { Videos } from "./collections/Videos/Videos";
import { VideosChannels } from "./collections/VideosChannels/VideosChannels";
import { Wordings } from "./collections/Wordings/Wordings";
import { Icon } from "./components/Icon";
import { Logo } from "./components/Logo";
import { Collections } from "./constants";
import { createEditor } from "./utils/editor";

export default buildConfig({
  serverURL: process.env.PAYLOAD_URI,
  admin: {
    user: Collections.Recorders,
    components: { graphics: { Logo, Icon } },
    meta: {
      favicon: "/public/favicon.ico",
      ogImage: "og.jpg",
      titleSuffix: "- Accord’s Library",
    },
    css: path.resolve(__dirname, "styles.scss"),
    bundler: webpackBundler(),
  },
  editor: createEditor({}),
  collections: [
    Pages,
    Collectibles,
    Folders,
    ChronologyEvents,
    Notes,

    Images,
    BackgroundImages,
    RecordersThumbnails,
    Videos,
    VideosChannels,

    Tags,
    TagsGroups,
    Recorders,
    Languages,
    Currencies,
    Wordings,
    GenericContents,
  ],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI ?? "mongodb://mongo:27017/payload",
  }),
  globals: [HomeFolders],
  telemetry: false,
  typescript: {
    outputFile: path.resolve(__dirname, "types/collections.ts"),
  },
  graphQL: {
    disable: true,
  },
});
