import { createClient } from "@vercel/global-config";

export type SiteMode = "normal" | "maintenance";

export async function getSiteMode(): Promise<SiteMode> {
  // Local preview only. Production is controlled by Global Config.
  if (process.env.NODE_ENV === "development" && process.env.SITE_MODE) {
    return process.env.SITE_MODE === "maintenance" ? "maintenance" : "normal";
  }

  const connection = process.env.GLOBAL_CONFIG || process.env.EDGE_CONFIG;
  if (!connection) return "normal";

  try {
    const mode = await createClient(connection, { staleIfError: false }).get("siteMode");
    if (mode !== "normal" && mode !== "maintenance") {
      throw new Error("Invalid siteMode");
    }
    return mode;
  } catch {
    // Once configured, do not expose the backend if the switch cannot be read.
    // Avoid logging SDK errors, which can contain the connection string.
    console.error("Unable to read siteMode; serving maintenance until config recovers.");
    return "maintenance";
  }
}
