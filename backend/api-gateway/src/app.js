import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import proxy from "express-http-proxy";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

// Global Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.set("trust proxy", 1); // Trust first proxy
app.use(cookieParser());

// Important: Remove global body parsing for proxy routes
// Only parse body for non-proxy routes if needed
app.use((req, res, next) => {
  // console.log(`[GATEWAY] ${req.method} ${req.originalUrl}`);

  // Skip body parsing for proxy routes
  if (req.originalUrl.startsWith('/api/v1/')) {
    return next();
  }

  // Only parse body for non-proxy routes
  express.json({ limit: "50mb" })(req, res, next);
});


const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
const DEPARTMENT_SERVICE_URL = process.env.DEPARTMENT_SERVICE_URL;

// -------- User Service (Auth, Profile, etc.) --------
app.use(
  [
    "/api/v1/auth",
    "/api/v1/users",
    "/api/v1/oauth2",
    "/api/v1/reset-password",
  ],
  proxy(USER_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
    parseReqBody: true, // Let the proxy handle body parsing
    limit: "50mb", // Add limit at proxy level
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Preserve content-type for file uploads
      if (srcReq.headers['content-type']) {
        proxyReqOpts.headers['content-type'] = srcReq.headers['content-type'];
      }
      return proxyReqOpts;
    },
    proxyErrorHandler: (err, res, next) => {
      console.error("[GATEWAY] Proxy error:", err.message);
      next(err);
    },
  })
);

// -------- Department Service --------
app.use(
  [
    "/api/v1/departments"
  ],
  proxy(DEPARTMENT_SERVICE_URL, {
    proxyReqPathResolver: (req) => req.originalUrl,
    parseReqBody: true,
    limit: "50mb",
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.headers['content-type']) {
        proxyReqOpts.headers['content-type'] = srcReq.headers['content-type'];
      }
      return proxyReqOpts;
    },
    proxyErrorHandler: (err, res, next) => {
      console.error("[GATEWAY] Department proxy error:", err.message);
      next(err);
    },
  })
);

// Health check
app.get("/", (req, res) => {
  res.send("<h2>🌐 API Gateway running successfully!</h2>");
});

// Global Error Handler
app.use(errorHandler);

export { app };