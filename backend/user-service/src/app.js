import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Importing Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import oauthRoutes from "./routes/oauth.routes.js";
import resetPasswordRoutes from "./routes/resetPassword.routes.js";
import userDeptRoutes from "./routes/user.dept.routes.js";


// Using Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/oauth2", oauthRoutes);
app.use("/api/v1/reset-password", resetPasswordRoutes);
app.use("/api/v1/users-dept", userDeptRoutes);


app.use(errorHandler);

export { app };
