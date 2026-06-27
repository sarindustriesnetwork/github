#!/usr/bin/env python3
"""
SAR INDUSTRIES NETWORK — All-in-one platform manager.

This file is intentionally self-contained and uses only the Python standard library.
It audits configuration, writes safe platform config files, installs dependencies,
builds the app, triggers Render deployment, and verifies the live Render app.

It never writes real secrets to GitHub-tracked files.
"""

from __future__ import annotations

import argparse
import json
import os
import platform
import re
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

APP_NAME = "SAR INDUSTRIES NETWORK"
DEFAULT_RENDER_URL = "https://github-ufs3.onrender.com"
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
    print(f"[SAR] {message}")


def run(command: list[str], *, env: dict[str, str] | None = None, check: bool = True) -> subprocess.CompletedProcess[str]:
    log("Running: " + " ".join(command))
    return subprocess.run(
        command,
        cwd=ROOT,
        env={**os.environ, **(env or {})},
        text=True,
        stdout=sys.stdout,
        stderr=sys.stderr,
        check=check,
    )


def command_exists(command: str) -> bool:
    return shutil.which(command) is not None


def node_command() -> str:
    if not command_exists("node"):
        raise ManagerError("Node.js is not installed. Install Node.js 20 LTS or newer.")
    return "node"


def npm_command() -> str:
    if not command_exists("npm"):
        raise ManagerError("npm is not available. Install Node.js 20 LTS or newer.")
    return "npm"


def ensure_dir(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def write_text(path: Path, content: str) -> None:
    ensure_dir(path)
    existing = path.read_text(encoding="utf-8") if path.exists() else None
    if existing == content:
        log(f"unchanged: {path.relative_to(ROOT)}")
        return
    path.write_text(content, encoding="utf-8")
    log(f"wrote: {path.relative_to(ROOT)}")


def read_package() -> dict:
    package_path = ROOT / "package.json"
    if not package_path.exists():
        raise ManagerError("package.json is missing.")
    return json.loads(package_path.read_text(encoding="utf-8"))


def write_package(package: dict) -> None:
    write_text(ROOT / "package.json", json.dumps(package, indent=2) + "\n")


def safe_file_scan() -> list[CheckResult]:
    ignored_dirs = {".git", "node_modules", ".next", "out", "coverage"}
    ignored_suffixes = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".ico", ".zip", ".pdf"}
    forbidden_patterns = [
        "packages.applied-caas-gateway",
        "applied-caas-gateway",
        "_authToken=",
        "DEFAULT_ADMIN_PASSWORD=Admin@",
        "DATABASE_URL=postgres://",
        "DATABASE_URL=postgresql://",
        "BEGIN PRIVATE KEY",
        "BEGIN RSA PRIVATE KEY",
    ]
    results: list[CheckResult] = []
    for path in ROOT.rglob("*"):
        if path.is_dir():
            continue
        if any(part in ignored_dirs for part in path.relative_to(ROOT).parts):
            continue
        if path.suffix.lower() in ignored_suffixes:
            continue
        try:
            content = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for pattern in forbidden_patterns:
            if pattern in content:
                results.append(CheckResult("secret-scan", False, f"Forbidden pattern found in {path.relative_to(ROOT)}: {pattern}"))
    if not results:
        results.append(CheckResult("secret-scan", True, "No forbidden secret or private registry patterns found."))
    return results


def configure() -> None:
    """Write/repair safe configuration files."""
    package = read_package()
    package["version"] = "2.3.4"
    package.setdefault("engines", {})["node"] = ">=20.0.0"
    scripts = package.setdefault("scripts", {})
    scripts.update(
        {
            "dev": "next dev",
            "build": "next build",
            "start": "next start",
            "lint": "next lint",
            "typecheck": "tsc --noEmit",
            "preflight": "node scripts/preflight.mjs",
            "check": "npm run preflight && npm run typecheck && npm run build",
            "deploy:render": "node scripts/deploy-render.mjs",
            "verify:render": "node scripts/verify-render.mjs",
            "nuclear": "python scripts/sar_nuclear_manager.py",
            "nuclear:all": "python scripts/sar_nuclear_manager.py all",
        }
    )
    package.setdefault("dependencies", {}).update(
        {
            "next": "14.2.35",
            "react": "18.3.1",
            "react-dom": "18.3.1",
        }
    )
    package.setdefault("devDependencies", {}).update(
        {
            "@types/node": "20.19.1",
            "@types/react": "18.3.23",
            "@types/react-dom": "18.3.7",
            "eslint": "8.57.0",
            "eslint-config-next": "14.2.35",
            "typescript": "5.9.2",
        }
    )
    write_package(package)

    write_text(ROOT / ".npmrc", "registry=https://registry.npmjs.org/\nfund=false\naudit=false\nlegacy-peer-deps=false\n")

    write_text(
        ROOT / ".env.example",
        f"APP_NAME=\"{APP_NAME}\"\n"
        "NEXT_PUBLIC_APP_URL=http://localhost:3000\n"
        f"DEFAULT_ADMIN_EMAIL={DEFAULT_ADMIN_EMAIL}\n"
        "# Configure local or Render admin secret outside GitHub.\n"
        "# DEFAULT_ADMIN_PASSWORD=your-secure-secret\n"
        "NEXT_PUBLIC_RIGHTS_NOTICE=\"Copyright 2026 SAR INDUSTRIES NETWORK. All rights reserved.\"\n",
    )

    write_text(
        ROOT / "render.yaml",
        "services:\n"
        "  - type: web\n"
        "    name: sar-industries-network\n"
        "    env: node\n"
        "    plan: free\n"
        "    autoDeploy: true\n"
        "    buildCommand: npm install --registry=https://registry.npmjs.org/ && npm run build\n"
        "    startCommand: npm run start\n"
        "    healthCheckPath: /api/health\n"
        "    envVars:\n"
        "      - key: NODE_VERSION\n"
        f"        value: {NODE_VERSION}\n"
        "      - key: NODE_ENV\n"
        "        value: production\n"
        "      - key: DEFAULT_ADMIN_EMAIL\n"
        f"        value: {DEFAULT_ADMIN_EMAIL}\n"
        "      - key: DEFAULT_ADMIN_PASSWORD\n"
        "        sync: false\n",
    )

    write_text(ROOT / ".node-version", NODE_VERSION + "\n")
    write_text(ROOT / ".eslintrc.json", '{\n  "extends": ["next/core-web-vitals"]\n}\n')

    write_text(
        ROOT / "docs" / "NUCLEAR_MANAGER.md",
        "# SAR Nuclear Manager\n\n"
        "The nuclear manager is a single Python control file for local setup, CI readiness, Render deploy hook triggering, live verification, and configuration repair.\n\n"
        "## File\n\n```txt\nscripts/sar_nuclear_manager.py\n```\n\n"
        "## Commands\n\n"
        "```bash\n"
        "python scripts/sar_nuclear_manager.py audit\n"
        "python scripts/sar_nuclear_manager.py configure\n"
        "python scripts/sar_nuclear_manager.py install\n"
        "python scripts/sar_nuclear_manager.py build\n"
        "python scripts/sar_nuclear_manager.py deploy --hook-url <Render deploy hook URL>\n"
        "python scripts/sar_nuclear_manager.py verify --url https://github-ufs3.onrender.com\n"
        "python scripts/sar_nuclear_manager.py all --url https://github-ufs3.onrender.com\n"
        "```\n\n"
        "## What it does\n\n"
        "- Repairs safe configuration files.\n"
        "- Confirms Node, npm, package scripts, Render blueprint, npm registry, and deployment files.\n"
        "- Runs dependency installation and production build.\n"
        "- Triggers Render deploy hook when a hook URL is supplied.\n"
        "- Verifies live Render routes.\n"
        "- Never writes real secrets to GitHub-tracked files.\n\n"
        "## Required secret setup\n\n"
        "Add private values inside Render and GitHub Actions only, not inside repository files.\n",
    )


def audit() -> bool:
    results: list[CheckResult] = []
    results.append(CheckResult("python", sys.version_info >= (3, 10), platform.python_version()))
    results.append(CheckResult("node", command_exists("node"), "node command available" if command_exists("node") else "node missing"))
    results.append(CheckResult("npm", command_exists("npm"), "npm command available" if command_exists("npm") else "npm missing"))

    required_files = [
        "package.json",
        ".npmrc",
        ".env.example",
        "render.yaml",
        ".github/workflows/build.yml",
        "scripts/preflight.mjs",
        "scripts/deploy-render.mjs",
        "scripts/verify-render.mjs",
        "scripts/sar_nuclear_manager.py",
        "app/api/health/route.ts",
        "app/api/deployment/status/route.ts",
    ]
    for file_name in required_files:
        results.append(CheckResult(f"file:{file_name}", (ROOT / file_name).exists(), file_name))

    try:
        package = read_package()
        for script in ["dev", "build", "start", "typecheck", "preflight", "check", "deploy:render", "verify:render", "nuclear", "nuclear:all"]:
            results.append(CheckResult(f"script:{script}", bool(package.get("scripts", {}).get(script)), script))
    except Exception as error:
        results.append(CheckResult("package-json", False, str(error)))

    if (ROOT / ".npmrc").exists():
        npmrc = (ROOT / ".npmrc").read_text(encoding="utf-8")
        results.append(CheckResult("npm-registry", "registry=https://registry.npmjs.org/" in npmrc, "public npm registry"))

    if (ROOT / "render.yaml").exists():
        render_yaml = (ROOT / "render.yaml").read_text(encoding="utf-8")
        checks = {
            "render-type-web": "type: web" in render_yaml,
            "render-node": "env: node" in render_yaml,
            "render-autodeploy": "autoDeploy: true" in render_yaml,
            "render-health": "healthCheckPath: /api/health" in render_yaml,
            "render-secret": "sync: false" in render_yaml,
        }
        for name, passed in checks.items():
            results.append(CheckResult(name, passed, name))

    results.extend(safe_file_scan())

    passed = [item for item in results if item.passed]
    failed = [item for item in results if not item.passed]
    print("\nSAR INDUSTRIES NETWORK — Nuclear Manager Audit")
    print("Root:", ROOT)
    print("Python:", platform.python_version())
    print("System:", platform.platform())
    print("--------------------------------------------------")
    for item in results:
        state = "PASS" if item.passed else "FAIL"
        print(f"{state} | {item.name} | {item.detail}")
    print("--------------------------------------------------")
    print(f"Passed: {len(passed)}/{len(results)}")
    return not failed


def install() -> None:
    npm_command()
    run(["npm", "install", "--registry=https://registry.npmjs.org/"])


def build() -> None:
    npm_command()
    env = {
        "DEFAULT_ADMIN_EMAIL": DEFAULT_ADMIN_EMAIL,
        "DEFAULT_ADMIN_PASSWORD": os.environ.get("DEFAULT_ADMIN_PASSWORD", "build-check-placeholder"),
    }
    run(["npm", "run", "check"], env=env)


def deploy(hook_url: str | None, required: bool) -> None:
    hook_url = hook_url or os.environ.get("RENDER_DEPLOY_HOOK_URL")
    if not hook_url:
        message = "Render deploy hook missing. Set RENDER_DEPLOY_HOOK_URL or pass --hook-url."
        if required:
            raise ManagerError(message)
        log(message + " Skipping deploy trigger.")
        return
    request = urllib.request.Request(hook_url, method="POST")
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            body = response.read().decode("utf-8", errors="replace")
            log(f"Render deploy hook triggered. HTTP {response.status}")
            if body:
                print(body)
    except urllib.error.HTTPError as error:
        raise ManagerError(f"Render deploy hook failed: HTTP {error.code}") from error
    except urllib.error.URLError as error:
        raise ManagerError(f"Render deploy hook request failed: {error}") from error


def verify(url: str, retries: int, delay: int, soft: bool) -> bool:
    checks = [
        ("Landing page", "/", {200}),
        ("Health API", "/api/health", {200}),
        ("Deployment status API", "/api/deployment/status", {200}),
        ("Login page", "/login", {200}),
        ("Admin page", "/admin", {200, 307, 308}),
        ("Users page", "/admin/users", {200, 307, 308}),
        ("Security page", "/admin/security", {200, 307, 308}),
        ("Store builder", "/dashboard/store-builder", {200, 307, 308}),
    ]
    base_url = url.rstrip("/")
    final: list[tuple[str, str, bool, str]] = []
    for attempt in range(1, retries + 1):
        final = []
        for label, path_name, expected in checks:
            target = base_url + path_name
            started = time.time()
            try:
                request = urllib.request.Request(target, method="GET")
                opener = urllib.request.build_opener(NoRedirectHandler)
                with opener.open(request, timeout=20) as response:
                    status = response.status
                    body = response.read().decode("utf-8", errors="replace")[:2000]
                ok = status in expected
                if path_name in {"/api/health", "/api/deployment/status"} and ok:
                    try:
                        data = json.loads(body)
                        ok = bool(data.get("ok"))
                        if path_name == "/api/deployment/status":
                            ok = ok and data.get("checks", {}).get("secretsExposed") is False
                    except Exception:
                        ok = False
                elapsed = int((time.time() - started) * 1000)
                final.append((label, path_name, ok, f"status={status} {elapsed}ms"))
            except urllib.error.HTTPError as error:
                status = error.code
                ok = status in expected
                elapsed = int((time.time() - started) * 1000)
                final.append((label, path_name, ok, f"status={status} {elapsed}ms"))
            except Exception as error:
                final.append((label, path_name, False, f"error={error}"))
        if all(item[2] for item in final):
            break
        if attempt < retries:
            log(f"Verification attempt {attempt}/{retries} failed. Retrying in {delay}s...")
            time.sleep(delay)

    print("\nSAR INDUSTRIES NETWORK — Live Verification")
    print("Target:", base_url)
    print("--------------------------------------------------")
    for label, path_name, ok, detail in final:
        print(f"{'PASS' if ok else 'FAIL'} | {label} | {path_name} | {detail}")
    print("--------------------------------------------------")
    passed = sum(1 for item in final if item[2])
    print(f"Passed: {passed}/{len(final)}")
    all_passed = passed == len(final)
    if not all_passed and not soft:
        raise ManagerError("Live Render verification failed.")
    return all_passed


class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def all_steps(args: argparse.Namespace) -> None:
    configure()
    if not audit():
        raise ManagerError("Audit failed after configuration.")
    install()
    build()
    deploy(args.hook_url, required=args.require_deploy)
    verify(args.url, retries=args.retries, delay=args.delay, soft=args.soft_verify)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="SAR Industries Network all-in-one platform setup/deploy manager")
    parser.add_argument("command", choices=["audit", "configure", "install", "build", "deploy", "verify", "all"], help="Action to run")
    parser.add_argument("--url", default=os.environ.get("RENDER_URL", DEFAULT_RENDER_URL), help="Render live URL")
    parser.add_argument("--hook-url", default=os.environ.get("RENDER_DEPLOY_HOOK_URL"), help="Render deploy hook URL")
    parser.add_argument("--require-deploy", action="store_true", help="Fail if deploy hook is missing")
    parser.add_argument("--soft-verify", action="store_true", help="Do not fail process if live verification fails")
    parser.add_argument("--retries", type=int, default=int(os.environ.get("RENDER_VERIFY_RETRIES", "6")), help="Live verification retries")
    parser.add_argument("--delay", type=int, default=int(os.environ.get("RENDER_VERIFY_DELAY_SECONDS", "15")), help="Delay between verification retries")
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
        elif args.command == "deploy":
            deploy(args.hook_url, required=True)
        elif args.command == "verify":
            verify(args.url, retries=args.retries, delay=args.delay, soft=args.soft_verify)
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
