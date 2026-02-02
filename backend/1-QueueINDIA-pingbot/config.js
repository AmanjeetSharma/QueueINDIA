export const SERVICES = [
    {
        name: "API Gateway",
        url: "https://queueindia-api-gateway.onrender.com"
    },
    {
        name: "User Service",
        url: "https://queueindia-user.onrender.com"
    },
    {
        name: "Department Service",
        url: "https://queueindia-department.onrender.com"
    }
];

// Ping interval → every 10 minutes
export const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

// Auto stop after → 1 hour
export const MAX_RUNTIME = 60 * 60 * 1000;

// Timeout per request (security)
export const REQUEST_TIMEOUT = 60000; // 60 seconds
