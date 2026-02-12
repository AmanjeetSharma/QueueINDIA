// Validate JSON safely
const validateJsonInput = (input) => {
    if (!input.trim()) {
        return { valid: false, error: "JSON field is empty" };
    }

    try {
        const parsed = JSON.parse(input);

        if (!parsed.name || !parsed.departmentCategory) {
            return {
                valid: false,
                error: "Missing required fields: name and departmentCategory"
            };
        }

        return { valid: true, data: parsed };
    } catch (err) {
        return {
            valid: false,
            error: `Invalid JSON: ${err.message}`
        };
    }
};

export default validateJsonInput;