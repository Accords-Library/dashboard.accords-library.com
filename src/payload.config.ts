import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import path from "path";
import { buildConfig } from "payload/config";
import { sftpAdapter } from "payloadcms-sftp-storage";
import { Audios } from "./collections/Audios/Audios";
import { ChronologyEvents } from "./collections/ChronologyEvents/ChronologyEvents";
import { Collectibles } from "./collections/Collectibles/Collectibles";
import { CreditsRoles } from "./collections/CreditsRoles/CreditsRoles";
import { Currencies } from "./collections/Currencies/Currencies";
import { Folders } from "./collections/Folders/Folders";
import { GenericContents } from "./collections/GenericContents/GenericContents";
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
import { WebsiteConfig } from "./collections/WebsiteConfig/WebsiteConfig";
import { Wordings } from "./collections/Wordings/Wordings";
import { Icon } from "./components/Icon";
import { Logo } from "./components/Logo";
import { Collections } from "./constants";
import { createEditor } from "./utils/editor";

const configuredFtpAdapter = sftpAdapter({
  connectOptions: {
    host: process.env.SFTP_HOST,
    username: process.env.SFTP_USERNAME,
    privateKey: process.env.SFTP_PRIVATE_KEY,
  },
  destinationPathRoot: process.env.SFTP_DESTINATION_PATH_ROOT ?? "",
  publicEndpoint: process.env.SFTP_BASE_URL ?? "",
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
    CreditsRoles,
    Recorders,
    Languages,
    Currencies,
    Wordings,
    GenericContents,
  ],
  db: mongooseAdapter({
    url: process.env.MONGODB_URI ?? "",
  }),
  globals: [WebsiteConfig],
  telemetry: false,
  typescript: {
    outputFile: path.resolve(__dirname, "types/collections.ts"),
  },
  graphQL: {
    disable: true,
  },
  rateLimit: {
    window: 900_000, // 15 minutes
    max: 500,
    skip: (request) => request.headers["x-rate-limit-skip"] === process.env.RATING_LIMIT_SKIP_TOKEN,
  },
  plugins: [
    cloudStorage({
      collections: {
        [Collections.Videos]: {
          adapter: configuredFtpAdapter,
          disableLocalStorage: true,
          disablePayloadAccessControl: true,
        },
        [Collections.VideosSubtitles]: {
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
