export const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === "production";
    console.log("Cookie Options - isProduction:", isProduction);

    return {
        httpOnly: true,

        //secure cookies only in production (HTTPS)
        secure: isProduction,

        //SameSite rules for cross-domain production
        sameSite: isProduction ? "None" : "Lax",

        path: "/",
    };
};
``