import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import path from "path";
import { buildConfig } from "payload/config";
import { Audios } from "./collections/Audios/Audios";
import { ChronologyEvents } from "./collections/ChronologyEvents/ChronologyEvents";
import { Collectibles } from "./collections/Collectibles/Collectibles";
import { Currencies } from "./collections/Currencies/Currencies";
import { Folders } from "./collections/Folders/Folders";
import { GenericContents } from "./collections/GenericContents/GenericContents";
import { HomeFolders } from "./collections/HomeFolders/HomeFolders";
import { Images } from "./collections/Images/Images";
import { Languages } from "./collections/Languages/Languages";
import { Pages } from "./collections/Pages/Pages";
import { Recorders } from "./collections/Recorders/Recorders";
import { Scans } from "./collections/Scans/Scans";
import { Tags } from "./collections/Tags/Tags";
import { TagsGroups } from "./collections/TagsGroups/TagsGroups";
import { Videos } from "./collections/Videos/Videos";
import { VideosChannels } from "./collections/VideosChannels/VideosChannels";
import { VideosSubtitles } from "./collections/VideosSubtitles/VideosSubtitles";
import { MediaThumbnails } from "./collections/VideosThumbnails/VideosThumbnails";
import { Wordings } from "./collections/Wordings/Wordings";
import { Icon } from "./components/Icon";
import { Logo } from "./components/Logo";
import { Collections } from "./constants";
import { ftpAdapter } from "./plugins/ftpAdapter";
import { createEditor } from "./utils/editor";

const configuredFtpAdapter = ftpAdapter({
  host: process.env.FTP_HOST ?? "",
  user: process.env.FTP_USER ?? "",
  password: process.env.FTP_PASSWORD ?? "",
  secure: false,
  endpoint: process.env.FTP_BASE_URL ?? "",
});

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

    Images,
    Audios,
    MediaThumbnails,
    Videos,
    VideosSubtitles,
    VideosChannels,
    Scans,

    Tags,
    TagsGroups,
    Recorders,
    Languages,
    Currencies,
    Wordings,
    GenericContents,
  ],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI ?? "",
  }),
  globals: [HomeFolders],
  telemetry: false,
  typescript: {
    outputFile: path.resolve(__dirname, "types/collections.ts"),
  },
  graphQL: {
    disable: true,
  },
  plugins: [
    cloudStorage({
      collections: {
        [Collections.Videos]: {
          adapter: configuredFtpAdapter,
          disableLocalStorage: true,
          disablePayloadAccessControl: true,
        },
        [Collections.Audios]: {
          adapter: configuredFtpAdapter,
          disableLocalStorage: true,
          disablePayloadAccessControl: true,
        },
      },
    }),
  ],
});
