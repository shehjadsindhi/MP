export interface ErrorMonitoringConfig {
  dsn?: string;
  environment?: string;
  release?: string;
  tracesSampleRate?: number;
  replaysSessionSampleRate?: number;
  replaysOnErrorSampleRate?: number;
}

let initialized = false;

export function initErrorMonitoring(config: ErrorMonitoringConfig) {
  if (initialized) return;
  if (!config.dsn) return;

  try {
    // Dynamic require to avoid bundling in dev without DSN
    // This allows tree-shaking when not configured
    const sentry = require("@sentry/nextjs");
    
    sentry.init({
      dsn: config.dsn,
      environment: config.environment || process.env.NODE_ENV || "development",
      release: config.release || process.env.VERCEL_GIT_COMMIT_SHA,
      tracesSampleRate: config.tracesSampleRate ?? 0.1,
      replaysSessionSampleRate: config.replaysSessionSampleRate ?? 0.1,
      replaysOnErrorSampleRate: config.replaysOnErrorSampleRate ?? 1.0,
    });

    initialized = true;
  } catch (error) {
    console.warn("Sentry initialization failed:", error);
  }
}

export function captureException(error: Error, context?: Record<string, any>) {
  if (!initialized) return;
  
  try {
    const sentry = require("@sentry/nextjs");
    sentry.captureException(error, {
      extra: context,
    });
  } catch {
    // Sentry not available
  }
}

export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  if (!initialized) return;

  try {
    const sentry = require("@sentry/nextjs");
    sentry.captureMessage(message, level);
  } catch {
    // Sentry not available
  }
}

export function setUserContext(user: { id: string; email?: string; role?: string }) {
  if (!initialized) return;

  try {
    const sentry = require("@sentry/nextjs");
    sentry.setUser({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch {
    // Sentry not available
  }
}

export function clearUserContext() {
  if (!initialized) return;

  try {
    const sentry = require("@sentry/nextjs");
    sentry.setUser(null);
  } catch {
    // Sentry not available
  }
}
