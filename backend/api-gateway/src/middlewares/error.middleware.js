const errorHandler = (err, req, res, next) => {
    console.error("🔥 Error caught in middleware:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    // console.error("Error details:", {
    //     statusCode,
    //     message,
    //     errors: err.errors || [],
    //     stack: err.stack,
    // });
    return res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "development" ? err.stack : {},
    });
};

export { errorHandler };
