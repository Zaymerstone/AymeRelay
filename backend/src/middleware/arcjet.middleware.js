// TODO
import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      userId: req.user?.id || req.ip,
    });
    console.log("Arcjet decision", decision);

    //
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Rate limit exceeded. Please try again later." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied." });
      } else {
        return res
          .status(403)
          .json({ message: "Access denied by security policy." });
      }
    }
    if (decision.reason.isSpoofedBot()) {
      return res.status(403).json({ message: "Access denied bot detected" }); // redo
    }
    next();
  } catch (error) {
    console.log("Arcjet protection error: ", error);
    next();
  }
};
