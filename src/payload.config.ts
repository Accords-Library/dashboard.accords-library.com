import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import path from "path";
import { buildConfig } from "payload/config";
import { sftpAdapter } from "payloadcms-sftp-storage";
import { Attributes } from "./collections/Attributes/Attributes";
import { Audios } from "./collections/Audios/Audios";
import { ChronologyEvents } from "./collections/ChronologyEvents/ChronologyEvents";
import { Collectibles } from "./collections/Collectibles/Collectibles";
import { CreditsRoles } from "./collections/CreditsRoles/CreditsRoles";
import { Currencies } from "./collections/Currencies/Currencies";
import { Files } from "./collections/Files/Files";
import { Folders } from "./collections/Folders/Folders";
import { GenericContents } from "./collections/GenericContents/GenericContents";
import { Images } from "./collections/Images/Images";
import { Languages } from "./collections/Languages/Languages";
import { MediaThumbnails } from "./collections/MediaThumbnails/MediaThumbnails";
import { Pages } from "./collections/Pages/Pages";
import { Recorders } from "./collections/Recorders/Recorders";
import { Scans } from "./collections/Scans/Scans";
import { Tags } from "./collections/Tags/Tags";
import { Videos } from "./collections/Videos/Videos";
import { VideosChannels } from "./collections/VideosChannels/VideosChannels";
import { VideosSubtitles } from "./collections/VideosSubtitles/VideosSubtitles";
import { WebsiteConfig } from "./collections/WebsiteConfig/WebsiteConfig";
import { Wordings } from "./collections/Wordings/Wordings";
import { Icon } from "./components/Icon";
import { Logo } from "./components/Logo";
import { getAllIds } from "./endpoints/getAllIdsEndpoint";
import { getAllSDKUrlsEndpoint } from "./endpoints/getAllSDKUrlsEndpoint";
import { createEditor } from "./utils/editor";
import { Collections } from "./shared/payload/constants";

const configuredSftpAdapter = sftpAdapter({
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
    Files,
    Scans,

    Tags,
    Attributes,
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
  endpoints: [getAllSDKUrlsEndpoint, getAllIds],
  graphQL: {
    disable: true,
  },
  rateLimit: {
    skip: () => true,
  },
  plugins: [
    cloudStorage({
      collections: {
        [Collections.Videos]: {
          adapter: configuredSftpAdapter,
          disableLocalStorage: true,
          disablePayloadAccessControl: true,
        },
        [Collections.VideosSubtitles]: {
          adapter: configuredSftpAdapter,
          disableLocalStorage: true,
          disablePayloadAccessControl: true,
        },
        [Collections.Audios]: {
          adapter: configuredSftpAdapter,
          disableLocalStorage: true,
          disablePayloadAccessControl: true,
        },
        [Collections.Files]: {
          adapter: configuredSftpAdapter,
          disableLocalStorage: true,
          disablePayloadAccessControl: true,
        },
      },
    }),
  ],
});
