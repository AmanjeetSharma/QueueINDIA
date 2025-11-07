import dotenv from "dotenv";
import chalk from "chalk";
import { app } from "./src/app.js";

// Load environment variables
dotenv.config({
    path: "./.env"
});

// Root route
app.get("/", (req, res) => {
    res.send("<h1>API Gateway is up and running!</h1>");
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(chalk.bgGray(`🚀 API Gateway is live!`));
    console.log(chalk.bgGray(`🌐 Gateway listening on port:`));
    console.log(chalk.bgGray(`http://localhost:${PORT}`));
    console.log(chalk.gray(`-----------------------------------------`));
});
