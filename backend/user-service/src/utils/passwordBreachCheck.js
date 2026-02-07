import crypto from "crypto";
import axios from "axios";

const isPasswordBreached = async (password) => {
    // 1️⃣ SHA-1 hash (uppercase, required by HIBP)
    const sha1 = crypto
        .createHash("sha1")
        .update(password)
        .digest("hex")
        .toUpperCase();

    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    // 2️⃣ Query HIBP with prefix
    const response = await axios.get(
        `https://api.pwnedpasswords.com/range/${prefix}`,
        {
            headers: {
                "Add-Padding": "true" // prevents timing attacks
            },
            timeout: 5000
        }
    );

    // 3️⃣ Check if suffix exists
    const hashes = response.data.split("\n");

    for (const line of hashes) {
        const [hashSuffix, count] = line.split(":");
        if (hashSuffix === suffix) {
            return {
                breached: true,
                count: Number(count)
            };
        }
    }

    return {
        breached: false,
        count: 0
    };
};

export {
    isPasswordBreached
}