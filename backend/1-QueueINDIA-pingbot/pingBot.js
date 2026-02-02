import fetch from "node-fetch";
import {
    SERVICES,
    PING_INTERVAL,
    MAX_RUNTIME,
    REQUEST_TIMEOUT
} from "./config.js";

// Utility: Timeout wrapper
const fetchWithTimeout = async (url) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeout);
        return res;
    } catch (err) {
        clearTimeout(timeout);
        throw err;
    }
};

// Logging helper
const log = (msg) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
};

// Ping all services safely
const pingAllServices = async () => {
    log("🔄 Pinging QueueINDIA services...");

    for (const service of SERVICES) {
        try {
            const res = await fetchWithTimeout(service.url);

            if (res.ok) {
                log(`✅ ${service.name} is UP (${res.status})`);
            } else {
                log(`⚠️ ${service.name} responded (${res.status})`);
            }
        } catch (err) {
            log(`❌ ${service.name} ERROR: ${err.message}`);
        }
    }

    console.log("────────────────────────────────────────");
};

// Start bot
log("🚀 QueueINDIA Interview Ping Bot Started");
log(`⏰ Interval: ${PING_INTERVAL / 60000} minutes`);
log(`🛑 Auto-stop after: ${MAX_RUNTIME / 60000} minutes`);
console.log("────────────────────────────────────────");

// Immediate ping once
pingAllServices();

// Repeat every 10 min
const intervalId = setInterval(pingAllServices, PING_INTERVAL);

// Auto stop after 1 hour
setTimeout(() => {
    log("🛑 1 hour completed. Stopping bot automatically...");
    clearInterval(intervalId);
    process.exit(0);
}, MAX_RUNTIME);

// Graceful manual stop (Ctrl+C)
process.on("SIGINT", () => {
    log("🛑 Bot stopped manually (Ctrl+C). Goodbye!");
    clearInterval(intervalId);
    process.exit(0);
});
