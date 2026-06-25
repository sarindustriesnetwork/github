import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "DATABASE_UNAVAILABLE"
  | "INTERNAL_ERROR";

export type ApiErrorPayload = {
  code: ApiErrorCode | string;
  message: string;
  details?: unknown;
};

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function apiError(error: ApiErrorPayload, status = 500) {
  return NextResponse.json({ success: false, error }, { status });
}

export function validationError(message: string, details?: unknown) {
  return apiError({ code: "VALIDATION_ERROR", message, details }, 400);
}
