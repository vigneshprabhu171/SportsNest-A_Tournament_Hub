import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sportsnest";

    // Set autoIndex to true to ensure indexes are built
    mongoose.set("autoIndex", true);

    await mongoose.connect(uri);
    console.log("MongoDB connected");

    // Ensure indexes are created after models are loaded
    setTimeout(async () => {
      try {
        const models = mongoose.modelNames();
        for (const modelName of models) {
          const model = mongoose.model(modelName);
          await model.syncIndexes();
        }
      } catch (error) {
        console.warn("Index sync warning:", error.message);
      }
    }, 500);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
}
