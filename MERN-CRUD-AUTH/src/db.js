import mongoose from "mongoose";

export const connectDb = async (req, res) => {
  try {
      await mongoose.connect("mongodb://localhost:27017/merndb");
      console.log('>>> Db is Connected')
  } catch (error) {
    console.log(error);
  }
};
