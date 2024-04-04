import {
  Adapter,
  GenerateURL,
  HandleDelete,
  HandleUpload,
} from "@payloadcms/plugin-cloud-storage/dist/types";
import { Client } from "basic-ftp";
import path from "path";
import { Readable } from "stream";
import type { Configuration as WebpackConfig } from "webpack";

interface FTPAdapterConfig {
  host: string;
  user: string;
  password: string;
  secure: boolean;
  endpoint: string;
}

export const ftpAdapter =
  ({ endpoint, host, password, secure, user }: FTPAdapterConfig): Adapter =>
  ({ collection }) => {
    const generateURL: GenerateURL = ({ filename }) => `${endpoint}/${collection.slug}/${filename}`;
    const handleDelete: HandleDelete = async ({ filename }) => {
      const client = new Client();
      client.ftp.verbose = true;
      await client.access({
        host,
        user,
        password,
        secure,
      });
      await client.ensureDir(collection.slug);
      await client.remove(filename);
      client.close();
    };
    const handleUpload: HandleUpload = async ({ file }) => {
      const client = new Client();
      client.ftp.verbose = true;
      await client.access({
        host: process.env.FTP_HOST,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASSWORD,
        secure: false,
      });
      await client.ensureDir(collection.slug);
      await client.uploadFrom(Readable.from(file.buffer), file.filename);
      client.close();
    };

    const webpack = (existingWebpackConfig: WebpackConfig): WebpackConfig => {
      const newConfig: WebpackConfig = {
        ...existingWebpackConfig,
        resolve: {
          ...(existingWebpackConfig.resolve || {}),
          alias: {
            ...(existingWebpackConfig.resolve?.alias ? existingWebpackConfig.resolve.alias : {}),
            "./plugins/ftpAdapter": path.resolve(__dirname, "./mock.js"),
          },
          fallback: {
            ...(existingWebpackConfig.resolve?.fallback
              ? existingWebpackConfig.resolve.fallback
              : {}),
            stream: false,
          },
        },
      };

      return newConfig;
    };

    return {
      generateURL,
      handleDelete,
      handleUpload,
      staticHandler: () => {},
      webpack,
    };
  };
