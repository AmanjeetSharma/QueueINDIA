import mongoose from "mongoose";
import chalk from "chalk";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
    console.log(`${chalk.magentaBright("🌐 MongoDB Connected for Department Service")} | HOST: ${chalk.gray(conn.connection.host)}`);
  } catch (error) {
    console.error(chalk.bgRedBright(" ❌ MongoDB Connection Error for Department Service: "), error.message);
    process.exit(1);
  }
};

export default connectDB;
