import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import path from "path";
import { buildConfig } from "payload/config";
import { ChronologyEras } from "./collections/ChronologyEras/ChronologyEras";
import { ChronologyItems } from "./collections/ChronologyItems/ChronologyItems";
import { Contents } from "./collections/Contents/Contents";
import { ContentsFolders } from "./collections/ContentsFolders/ContentsFolders";
import { ContentsThumbnails } from "./collections/ContentsThumbnails/ContentsThumbnails";
import { Currencies } from "./collections/Currencies/Currencies";
import { Files } from "./collections/Files/Files";
import { Keys } from "./collections/Keys/Keys";
import { Languages } from "./collections/Languages/Languages";
import { LibraryFolders } from "./collections/LibraryFolders/LibraryFolders";
import { LibraryItems } from "./collections/LibraryItems/LibraryItems";
import { LibraryItemsGallery } from "./collections/LibraryItemsGallery/LibraryItemsGallery";
import { LibraryItemsScans } from "./collections/LibraryItemsScans/LibraryItemsScans";
import { LibraryItemsThumbnails } from "./collections/LibraryItemsThumbnails/LibraryItemsThumbnails";
import { Notes } from "./collections/Notes/Notes";
import { Posts } from "./collections/Posts/Posts";
import { PostsThumbnails } from "./collections/PostsThumbnails/PostsThumbnails";
import { Recorders } from "./collections/Recorders/Recorders";
import { RecordersThumbnails } from "./collections/RecordersThumbnails/RecordersThumbnails";
import { Videos } from "./collections/Videos/Videos";
import { VideosChannels } from "./collections/VideosChannels/VideosChannels";
import { Weapons } from "./collections/Weapons/Weapons";
import { WeaponsGroups } from "./collections/WeaponsGroups/WeaponsGroups";
import { WeaponsThumbnails } from "./collections/WeaponsThumbnails/WeaponsThumbnails";
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
    LibraryFolders,
    LibraryItems,
    Contents,
    ContentsFolders,
    Posts,
    ChronologyItems,
    ChronologyEras,
    Weapons,
    WeaponsGroups,
    WeaponsThumbnails,
    ContentsThumbnails,
    LibraryItemsThumbnails,
    LibraryItemsScans,
    LibraryItemsGallery,
    RecordersThumbnails,
    PostsThumbnails,
    Files,
    Notes,
    Videos,
    VideosChannels,
    Languages,
    Currencies,
    Recorders,
    Keys,
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
