import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * @desc Ensures ADMIN / OFFICER can access ONLY their assigned department
 * SUPER_ADMIN bypasses automatically
 */

export const checkDeptScope = asyncHandler(async (req, res, next) => {
  const { deptId } = req.params;

  if (!deptId) {
    throw new ApiError(400, "Department ID missing in request");
  }

  // SUPER ADMIN always allowed
  if (req.user.role === "SUPER_ADMIN") {
    return next();
  }

  // Admin/Officer must have a department assigned
  if (!req.user.departmentId) {
    throw new ApiError(403, "Access denied: No department is assigned to your account");
  }

  // Must match requested department
  if (req.user.departmentId.toString() !== deptId.toString()) {
    throw new ApiError(
      403,
      "Access denied: You do not belong to this department"
    );
  }

  next();
});
