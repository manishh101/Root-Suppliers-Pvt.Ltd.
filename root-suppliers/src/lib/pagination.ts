import { NextRequest } from "next/server";
import { PaginationMetadata } from "@/types/api";

/**
 * Extract pagination parameters from a request URL
 */
export function getPaginationParams(req: NextRequest, defaultLimit: number = 10) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || defaultLimit.toString())));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Format raw data into a standard pagination metadata object
 */
export function formatPaginationMetadata(
  total: number,
  page: number,
  limit: number
): PaginationMetadata {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
