const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "MONGODB_URI is missing from .env"
  );
}

const dbName = process.env.DB_NAME;

if (!dbName) {
  throw new Error(
    "DB_NAME is missing from .env"
  );
}

// ==========================================
// MONGODB CLIENT
// ==========================================

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 0,
  retryWrites: true,
});

// ==========================================
// DATABASE
// ==========================================

let db = null;
let isConnecting = false;

// ==========================================
// CONNECT DATABASE
// ==========================================

async function connectDB() {
  // Already connected
  if (db) {
    return db;
  }

  // Prevent multiple simultaneous connections
  if (isConnecting) {
    return;
  }

  isConnecting = true;

  const maxRetries = 5;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `Connecting to MongoDB... Attempt ${attempt}/${maxRetries}`
      );

      await client.connect();

      // Verify the connection
      await client.db("admin").command({
        ping: 1,
      });

      db = client.db(dbName);

      console.log(
        "MongoDB connected successfully"
      );
      console.log("Database name:", dbName);

      isConnecting = false;

      return db;
    } catch (error) {
      console.error(
        `MongoDB connection attempt ${attempt} failed:`,
        error?.message || error
      );

      // Reset client connection state before retrying
      try {
        await client.close();
      } catch {
        // Ignore close error
      }

      if (attempt < maxRetries) {
        const retryDelay = attempt * 3000;

        console.log(
          `Retrying MongoDB connection in ${
            retryDelay / 1000
          } seconds...`
        );

        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay)
        );
      } else {
        console.error(
          "MongoDB connection failed after all retry attempts."
        );

        console.error(
          "Please check MongoDB Atlas, internet connection, DNS, IP whitelist and MONGODB_URI."
        );
      }
    }
  }

  isConnecting = false;

  return null;
}

// ==========================================
// GET DATABASE
// ==========================================

function getDB() {
  if (!db) {
    throw new Error(
      "Database is not connected"
    );
  }

  return db;
}

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  connectDB,
  getDB,
};