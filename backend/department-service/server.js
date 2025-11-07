import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { app } from "./src/app.js";
import chalk from "chalk";
import launchPage from "./src/config/launchPage.js"

// Load environment variables
dotenv.config({
    path: "./.env"
});

app.get("/", (req, res) => {
    res.send(launchPage);
});

// Start server
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 3002;

        app.listen(PORT, () => {
            console.log(chalk.magentaBright(`🚀 Department Service is live on PORT:`));
            console.log(chalk.cyanBright(`http://localhost:${PORT}`));
            console.log(chalk.gray(`-----------------------------------------`));
        });
    })
    .catch((error) => {
        console.log(chalk.redBright("❌ MongoDB Connection failed: "), error);
    });
