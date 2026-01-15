import { env } from "@/config/env";

type Level = "trace" | "debug" | "info" | "warn" | "error";

const order: Record<Level, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
};

function shouldLog(level: Level) {
  return order[level] >= order[env.LOG_LEVEL];
}

function nowIso() {
  return new Date().toISOString();
}

export function createLogger(component: string) {
  const base = { component };

  function log(level: Level, msg: string, data?: Record<string, unknown>) {
    if (!shouldLog(level)) return;

    const payload = {
      ts: nowIso(),
      level,
      msg,
      ...base,
      ...(data ? { data } : {}),
    };

    const fn =
      level === "error"
        ? console.error
        : level === "warn"
          ? console.warn
          : level === "info"
            ? console.info
            : console.log;

    fn(payload);
  }

  return {
    trace: (msg: string, data?: Record<string, unknown>) => log("trace", msg, data),
    debug: (msg: string, data?: Record<string, unknown>) => log("debug", msg, data),
    info: (msg: string, data?: Record<string, unknown>) => log("info", msg, data),
    warn: (msg: string, data?: Record<string, unknown>) => log("warn", msg, data),
    error: (msg: string, data?: Record<string, unknown>) => log("error", msg, data),
  };
}
