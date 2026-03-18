const errorHandler = (err, req, res, next) => {
    console.error("💥 ERROR: ", err);
    // console.error("💥 ERROR: ", {
    //     statusCode: err.statusCode,
    //     message: err.message,
    //     errors: err.errors || [],
    //     stack: err.stack,
    // }, err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "development" ? err.stack : {},
    });
};

export { errorHandler };
