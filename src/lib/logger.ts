type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(meta && { meta }),
    };

    if (this.isDevelopment) {
      console.log(JSON.stringify(logEntry, null, 2));
      return;
    }

    switch (level) {
      case "debug":
        console.debug(logEntry);
        break;
      case "info":
        console.info(logEntry);
        break;
      case "warn":
        console.warn(logEntry);
        break;
      case "error":
        console.error(logEntry);
        break;
    }
  }

  debug(message: string, meta?: any) {
    this.formatMessage("debug", message, meta);
  }

  info(message: string, meta?: any) {
    this.formatMessage("info", message, meta);
  }

  warn(message: string, meta?: any) {
    this.formatMessage("warn", message, meta);
  }

  error(message: string, error?: Error | any, meta?: any) {
    const errorMeta = {
      ...meta,
      ...(error instanceof Error
        ? { errorMessage: error.message, errorStack: error.stack, errorName: error.name }
        : { error }),
    };
    this.formatMessage("error", message, errorMeta);
  }
}

export const logger = new Logger();
