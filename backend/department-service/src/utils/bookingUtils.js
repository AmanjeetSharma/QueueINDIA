import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);

const TZ = "Asia/Kolkata";

// Helper function to convert time string to minutes
export const convertToMinutes = (timeString) => {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
};

// Helper function to convert minutes to time string
export const convertToTimeString = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Helper function to generate dynamic slots
export const generateDynamicSlots = (startTime, endTime, intervalMinutes, maxTokensPerSlot) => {
    const slots = [];
    let currentTime = convertToMinutes(startTime);
    const endTimeMinutes = convertToMinutes(endTime);

    while (currentTime + intervalMinutes <= endTimeMinutes) {
        const slotStart = convertToTimeString(currentTime);
        const slotEnd = convertToTimeString(currentTime + intervalMinutes);

        slots.push({
            time: `${slotStart}-${slotEnd}`,
            start: slotStart,
            end: slotEnd,
            maxTokens: maxTokensPerSlot,
            interval: intervalMinutes
        });

        currentTime += intervalMinutes;
    }

    return slots;
};

// Helper to get current IST time
export const getCurrentIST = () => {
    return dayjs().tz(TZ);
};

// Helper to format date for display
export const formatDisplayDate = (dateStr) => {
    return dayjs(dateStr).tz(TZ).format('DD MMM YYYY');
};

// Helper to format time for display
export const formatDisplayTime = (timeStr) => {
    if (!timeStr) return '';
    const [time] = timeStr.split('-');
    return dayjs(`2000-01-01 ${time}`).format('h:mm A');
};

// Validate slot against working hours
export const isSlotWithinWorkingHours = (slot, workingDay) => {
    if (workingDay.isClosed) return false;

    const slotStartTime = convertToMinutes(slot.start);
    const slotEndTime = convertToMinutes(slot.end);
    const openTime = convertToMinutes(workingDay.openTime);
    const closeTime = convertToMinutes(workingDay.closeTime);

    return slotStartTime >= openTime && slotEndTime <= closeTime;
};

// Check if date is within booking window
export const isDateWithinBookingWindow = (date, bookingWindowDays = 7) => {
    const selectedDate = dayjs(date).tz(TZ).startOf('day');
    const today = getCurrentIST().startOf('day');
    const maxDate = today.add(bookingWindowDays, 'day');

    return !selectedDate.isBefore(today) && !selectedDate.isAfter(maxDate);
};

export { TZ };