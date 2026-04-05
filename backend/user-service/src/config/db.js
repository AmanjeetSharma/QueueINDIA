import mongoose from "mongoose";
import chalk from "chalk";
import dns from "dns";

if(process.env.NODE_ENV === "development") { // only in development
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
    console.log(`${chalk.yellowBright("🌿 MongoDB Connected for User Service ")} | HOST: ${chalk.gray(conn.connection.host)}`);
  } catch (error) {
    console.error(chalk.bgRedBright(" ❌ MongoDB Connection Error for User Service: "), error.message);
    process.exit(1);
  }
};

export default connectDB;
