export type AppErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
    traceId: string;
    timestamp: string;
  };
};

export function createTraceId(prefix = "trace") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createErrorResponse(code: string, message: string, details?: string): AppErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details,
      traceId: createTraceId("err"),
      timestamp: new Date().toISOString()
    }
  };
}
