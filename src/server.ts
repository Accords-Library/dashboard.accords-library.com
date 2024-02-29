import "dotenv/config";
import express from "express";
import { readFileSync } from "fs";
import path from "path";
import payload from "payload";
import { Collections, RecordersRoles } from "./constants";
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

          await payload.create({
            collection: Collections.Recorders,
            data: {
              email: process.env.SEEDING_ADMIN_EMAIL,
              password: process.env.SEEDING_ADMIN_PASSWORD,
              username: process.env.SEEDING_ADMIN_USERNAME,
              role: [RecordersRoles.Admin, RecordersRoles.Api],
              anonymize: false,
            },
          });
        }
      }
    },
  });

  // Add your own express routes here
  app.use("/public", express.static(path.join(__dirname, "../public")));

  app.get("/api/sdk", (_, res) => {
    const removeMockingSection = (text: string): string => {
      const lines = text.split("\n");
      const endMockingLine = lines.findIndex((line) => line === "// END MOCKING SECTION") ?? 0;
      return lines.slice(endMockingLine + 1).join("\n");
    };

    const removeDeclare = (text: string): string => {
      const lines = text.split("\n");
      const startDeclareLine =
        lines.findIndex((line) => line === "declare module 'payload' {") ?? 0;
      return lines.slice(0, startDeclareLine).join("\n");
    };

    const result = [];

    result.push(removeDeclare(readFileSync(path.join(__dirname, "types/collections.ts"), "utf-8")));

    result.push("/////////////// CONSTANTS ///////////////");
    result.push(removeMockingSection(readFileSync(path.join(__dirname, "constants.ts"), "utf-8")));

    result.push("////////////////// SDK //////////////////");
    result.push(`import NodeCache from "node-cache";`);
    result.push(removeMockingSection(readFileSync(path.join(__dirname, "sdk.ts"), "utf-8")));

    res.type("text/plain");
    res.send(result.join("\n\n"));
  });

  app.get("/robots.txt", (_, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nDisallow: /");
  });

  app.listen(process.env.PAYLOAD_PORT);
};

start();
