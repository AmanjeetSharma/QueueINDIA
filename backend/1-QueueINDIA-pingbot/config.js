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

// Auto stop after → 3 hours
export const MAX_RUNTIME = 2 * 60 * 60 * 1000; // 2 hours

// Timeout per request (security)
export const REQUEST_TIMEOUT = 60000; // 60 seconds
