import { NextRequest } from "next/server";
import AuditLog from "@/lib/db/models/AuditLog";
import { logger } from "@/lib/logger";

interface AuditParams {
  userId: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  req?: NextRequest;
}

/**
 * Record an administrative action to the AuditLog collection.
 * This should be used for all non-GET admin requests.
 */
export async function recordAuditLog({
  userId,
  action,
  resource,
  resourceId,
  metadata,
  req,
}: AuditParams) {
  try {
    const ip = req?.ip || req?.headers.get("x-forwarded-for") || undefined;
    const userAgent = req?.headers.get("user-agent") || undefined;

    await AuditLog.create({
      user: userId,
      action,
      resource,
      resourceId,
      metadata,
      ip,
      userAgent,
    });

    // Also log to our structured logger for observability
    logger.info({ userId, action, resource, resourceId }, "Audit log recorded");
  } catch (error) {
    // We don't want to throw an error if logging fails, just log the failure
    logger.error({ err: error }, "Failed to record audit log");
  }
}
