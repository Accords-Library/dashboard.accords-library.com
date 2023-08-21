import "dotenv/config";
import express from "express";
import { readFileSync } from "fs";
import path from "path";
import payload from "payload";
import { Collections, RecordersRoles } from "./constants";
import { Recorder } from "./types/collections";
import { PayloadCreateData } from "./types/payload";
import { isDefined, isUndefined } from "./utils/asserts";

const app = express();

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

const start = async () => {
  // Initialize Payload

  if (isUndefined(process.env.PAYLOAD_SECRET)) {
    throw new Error("Missing required env variable: PAYLOAD_SECRET");
  }

  if (isUndefined(process.env.MONGODB_URI)) {
    throw new Error("Missing required env variable: MONGODB_URI");
  }

  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
      const recorders = await payload.find({ collection: Collections.Recorders });

      // If no recorders, we seed some initial data
      if (
        isDefined(process.env.SEEDING_ADMIN_EMAIL) &&
        isDefined(process.env.SEEDING_ADMIN_PASSWORD) &&
        isDefined(process.env.SEEDING_ADMIN_USERNAME)
      ) {
        if (recorders.docs.length === 0) {
          payload.logger.info("Seeding some initial data");

          const recorder: PayloadCreateData<Recorder> = {
            email: process.env.SEEDING_ADMIN_EMAIL,
            password: process.env.SEEDING_ADMIN_PASSWORD,
            username: process.env.SEEDING_ADMIN_USERNAME,
            role: [RecordersRoles.Admin, RecordersRoles.Api],
            anonymize: false,
          };
          await payload.create({
            collection: Collections.Recorders,
            data: recorder,
          });
        }
      }
    },
  });

  // Add your own express routes here
  app.use("/public", express.static(path.join(__dirname, "../public")));

  app.get("/api/sdk", (_, res) => {
    const collections = readFileSync(path.join(__dirname, "types/collections.ts"), "utf-8");

    const constantsHeader = "/////////////// CONSTANTS ///////////////\n";
    const constants = readFileSync(path.join(__dirname, "constants.ts"), "utf-8");

    const sdkHeader = "////////////////// SDK //////////////////\n";
    const sdkLines = readFileSync(path.join(__dirname, "sdk.ts"), "utf-8").split("\n");
    const endMockingLine = sdkLines.findIndex((line) => line === "// END MOCKING SECTION") ?? 0;
    const sdk =
      `import NodeCache from "node-cache";\n\n` + sdkLines.slice(endMockingLine + 1).join("\n");

    res.type("text/plain");
    res.send([collections, constantsHeader, constants, sdkHeader, sdk].join("\n\n"));
  });

  app.get("/robots.txt", (_, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nDisallow: /");
  });

  app.listen(process.env.PAYLOAD_PORT);
};

start();
