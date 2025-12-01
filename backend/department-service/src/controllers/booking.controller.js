import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Department } from "../models/department.model.js";
import { Booking } from "../models/booking.model.js";

dayjs.extend(utc);
dayjs.extend(timezone);

// Force timezone India
const TZ = "Asia/Kolkata";


const getWorkingDays = asyncHandler(async (req, res) => {
    const { deptId } = req.params;

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    const { workingHours, tokenManagement } = department;
    const { bookingWindowDays } = tokenManagement;

    const results = [];

    for (let i = 0; i < bookingWindowDays; i++) {
        const date = dayjs().tz(TZ).add(i, "day");
        const dayKey = date.format("ddd"); // "Mon", "Tue", etc.

        const config = workingHours.find((w) => w.day === dayKey);

        if (!config) continue; // not defined at all

        results.push({
            date: date.format("YYYY-MM-DD"),
            day: config.day,
            isClosed: config.isClosed,
            openTime: config.isClosed ? null : config.openTime,
            closeTime: config.isClosed ? null : config.closeTime,
            isToday: i === 0
        });
    }

    return res.json(
        new ApiResponse(200, results, "Available working days returned successfully")
    );
});






// Get Available Slots for a given date and service
const getAvailableSlots = asyncHandler(async (req, res) => {
    const { deptId, serviceId } = req.params;
    const { date } = req.query;

    if (!date) throw new ApiError(400, "Date query param is required");

    const department = await Department.findById(deptId);
    if (!department) throw new ApiError(404, "Department not found");

    const { workingHours, tokenManagement } = department;
    const { slotWindows } = tokenManagement;

    if (!slotWindows || slotWindows.length === 0) {
        throw new ApiError(400, "No slot windows configured for department");
    }

    const dayOfWeek = dayjs(date).tz(TZ).format("ddd");
    const workingDay = workingHours.find((d) => d.day === dayOfWeek);

    if (!workingDay || workingDay.isClosed) {
        throw new ApiError(400, "Department is closed on the selected date");
    }

    const results = [];

    for (const slot of slotWindows) {
        const windowTime = `${slot.start}-${slot.end}`;

        const totalBooked = await Booking.countDocuments({
            department: deptId,
            service: serviceId,
            date,
            slotTime: windowTime,
        });

        results.push({
            time: windowTime,
            maxTokens: slot.maxTokens,
            remaining: Math.max(0, slot.maxTokens - totalBooked),
            isFullyBooked: totalBooked >= slot.maxTokens,
        });
    }

    return res.json(
        new ApiResponse(200, results, "Slot windows fetched successfully")
    );
});

export { getWorkingDays, getAvailableSlots };
