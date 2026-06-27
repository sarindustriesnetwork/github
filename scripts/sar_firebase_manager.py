#!/usr/bin/env python3
"""
SAR INDUSTRIES NETWORK — Firebase platform manager.

Self-contained Python manager for Firebase App Hosting + Firestore migration.
It audits configuration, repairs safe Firebase setup files, installs packages,
builds the Next.js app, and verifies the live Firebase deployment.

No real secrets are written to repository files.
"""

from __future__ import annotations

import argparse
import json
import os
import platform
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path

APP_NAME = "SAR INDUSTRIES NETWORK"
DEFAULT_FIREBASE_URL = ""
DEFAULT_ADMIN_EMAIL = "admin@sarindustriesnetwork.com"
NODE_VERSION = "20.20.0"
ROOT = Path(__file__).resolve().parents[1]


@dataclass
class CheckResult:
  name: str
  passed: bool
  detail: str = ""


class ManagerError(RuntimeError):
  pass


def log(message: str) -> None:
  print(f"[SAR Firebase] {message}")


def command_exists(command: str) -> bool:
  return shutil.which(command) is not None


def run(command: list[str], *, env: dict[str, str] | None = None) -> None:
  log("Running: " + " ".join(command))
  subprocess.run(command, cwd=ROOT, env={**os.environ, **(env or {})}, check=True, text=True, stdout=sys.stdout, stderr=sys.stderr)


def read_json(path: Path) -> dict:
  return json.loads(path.read_text(encoding="utf-8"))


def write_text(path: Path, content: str) -> None:
  path.parent.mkdir(parents=True, exist_ok=True)
  if path.exists() and path.read_text(encoding="utf-8") == content:
    log(f"unchanged: {path.relative_to(ROOT)}")
    return
  path.write_text(content, encoding="utf-8")
  log(f"wrote: {path.relative_to(ROOT)}")


def write_json(path: Path, value: dict) -> None:
  write_text(path, json.dumps(value, indent=2) + "\n")


def configure() -> None:
  package_path = ROOT / "package.json"
  package = read_json(package_path)
  package["version"] = "2.5.0-firebase"
  package.setdefault("engines", {})["node"] = ">=20.0.0"
  package["scripts"] = {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "preflight": "node scripts/preflight.mjs",
    "check": "npm run preflight && npm run typecheck && npm run build",
    "verify:firebase": "node scripts/verify-firebase.mjs",
    "firebase:emulators": "firebase emulators:start --only firestore,auth,hosting",
    "platform": "python scripts/sar_firebase_manager.py",
    "platform:all": "python scripts/sar_firebase_manager.py all"
  }
  package["dependencies"] = {
    "firebase": "^12.0.0",
    "firebase-admin": "^13.0.0",
    "next": "14.2.35",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
  package["devDependencies"] = {
    "@types/node": "20.19.1",
    "@types/react": "18.3.23",
    "@types/react-dom": "18.3.7",
    "eslint": "8.57.0",
    "eslint-config-next": "14.2.35",
    "firebase-tools": "^14.0.0",
    "typescript": "5.9.2"
  }
  write_json(package_path, package)
  write_text(ROOT / ".npmrc", "registry=https://registry.npmjs.org/\nfund=false\naudit=false\nlegacy-peer-deps=false\n")
  write_text(ROOT / ".node-version", NODE_VERSION + "\n")
  write_text(ROOT / ".env.example", (
    f"APP_NAME=\"{APP_NAME}\"\n"
    "NEXT_PUBLIC_APP_URL=http://localhost:3000\n"
    f"DEFAULT_ADMIN_EMAIL={DEFAULT_ADMIN_EMAIL}\n"
    "NEXT_PUBLIC_RIGHTS_NOTICE=\"Copyright 2026 SAR INDUSTRIES NETWORK. All rights reserved.\"\n\n"
    "FIREBASE_PROJECT_ID=your-firebase-project-id\n"
    "NEXT_PUBLIC_FIREBASE_ENABLED=true\n"
    "NEXT_PUBLIC_FIREBASE_API_KEY=your-public-web-api-key\n"
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com\n"
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id\n"
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com\n"
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id\n"
    "NEXT_PUBLIC_FIREBASE_APP_ID=your-web-app-id\n"
  ))
  write_text(ROOT / "apphosting.yaml", (
    "runConfig:\n"
    "  minInstances: 0\n"
    "  maxInstances: 2\n"
    "  concurrency: 80\n"
    "  cpu: 1\n"
    "  memoryMiB: 512\n\n"
    "env:\n"
    "  - variable: NODE_ENV\n"
    "    value: production\n"
    "    availability:\n"
    "      - RUNTIME\n"
    "  - variable: DEFAULT_ADMIN_EMAIL\n"
    f"    value: {DEFAULT_ADMIN_EMAIL}\n"
    "    availability:\n"
    "      - BUILD\n"
    "      - RUNTIME\n"
    "  - variable: NEXT_PUBLIC_FIREBASE_ENABLED\n"
    "    value: \"true\"\n"
    "    availability:\n"
    "      - BUILD\n"
    "      - RUNTIME\n"
  ))


def audit() -> bool:
  required_files = [
    "package.json", ".npmrc", ".env.example", "apphosting.yaml", "firebase.json", "firestore.rules", "firestore.indexes.json",
    ".github/workflows/build.yml", "scripts/preflight.mjs", "scripts/verify-firebase.mjs", "scripts/sar_firebase_manager.py",
    "lib/firebase/admin.ts", "lib/firebase/client.ts", "lib/firebase/stores.ts", "app/api/firebase/status/route.ts", "app/api/admin/stores/route.ts"
  ]
  results: list[CheckResult] = [
    CheckResult("python", sys.version_info >= (3, 10), platform.python_version()),
    CheckResult("node", command_exists("node"), "Node.js available" if command_exists("node") else "Node.js missing"),
    CheckResult("npm", command_exists("npm"), "npm available" if command_exists("npm") else "npm missing")
  ]
  for file_name in required_files:
    results.append(CheckResult(f"file:{file_name}", (ROOT / file_name).exists(), file_name))
  package = read_json(ROOT / "package.json")
  for script in ["dev", "build", "start", "typecheck", "preflight", "check", "verify:firebase", "platform", "platform:all"]:
    results.append(CheckResult(f"script:{script}", bool(package.get("scripts", {}).get(script)), script))

  failed = [item for item in results if not item.passed]
  print("\nSAR INDUSTRIES NETWORK — Firebase Audit")
  print("Root:", ROOT)
  print("--------------------------------------------------")
  for item in results:
    print(f"{'PASS' if item.passed else 'FAIL'} | {item.name} | {item.detail}")
  print("--------------------------------------------------")
  print(f"Passed: {len(results) - len(failed)}/{len(results)}")
  return not failed


def install() -> None:
  run(["npm", "install", "--registry=https://registry.npmjs.org/"])


def build() -> None:
  env = {"DEFAULT_ADMIN_EMAIL": DEFAULT_ADMIN_EMAIL, "DEFAULT_ADMIN_PASSWORD": os.environ.get("DEFAULT_ADMIN_PASSWORD", "build-check-placeholder")}
  run(["npm", "run", "check"], env=env)


def verify(url: str, soft: bool) -> None:
  if not url:
    message = "Firebase App URL missing. Set FIREBASE_APP_URL or pass --url."
    if soft:
      log(message + " Skipping live verification.")
      return
    raise ManagerError(message)
  cmd = ["npm", "run", "verify:firebase", "--", url]
  if soft:
    cmd.append("--soft")
  run(cmd)


def all_steps(args: argparse.Namespace) -> None:
  configure()
  if not audit():
    raise ManagerError("Firebase audit failed after configuration.")
  install()
  build()
  verify(args.url, soft=args.soft_verify)


def parse_args() -> argparse.Namespace:
  parser = argparse.ArgumentParser(description="SAR Industries Network Firebase platform manager")
  parser.add_argument("command", choices=["audit", "configure", "install", "build", "verify", "all"])
  parser.add_argument("--url", default=os.environ.get("FIREBASE_APP_URL", DEFAULT_FIREBASE_URL), help="Firebase App Hosting URL")
  parser.add_argument("--soft-verify", action="store_true", help="Do not fail when live URL is not configured or temporarily unavailable")
  return parser.parse_args()


def main() -> int:
  args = parse_args()
  try:
    if args.command == "audit":
      return 0 if audit() else 1
    if args.command == "configure":
      configure()
    elif args.command == "install":
      install()
    elif args.command == "build":
      build()
    elif args.command == "verify":
      verify(args.url, args.soft_verify)
    elif args.command == "all":
      all_steps(args)
    return 0
  except ManagerError as error:
    print(f"ERROR: {error}", file=sys.stderr)
    return 1
  except subprocess.CalledProcessError as error:
    print(f"ERROR: command failed with exit code {error.returncode}", file=sys.stderr)
    return error.returncode


if __name__ == "__main__":
  raise SystemExit(main())
