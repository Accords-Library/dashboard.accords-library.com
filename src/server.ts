import express from "express";
import payload from "payload";
import "dotenv/config";
import path from "path";

const app = express();

// Redirect root to Admin panel
app.get("/", (_, res) => {
  res.redirect("/admin");
});

const start = async () => {
  // Initialize Payload
  await payload.init({
    email: {
      transportOptions: {
        host: process.env.SMTP_HOST,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        port: 587,
        secure: true,
        tls: {
          rejectUnauthorized: false,
        },
      },
      fromName: "hello",
      fromAddress: "hello@example.com",
    },
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // Add your own express routes here
  app.use("/public", express.static(path.join(__dirname, "../public")));

  app.listen(3000);
};

start();
