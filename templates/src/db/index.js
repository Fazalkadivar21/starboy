import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
  } catch (error) {
    console.error(`Can't connect to the database : ${error}`);
  }
};

export default connect;
