import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Custom application error classes
 */
export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

export class AuthError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    this.name = "AuthError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

/**
 * Standard API error response handler
 */
export function handleApiError(error: any) {
  console.error("API Error:", error);

  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const message = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ");
    return NextResponse.json(
      { success: false, message: message || "Validation Error" },
      { status: 400 }
    );
  }

  // Mongoose Duplicate Key Error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return NextResponse.json(
      { success: false, message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` },
      { status: 409 }
    );
  }

  // Mongoose Validation Error
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((val: any) => val.message).join(", ");
    return NextResponse.json(
      { success: false, message: message || "Validation Error" },
      { status: 400 }
    );
  }

  // Default server error
  return NextResponse.json(
    { success: false, message: "Internal Server Error" },
    { status: 500 }
  );
}

/**
 * Standard success response helper
 */
export function successResponse(data: any, status: number = 200, message?: string) {
  return NextResponse.json(
    {
      success: true,
      ...data,
      ...(message && { message }),
    },
    { status }
  );
}
