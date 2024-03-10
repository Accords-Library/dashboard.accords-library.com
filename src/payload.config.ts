import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import path from "path";
import { buildConfig } from "payload/config";
import { BackgroundImages } from "./collections/BackgroundImages/BackgroundImages";
import { ChronologyEras } from "./collections/ChronologyEras/ChronologyEras";
import { ChronologyItems } from "./collections/ChronologyItems/ChronologyItems";
import { Collectibles } from "./collections/Collectibles/Collectibles";
import { Currencies } from "./collections/Currencies/Currencies";
import { Folders } from "./collections/Folders/Folders";
import { FoldersThumbnails } from "./collections/FoldersThumbnails/FoldersThumbnails";
import { GenericContents } from "./collections/GenericContents/GenericContents";
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
import { Weapons } from "./collections/Weapons/Weapons";
import { WeaponsGroups } from "./collections/WeaponsGroups/WeaponsGroups";
import { WeaponsThumbnails } from "./collections/WeaponsThumbnails/WeaponsThumbnails";
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
    Folders,
    FoldersThumbnails,
    Pages,
    ChronologyItems,
    ChronologyEras,
    Weapons,
    WeaponsGroups,
    WeaponsThumbnails,
    RecordersThumbnails,
    Notes,
    Videos,
    VideosChannels,
    Languages,
    Currencies,
    Recorders,
    Tags,
    TagsGroups,
    Images,
    Wordings,
    Collectibles,
    GenericContents,
    BackgroundImages,
  ],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI ?? "mongodb://mongo:27017/payload",
  }),
  globals: [],
  telemetry: false,
  typescript: {
    outputFile: path.resolve(__dirname, "types/collections.ts"),
  },
  graphQL: {
    disable: true,
  },
});
