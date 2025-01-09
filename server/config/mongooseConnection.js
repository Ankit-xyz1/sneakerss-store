
import mongoose from "mongoose";
import configDotenv  from "dotenv";

configDotenv.config()

const Mongo_URL = process.env.MongoDB_URL

const DbConnect = async () => {
    try {
        await mongoose.connect(Mongo_URL+"/xyzdb");
        console.log("connected sucessfully")
    } catch (error) {
        console.log("eroor connecting DB : " + error)
    }
}

export default DbConnect