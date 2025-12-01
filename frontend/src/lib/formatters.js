// lib/formatters.js

// Format address object to string
export const formatAddress = (address) => {
    if (!address || typeof address !== 'object') return 'Address not available';

    const parts = [];

    // Safely extract address parts
    if (address.street && address.street.trim()) parts.push(address.street.trim());
    if (address.city && address.city.trim()) parts.push(address.city.trim());
    if (address.district && address.district.trim()) parts.push(address.district.trim());
    if (address.state && address.state.trim()) parts.push(address.state.trim());
    if (address.pincode && address.pincode.trim()) parts.push(address.pincode.trim());

    return parts.length > 0 ? parts.join(', ') : 'Address not available';
};

// Format time from "HH:MM" to readable format
export const formatTime = (timeString) => {
    if (!timeString || typeof timeString !== 'string') return 'N/A';

    try {
        const [hours, minutes] = timeString.split(':').map(num => parseInt(num, 10));

        if (isNaN(hours) || isNaN(minutes)) return timeString;

        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12; // Convert 0 to 12, 13 to 1, etc.
        const displayMinutes = minutes.toString().padStart(2, '0');

        return `${displayHours}:${displayMinutes} ${period}`;
    } catch (error) {
        console.warn('Error formatting time:', error);
        return timeString;
    }
};

// Format date string to readable format
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);

        // Check if date is valid
        if (isNaN(date.getTime())) return 'Invalid date';

        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch (error) {
        console.warn('Error formatting date:', error);
        return 'Invalid date';
    }
};
// Format service duration
export const formatServiceDuration = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Format phone number
export const formatPhoneNumber = (phone) => {
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
};

// Format document requirements
export const formatDocumentRequirements = (docs) => {
    if (!docs || docs.length === 0) return 'No documents required';
    const mandatory = docs.filter(doc => doc.isMandatory).length;
    const optional = docs.length - mandatory;
    return `${mandatory} mandatory, ${optional} optional`;
};