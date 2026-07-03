import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

import { ENV } from "./env.js";

const aj = arcjet({
  key: ENV.ARCJET_KEY,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),

    // Bot detection: log only for now, do not block real users on deployed version
    detectBot({
      mode: "DRY_RUN",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        //"CATEGORY:MONITOR", // Uptime monitoring services
        //"CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),

    // Rate limit
    slidingWindow({
      mode: "LIVE",
      max: 100,
      interval: 60,
    }),
  ],
});

export default aj;
