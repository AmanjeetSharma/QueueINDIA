// Format address for display
export const formatAddress = (address) => {
    if (!address) return 'N/A';
    const parts = [
        address.street,
        address.city,
        address.district,
        address.state,
        address.pincode
    ].filter(Boolean);
    return parts.join(', ');
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