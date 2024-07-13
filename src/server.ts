import "dotenv/config";
import express from "express";
import path from "path";
import payload from "payload";
import { isDefined, isUndefined } from "./utils/asserts";
import { Collections, RecordersRoles } from "./shared/payload/constants";

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

  app.get("/robots.txt", (_, res) => {
    res.type("text/plain");
    res.send("User-agent: *\nDisallow: /");
  });

  app.listen(process.env.PAYLOAD_PORT);
};

start();
