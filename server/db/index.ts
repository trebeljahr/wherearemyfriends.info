import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("No MONGODB_URI provided in the environment");
}

try {
  const x = await mongoose.connect(MONGODB_URI);
  const dbName = x.connections[0].name;
  console.log(`Connected to Mongo! Database name: "${dbName}"`);
} catch (err) {
  console.error("Error connecting to mongo: ", err);
}
