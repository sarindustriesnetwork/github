#!/usr/bin/env node

const args = process.argv.slice(2);
const hookArg = args.find((arg) => !arg.startsWith("--"));
const required = args.includes("--required") || process.env.RENDER_DEPLOY_REQUIRED === "true";
const hookUrl = hookArg || process.env.RENDER_DEPLOY_HOOK_URL || "";

if (!hookUrl) {
  const message = "RENDER_DEPLOY_HOOK_URL is not configured. Skipping Render deploy trigger.";
  if (required) {
    console.error(message);
    process.exit(1);
  }
  console.log(message);
  process.exit(0);
}

try {
  const response = await fetch(hookUrl, { method: "POST" });
  const text = await response.text().catch(() => "");
  if (!response.ok) {
    console.error(`Render deploy hook failed with status ${response.status}.`);
    if (text) console.error(text);
    process.exit(1);
  }
  console.log("Render deploy hook triggered successfully.");
  if (text) console.log(text);
} catch (error) {
  console.error("Render deploy hook request failed.");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
