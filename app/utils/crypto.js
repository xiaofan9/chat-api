import crypto from "crypto";

export const md5 = (content) => crypto.createHash("md5").update(content).digest("hex");
