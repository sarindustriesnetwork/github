import { prisma } from "@/lib/db/prisma";

type AuditInput = {
  actorId?: string | null;
  action: string;
  module: string;
  targetId?: string | null;
  oldValue?: unknown;
  newValue?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
};

export async function createAuditLog(input: AuditInput) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId || undefined,
        action: input.action,
        module: input.module,
        targetId: input.targetId || undefined,
        oldValue: input.oldValue === undefined ? undefined : (input.oldValue as any),
        newValue: input.newValue === undefined ? undefined : (input.newValue as any),
        ipAddress: input.ipAddress || undefined,
        userAgent: input.userAgent || undefined
      }
    });
  } catch {
    // Audit logging should never crash a request in localhost/demo mode.
  }
}
