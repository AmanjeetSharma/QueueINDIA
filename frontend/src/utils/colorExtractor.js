// utils/colorExtractor.js

/**
 * Improved color extraction using multiple algorithms with fallbacks
 */

// Main function to get dominant color with multiple fallback methods
export const getDominantColor = (imageUrl) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Use larger canvas for better accuracy but sample fewer pixels
                canvas.width = 100;
                canvas.height = 100;
                ctx.drawImage(img, 0, 0, 100, 100);

                const imageData = ctx.getImageData(0, 0, 100, 100);
                const data = imageData.data;

                // Try multiple methods in sequence
                let color = tryVibrantColorExtraction(data) ||
                    tryAverageColorExtraction(data) ||
                    tryMostFrequentColor(data) ||
                    'rgb(99, 102, 241)'; // Final fallback

                resolve(color);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = () => resolve('rgb(99, 102, 241)');
    });
};

// Method 1: Extract vibrant, saturated colors
const tryVibrantColorExtraction = (data) => {
    const colorBuckets = {};
    let bestScore = -1;
    let bestColor = null;

    for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Skip transparent and mostly transparent pixels
        if (a < 128) continue;

        const [h, s, l] = rgbToHsl(r, g, b);

        // Score colors based on vibrancy and appeal
        const score = calculateColorScore(r, g, b, h, s, l);

        if (score > bestScore) {
            bestScore = score;
            bestColor = { r, g, b, h, s, l };
        }
    }

    return bestColor ? `rgb(${bestColor.r}, ${bestColor.g}, ${bestColor.b})` : null;
};

// Method 2: Simple average color (good fallback)
const tryAverageColorExtraction = (data) => {
    let rTotal = 0, gTotal = 0, bTotal = 0, count = 0;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 128) continue; // Skip transparent pixels

        rTotal += r;
        gTotal += g;
        bTotal += b;
        count++;
    }

    if (count === 0) return null;

    const r = Math.round(rTotal / count);
    const g = Math.round(gTotal / count);
    const b = Math.round(bTotal / count);

    // Adjust if color is too dark or light
    const [h, s, l] = rgbToHsl(r, g, b);
    const adjusted = adjustColorForBanner(r, g, b, h, s, l);

    return `rgb(${adjusted.r}, ${adjusted.g}, ${adjusted.b})`;
};

// Method 3: Most frequent color (simple but effective)
const tryMostFrequentColor = (data) => {
    const colorMap = {};
    let maxCount = 0;
    let dominantColor = null;

    // Quantize colors to reduce variations
    for (let i = 0; i < data.length; i += 8) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        if (a < 128) continue;

        // Quantize to reduce similar colors
        const quantized = quantizeColor(r, g, b);
        const colorKey = `${quantized.r},${quantized.g},${quantized.b}`;

        colorMap[colorKey] = (colorMap[colorKey] || 0) + 1;

        if (colorMap[colorKey] > maxCount) {
            maxCount = colorMap[colorKey];
            dominantColor = quantized;
        }
    }

    if (dominantColor) {
        const [h, s, l] = rgbToHsl(dominantColor.r, dominantColor.g, dominantColor.b);
        const adjusted = adjustColorForBanner(dominantColor.r, dominantColor.g, dominantColor.b, h, s, l);
        return `rgb(${adjusted.r}, ${adjusted.g}, ${adjusted.b})`;
    }

    return null;
};

// Color scoring function for vibrant extraction
const calculateColorScore = (r, g, b, h, s, l) => {
    let score = 0;

    // Prefer medium lightness (neither too dark nor too light)
    const lightnessScore = 1 - Math.abs(l - 60) / 60; // Peak at 60% lightness
    score += lightnessScore * 0.4;

    // Prefer higher saturation
    const saturationScore = s / 100;
    score += saturationScore * 0.4;

    // Prefer warm colors (reds, oranges, yellows) - they're generally more appealing
    let hueScore = 1;
    if (h >= 0 && h <= 60) { // Reds to yellows - high score
        hueScore = 1.2;
    } else if (h > 60 && h <= 180) { // Greens to cyans - medium score
        hueScore = 0.8;
    } else { // Blues to magentas - lower score
        hueScore = 0.6;
    }
    score += hueScore * 0.2;

    // Penalize grays
    if (s < 20) score *= 0.5;

    return score;
};

// Quantize colors to reduce similar variations
const quantizeColor = (r, g, b, steps = 8) => {
    return {
        r: Math.round(r / steps) * steps,
        g: Math.round(g / steps) * steps,
        b: Math.round(b / steps) * steps
    };
};

// Adjust color to be suitable for banner background
const adjustColorForBanner = (r, g, b, h, s, l) => {
    let adjusted = { r, g, b, h, s, l };

    // If color is too dark, lighten it
    if (l < 25) {
        adjusted = lightenColor(adjusted, 40);
    }
    // If color is too light, darken it
    else if (l > 85) {
        adjusted = darkenColor(adjusted, 30);
    }

    // Boost saturation if it's too low
    if (adjusted.s < 40) {
        adjusted.s = Math.min(adjusted.s + 30, 80);
        // Convert back to RGB
        const rgb = hslToRgb(adjusted.h / 360, adjusted.s / 100, adjusted.l / 100);
        adjusted.r = Math.round(rgb[0] * 255);
        adjusted.g = Math.round(rgb[1] * 255);
        adjusted.b = Math.round(rgb[2] * 255);
    }

    return adjusted;
};

const lightenColor = (color, amount) => {
    const newL = Math.min(color.l + amount, 95);
    return { ...color, l: newL };
};

const darkenColor = (color, amount) => {
    const newL = Math.max(color.l - amount, 5);
    return { ...color, l: newL };
};

// Enhanced RGB to HSL conversion
export const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
};

// HSL to RGB conversion
const hslToRgb = (h, s, l) => {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r, g, b];
};

// Improved gradient creation with better color harmony
export const createGradientFromColor = (rgbColor) => {
    const match = rgbColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return 'linear-gradient(135deg, #6366f1, #8b5cf6)';

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    const [h, s, l] = rgbToHsl(r, g, b);

    // Create harmonious gradient colors
    const baseColor = `hsl(${h}, ${s}%, ${l}%)`;

    // Slightly lighter version
    const lighterColor = `hsl(${h}, ${Math.min(s + 5, 100)}%, ${Math.min(l + 8, 95)}%)`;

    // Analogous color (30 degrees apart) for harmony
    const analogousH = (h + 30) % 360;
    const analogousColor = `hsl(${analogousH}, ${Math.min(s + 10, 100)}%, ${Math.max(l - 5, 15)}%)`;

    return `linear-gradient(135deg, ${lighterColor}, ${analogousColor})`;
};

// Alternative: Simple gradient for when complex gradients don't work well
export const createSimpleGradient = (rgbColor) => {
    const match = rgbColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return 'linear-gradient(135deg, #6366f1, #8b5cf6)';

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    const [h, s, l] = rgbToHsl(r, g, b);

    const color1 = `hsl(${h}, ${s}%, ${Math.min(l + 15, 95)}%)`;
    const color2 = `hsl(${h}, ${Math.min(s + 20, 100)}%, ${Math.max(l - 10, 15)}%)`;

    return `linear-gradient(135deg, ${color1}, ${color2})`;
};

// Utility to check if color is suitable for text overlay
export const getTextColorForBackground = (rgbColor) => {
    const match = rgbColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return '#ffffff';

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5 ? '#000000' : '#ffffff';
};