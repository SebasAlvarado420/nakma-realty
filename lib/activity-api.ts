import { supabase } from "@/lib/supabase";

// Activity log / Historial — records who changed what, and when. Written on
// every admin mutation (create / update / delete / archive / restore a listing,
// and any business-settings change). Readable only by authenticated admins.
// Best-effort: logging never throws into the caller, so a logging hiccup can
// never block an actual save.
export type ActivityAction =
  | "created"
  | "updated"
  | "deleted"
  | "archived"
  | "restored"
  | "settings_updated"
  | "translated";

export type ActivityLog = {
  id: string;
  createdAt: string;
  actor: string;
  action: ActivityAction | string;
  entity: string;
  entityLabel: string;
  details?: Record<string, unknown> | null;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function rowToLog(r: any): ActivityLog {
  return {
    id: r.id,
    createdAt: r.created_at,
    actor: r.actor ?? "—",
    action: r.action ?? "",
    entity: r.entity ?? "",
    entityLabel: r.entity_label ?? "",
    details: r.details ?? null,
  };
}

// Resolve the current admin's email for attribution (best-effort).
async function currentActor(): Promise<string> {
  if (!supabase) return "system";
  try {
    const { data } = await supabase.auth.getUser();
    return data.user?.email ?? "admin";
  } catch {
    return "admin";
  }
}

export async function logActivity(entry: {
  action: ActivityAction | string;
  entity: string;
  entityLabel: string;
  details?: Record<string, unknown> | null;
}): Promise<void> {
  if (!supabase) return;
  try {
    const actor = await currentActor();
    await supabase.from("activity_logs").insert({
      actor,
      action: entry.action,
      entity: entry.entity,
      entity_label: entry.entityLabel,
      details: entry.details ?? null,
    });
  } catch {
    /* never block a real save on a logging failure */
  }
}

export async function fetchActivityLogs(limit = 100): Promise<ActivityLog[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data.map(rowToLog);
  } catch {
    return [];
  }
}
