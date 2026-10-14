import mongoose from "mongoose";

interface ConnectionObject {
  isConnected?: number;
}

console.log("🔗 DB name:", mongoose.connection.db?.databaseName);
console.log("🔗 DB host:", mongoose.connection.host);
const connection: ConnectionObject = {};
const connect_db = async (): Promise<typeof mongoose> => {
  if (connection.isConnected) {
    return mongoose;
  }

  const uri = process.env.MONGODB_URI ?? process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const db = await mongoose.connect(uri);
  connection.isConnected = db.connections[0].readyState;

  // ✅ logs AFTER connection
  console.log("🔗 DB name:", mongoose.connection.db?.databaseName);
  console.log("🔗 DB host:", mongoose.connection.host);

  return db;
};

export { connect_db };
