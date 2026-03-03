import axios from "axios";
import {
    SERVICES,
    PING_INTERVAL,
    MAX_RUNTIME,
    REQUEST_TIMEOUT
} from "./config.js";




// Axios instance (clean & reusable)
const api = axios.create({
    timeout: REQUEST_TIMEOUT,
});

// Logging helper
const log = (msg) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);
};

let pingCounter = 0;

// Parallel Ping Function
const pingAllServices = async () => {
    pingCounter++;
    log(`🔄 Pinging QueueINDIA services... | times: ${pingCounter}`);

    const startTime = Date.now();

    const promises = SERVICES.map(async (service) => {
        try {
            const res = await api.get(service.url);

            log(`✅ ${service.name} is UP (${res.status})`);

        } catch (err) {
            if (err.code === "ECONNABORTED") {
                log(`⏳ ${service.name} TIMEOUT`);
            } else if (err.response) {
                log(`⚠️ ${service.name} responded (${err.response.status})`);
            } else {
                log(`❌ ${service.name} ERROR: ${err.message}`);
            }
        }
    });

    await Promise.allSettled(promises);

    const duration = Date.now() - startTime;
    log(`Ping cycle completed in ${duration / 1000} seconds`);
    console.log("────────────────────────────────────────");
};

// Start bot
log("🚀 QueueINDIA Parallel Ping Bot Started...");
log(`⏰ Interval: ${PING_INTERVAL / 60000} minutes`);
log(`🛑 Auto-stop after: ${MAX_RUNTIME / 60000} minutes`);
console.log("────────────────────────────────────────");

// Run immediately
pingAllServices();

// Run at interval
const intervalId = setInterval(pingAllServices, PING_INTERVAL);

// Auto stop
setTimeout(() => {
    log(`🛑 ${MAX_RUNTIME / (60 * 60 * 1000)} hours done, stopping bot...`);
    clearInterval(intervalId);
    process.exit(0);
}, MAX_RUNTIME);

// Graceful stop
process.on("SIGINT", () => {
    log("🛑 Bot stopped manually (Ctrl+C). Goodbye!");
    clearInterval(intervalId);
    process.exit(0);
});