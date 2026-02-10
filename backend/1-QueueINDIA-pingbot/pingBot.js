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

let pingCounter = 0;

// Ping all services safely
const pingAllServices = async () => {
    pingCounter++;
    log(`🔄 Pinging QueueINDIA services... | times: ${pingCounter}`);

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
log("🚀 QueueINDIA Ping Bot Has Started...");
log(`⏰ Interval: ${PING_INTERVAL / 60000} minutes...`);
log(`🛑 Auto-stop after: ${MAX_RUNTIME / 60000} minutes (${MAX_RUNTIME / 3600000} hrs)`);
console.log("────────────────────────────────────────");

// Immediate ping once
pingAllServices();

// Repeat every 10 min
const intervalId = setInterval(pingAllServices, PING_INTERVAL);

// Auto stop after 3 hours
setTimeout(() => {
    log("🛑 3 hours completed. Stopping bot automatically...");
    log("👋 Thank you for your service!");
    clearInterval(intervalId);
    process.exit(0);
}, MAX_RUNTIME);

// Graceful manual stop (Ctrl+C)
process.on("SIGINT", () => {
    log("🛑 Bot stopped manually (Ctrl+C). Goodbye!");
    clearInterval(intervalId);
    process.exit(0);
});
