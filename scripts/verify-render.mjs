#!/usr/bin/env node

const args = process.argv.slice(2);
const soft = args.includes("--soft") || process.env.RENDER_VERIFY_SOFT === "true";
const baseUrl = (args.find((arg) => !arg.startsWith("--")) || process.env.RENDER_URL || "").replace(/\/$/, "");
const retries = Number(process.env.RENDER_VERIFY_RETRIES || 6);
const delayMs = Number(process.env.RENDER_VERIFY_DELAY_MS || 15000);
const timeoutMs = Number(process.env.RENDER_VERIFY_TIMEOUT_MS || 20000);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

if (!baseUrl) {
  console.error("Missing Render URL. Usage: npm run verify:render -- https://your-service.onrender.com");
  process.exit(1);
}

const checks = [
  { path: "/", expected: [200], label: "Landing page" },
  { path: "/api/health", expected: [200], label: "Health API", json: true },
  { path: "/api/deployment/status", expected: [200], label: "Deployment status API", json: true },
  { path: "/login", expected: [200], label: "Login page" },
  { path: "/admin", expected: [200, 307, 308], label: "Admin page" },
  { path: "/admin/users", expected: [200, 307, 308], label: "Users page" },
  { path: "/admin/security", expected: [200, 307, 308], label: "Security/RBAC page" },
  { path: "/dashboard/store-builder", expected: [200, 307, 308], label: "Store Builder page" }
];

async function runCheck(check) {
  const url = `${baseUrl}${check.path}`;
  const started = Date.now();
  try {
    const response = await fetchWithTimeout(url, { redirect: "manual" });
    const durationMs = Date.now() - started;
    const passStatus = check.expected.includes(response.status);
    let jsonPass = true;
    let note = "";

    if (check.json && passStatus) {
      const data = await response.json().catch(() => null);
      jsonPass = Boolean(data?.ok);
      if (!jsonPass) note = "JSON response missing ok:true";
      if (check.path === "/api/deployment/status" && data?.checks?.secretsExposed !== false) {
        jsonPass = false;
        note = "Deployment status did not confirm secretsExposed:false";
      }
    }

    return { ...check, url, status: response.status, durationMs, pass: passStatus && jsonPass, note };
  } catch (error) {
    return {
      ...check,
      url,
      status: "FETCH_ERROR",
      durationMs: Date.now() - started,
      pass: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

let finalResults = [];

for (let attempt = 1; attempt <= retries; attempt += 1) {
  finalResults = [];
  for (const check of checks) {
    finalResults.push(await runCheck(check));
  }
  const failed = finalResults.filter((item) => !item.pass);
  if (failed.length === 0) break;
  if (attempt < retries) {
    console.log(`Render verification attempt ${attempt}/${retries} failed. Retrying in ${delayMs / 1000}s...`);
    await sleep(delayMs);
  }
}

console.log("\nSAR INDUSTRIES NETWORK — Render Verification Report");
console.log("Target:", baseUrl);
console.log("Generated:", new Date().toISOString());
console.log("Retries:", retries);
console.log("Soft mode:", soft ? "enabled" : "disabled");
console.log("--------------------------------------------------");

for (const result of finalResults) {
  const icon = result.pass ? "PASS" : "FAIL";
  console.log(`${icon} | ${result.label} | ${result.path} | status=${result.status} | ${result.durationMs}ms`);
  if (result.note) console.log(`     Note: ${result.note}`);
  if (result.error) console.log(`     Error: ${result.error}`);
}

const failed = finalResults.filter((item) => !item.pass);
console.log("--------------------------------------------------");
console.log(`Passed: ${finalResults.length - failed.length}/${finalResults.length}`);

if (failed.length > 0) {
  console.error("Render verification found failing routes. Check failed routes above and review Render build/runtime logs.");
  if (!soft) process.exit(1);
}

console.log(failed.length === 0 ? "Render verification passed." : "Render verification completed in soft mode with warnings.");
