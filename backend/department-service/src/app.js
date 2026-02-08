import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Importing Routes
import deptMainRoutes from "./routes/dept.main.routes.js";
import deptAdminRoutes from "./routes/dept.admin.routes.js";
import deptServiceRoutes from "./routes/dept.service.routes.js";
import deptBookingRoutes from "./routes/dept.booking.routes.js";
import deptOfficerRoutes from "./routes/dept.officer.routes.js";
import queueRoutes from "./routes/dept.queue.routes.js";
// import deptRatingRoutes from "./routes/dept.rating.routes.js";

// Using Routes
app.use("/api/v1/departments", deptMainRoutes);
app.use("/api/v1/departments", deptAdminRoutes);
app.use("/api/v1/departments", deptServiceRoutes);
app.use("/api/v1/departments", deptBookingRoutes);
app.use("/api/v1/officer/", deptOfficerRoutes);
app.use("/api/v1/departments", queueRoutes);
// app.use("/api/v1/departments", deptRatingRoutes);



app.use(errorHandler);

export { app };
