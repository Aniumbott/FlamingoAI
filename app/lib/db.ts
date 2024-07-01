import mongoose from "mongoose";

declare global {
  var mongoose: {
    conn: any;
    promise: any;
  };
}
global.mongoose = {
  conn: null,
  promise: null,
};

// Function to connect to the database
export async function dbConnect() {
  try {
    if (global.mongoose && global.mongoose.conn) {
      return global.mongoose.conn;
    } else {
      const conString = process.env.MONGODB_URI || "";

      const promise = mongoose.connect(conString, {
        autoIndex: true,
      });

      global.mongoose = {
        conn: await promise,
        promise,
      };
      return await promise;
    }
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error("Database connection failed");
  }
}

// Function to disconnect from the database
export const disconnect = () => {
  if (!global.mongoose.conn) {
    return;
  }
  global.mongoose.conn = null;
  mongoose.disconnect();
};
