import rateLimit from "express-rate-limit";

const json429 = (_req: unknown, res: { status: (n: number) => { json: (b: object) => void } }) =>
  res.status(429).json({
    error: "Too many requests — please wait and try again.",
    code: "RATE_LIMITED",
  });

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: json429,
  skip: (req) => req.path === "/api/healthz",
});

export const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: json429,
  message: "Too many checkout attempts — please wait 15 minutes.",
});

export const lookupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: json429,
  skipSuccessfulRequests: false,
});

export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: json429,
});
