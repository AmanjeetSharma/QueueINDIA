/**
 * ============================
 *  Input Validators Utility
 * ============================
 * This module provides reusable validation
 * functions for user registration and update logic.
 * Each validator returns a boolean (true = valid).
 */

export const emailValidator = (email) => {
    /**
     * Validates email format.
     * Matches common formats like: user.name@domain.com
     */
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
};


/**
 * ============================
 * Password Validator with Detailed Feedback
 * ============================
 */

export const passwordValidator = (password) => {
    const errors = [];

    if (password.length < 8) {
        errors.push("at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("an uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("a lowercase letter");
    }
    if (!/\d/.test(password)) {
        errors.push("a number");
    }
    if (!/[\W_]/.test(password)) {
        errors.push("a special character");
    }

    return {
        valid: errors.length === 0,
        errors, // array of missing rules
    };
};



export const avatarValidator = (file) => {
    /**
     * Validates uploaded avatar file.
     * Allowed MIME types: JPEG, PNG, WEBP.
     * Maximum size: 2 MB.
     */
    const maxSize = 2 * 1024 * 1024; // 2 MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    // Allow null/undefined if avatar is optional
    if (!file) return true;

    return file.size <= maxSize && allowedTypes.includes(file.mimetype);
};

export const phoneValidator = (phone) => {
    // Indian 10-digit phone number validation
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phone);
};
