export const getJwtSecret: () => string = () => process.env.SECRET_KEY ?? "secret";
export const getRefreshTokenSecret: () => string = () => process.env.REFRESH_SECRET_KEY ?? "refresh_secret";
export const getJwtExpiration: () => string = () => process.env.JWT_EXPIRATION || "15m";