import path from "path";

const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
const MONGODB_URI = process.env.MONGODB_URI as string;
const PORT = process.env.PORT as string;
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const ALTCHA_HMAC_KEY = process.env.ALTCHA_HMAC_KEY as string;

if (!process.env.TOKEN_SECRET) {
  console.error("TOKEN_SECRET not provided in the environment");
  process.exit(1);
}

if (!PORT) {
  console.error("No PORT provided in the environment");
  process.exit(1);
}

if (!MONGODB_URI) {
  console.error("No MONGODB_URI provided in the environment");
  process.exit(1);
}

if (!ALTCHA_HMAC_KEY) {
  console.error("No ALTCHA_HMAC_KEY provided in the environment");
  process.exit(1);
}

const CORRECT_PATH =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "../..")
    : path.resolve(__dirname, "..");

export {
  TOKEN_SECRET,
  MONGODB_URI,
  PORT,
  FRONTEND_URL,
  CORRECT_PATH,
  ALTCHA_HMAC_KEY,
};
