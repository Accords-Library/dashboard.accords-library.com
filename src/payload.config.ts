import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import path from "path";
import { buildConfig } from "payload/config";
import { sftpAdapter } from "payloadcms-sftp-storage";
import { Attributes } from "src/collections/Attributes/Attributes";
import { Audios } from "src/collections/Audios/Audios";
import { ChronologyEvents } from "src/collections/ChronologyEvents/ChronologyEvents";
import { Collectibles } from "src/collections/Collectibles/Collectibles";
import { CreditsRoles } from "src/collections/CreditsRoles/CreditsRoles";
import { Currencies } from "src/collections/Currencies/Currencies";
import { Files } from "src/collections/Files/Files";
import { Folders } from "src/collections/Folders/Folders";
import { GenericContents } from "src/collections/GenericContents/GenericContents";
import { Images } from "src/collections/Images/Images";
import { Languages } from "src/collections/Languages/Languages";
import { MediaThumbnails } from "src/collections/MediaThumbnails/MediaThumbnails";
import { Pages } from "src/collections/Pages/Pages";
import { Recorders } from "src/collections/Recorders/Recorders";
import { Scans } from "src/collections/Scans/Scans";
import { Tags } from "src/collections/Tags/Tags";
import { Videos } from "src/collections/Videos/Videos";
import { VideosChannels } from "src/collections/VideosChannels/VideosChannels";
import { VideosSubtitles } from "src/collections/VideosSubtitles/VideosSubtitles";
import { WebsiteConfig } from "src/collections/WebsiteConfig/WebsiteConfig";
import { Wordings } from "src/collections/Wordings/Wordings";
import { Icon } from "src/components/Icon";
import { Logo } from "src/components/Logo";
import { getAllIds } from "src/endpoints/getAllIdsEndpoint";
import { getAllSDKUrlsEndpoint } from "src/endpoints/getAllSDKUrlsEndpoint";
import { Collections } from "src/shared/payload/constants";
import { createEditor } from "src/utils/editor";
// import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

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
    webpack: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        // plugins: [
        //   ...(config.resolve?.plugins ?? []),
        //   new TsconfigPathsPlugin({
        //     /* options: see below */
        //   }),
        // ],
        alias: {
          ...config.resolve?.alias,
          "src/": path.resolve(__dirname, "src"),
        },
      },
    }),
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
