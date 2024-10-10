const TOKEN_SECRET = process.env.TOKEN_SECRET as string;
const MONGODB_URI = process.env.MONGODB_URI as string;
const PORT = process.env.PORT as string;

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

export { TOKEN_SECRET, MONGODB_URI };
