param(
  [string]$ZipPath,
  [switch]$AutoPickIncoming,
  [switch]$NoInstall,
  [switch]$NoRun,
  [switch]$NoBackup,
  [switch]$NoDatabase
)

$ErrorActionPreference = "Stop"

function Write-Title($text) {
  Write-Host ""
  Write-Host "=====================================================" -ForegroundColor Cyan
  Write-Host " $text" -ForegroundColor Cyan
  Write-Host "=====================================================" -ForegroundColor Cyan
}

function Write-Step($text) {
  Write-Host "[SAR UPDATE] $text" -ForegroundColor Green
}

function Write-Warn($text) {
  Write-Host "[WARNING] $text" -ForegroundColor Yellow
}

function Write-Fail($text) {
  Write-Host "[ERROR] $text" -ForegroundColor Red
}

function Run-Cmd($File, $Args, $AllowFail = $false) {
  Write-Step "$File $Args"
  $p = Start-Process -FilePath $File -ArgumentList $Args -NoNewWindow -Wait -PassThru
  if ($p.ExitCode -ne 0 -and -not $AllowFail) {
    throw "Command failed with exit code $($p.ExitCode): $File $Args"
  }
  if ($p.ExitCode -ne 0 -and $AllowFail) {
    Write-Warn "Command exited with code $($p.ExitCode), continuing."
  }
}

function Run-Robocopy($Source, $Dest, $ExtraArgs) {
  $args = @('"' + $Source + '"', '"' + $Dest + '"') + $ExtraArgs
  $argLine = $args -join ' '
  Write-Step "robocopy $argLine"
  $p = Start-Process -FilePath "robocopy" -ArgumentList $argLine -NoNewWindow -Wait -PassThru
  # Robocopy exit codes 0-7 are success or non-fatal copy differences.
  if ($p.ExitCode -gt 7) {
    throw "Robocopy failed with exit code $($p.ExitCode)."
  }
}

Write-Title "SAR INDUSTRIES NETWORK - ZIP Update Manager"

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $ProjectRoot
Write-Step "Project root: $ProjectRoot"

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$UpdatesDir = Join-Path $ProjectRoot "_updates"
$IncomingDir = Join-Path $ProjectRoot "_incoming_updates"
$BackupsDir = Join-Path $ProjectRoot "_backups"
$ExtractDir = Join-Path $UpdatesDir "extract-$timestamp"
$LogFile = Join-Path $UpdatesDir "update-log-$timestamp.txt"

New-Item -ItemType Directory -Force -Path $UpdatesDir | Out-Null
New-Item -ItemType Directory -Force -Path $IncomingDir | Out-Null
New-Item -ItemType Directory -Force -Path $BackupsDir | Out-Null

Start-Transcript -Path $LogFile -Force | Out-Null

try {
  if ($AutoPickIncoming) {
    $candidate = Get-ChildItem -Path $IncomingDir -Filter *.zip -File | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $candidate) {
      Write-Fail "No ZIP file found inside _incoming_updates. Copy the updated ZIP there first."
      exit 1
    }
    $ZipPath = $candidate.FullName
    Write-Step "Auto selected newest ZIP: $ZipPath"
  }

  if (-not $ZipPath) {
    try {
      Add-Type -AssemblyName System.Windows.Forms
      $dialog = New-Object System.Windows.Forms.OpenFileDialog
      $dialog.Title = "Select updated SAR INDUSTRIES NETWORK project ZIP"
      $dialog.Filter = "ZIP files (*.zip)|*.zip"
      $dialog.InitialDirectory = $ProjectRoot
      if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
        $ZipPath = $dialog.FileName
      }
    } catch {
      Write-Warn "File picker unavailable."
    }
  }

  if (-not $ZipPath) {
    $ZipPath = Read-Host "Enter full path to updated ZIP file"
  }

  if (-not (Test-Path $ZipPath)) {
    throw "ZIP not found: $ZipPath"
  }

  if ([IO.Path]::GetExtension($ZipPath).ToLower() -ne ".zip") {
    throw "Selected file is not a ZIP: $ZipPath"
  }

  Write-Step "Selected update package: $ZipPath"

  Write-Step "Extracting update package..."
  New-Item -ItemType Directory -Force -Path $ExtractDir | Out-Null
  Expand-Archive -Path $ZipPath -DestinationPath $ExtractDir -Force

  # Find the real project root inside the extracted ZIP.
  $packageJson = Get-ChildItem -Path $ExtractDir -Filter package.json -Recurse -File |
    Where-Object { $_.FullName -notmatch "node_modules" } |
    Sort-Object { $_.FullName.Length } |
    Select-Object -First 1

  if (-not $packageJson) {
    throw "No package.json found inside ZIP. This does not look like a valid SAR project update."
  }

  $UpdateRoot = Split-Path $packageJson.FullName -Parent
  Write-Step "Detected update root: $UpdateRoot"

  # Basic validation for this project.
  $updatePkg = Get-Content (Join-Path $UpdateRoot "package.json") -Raw
  if ($updatePkg -notmatch "sar-industries-network") {
    Write-Warn "package.json does not clearly contain sar-industries-network. Continuing, but verify package carefully."
  }

  $EnvPath = Join-Path $ProjectRoot ".env"
  $EnvBackupPath = $null
  if (Test-Path $EnvPath) {
    $EnvBackupPath = Join-Path $UpdatesDir ".env.backup-$timestamp"
    Copy-Item $EnvPath $EnvBackupPath -Force
    Write-Step "Preserved current .env backup: $EnvBackupPath"
  }

  if (-not $NoBackup) {
    $BackupPath = Join-Path $BackupsDir "backup-$timestamp"
    Write-Step "Creating safe backup before update..."
    New-Item -ItemType Directory -Force -Path $BackupPath | Out-Null
    Run-Robocopy $ProjectRoot $BackupPath @(
      "/E", "/R:1", "/W:1", "/NFL", "/NDL", "/NJH", "/NJS", "/NP",
      "/XD", "node_modules", ".next", ".git", ".vercel", "_updates", "_backups", "_incoming_updates", ".turbo",
      "/XF", ".env", ".env.local", "*.log"
    )
    Write-Step "Backup created: $BackupPath"
  } else {
    Write-Warn "Backup skipped because -NoBackup was used."
  }

  Write-Step "Applying update files to current codebase..."
  Run-Robocopy $UpdateRoot $ProjectRoot @(
    "/E", "/R:1", "/W:1", "/NFL", "/NDL", "/NJH", "/NJS", "/NP",
    "/XD", "node_modules", ".next", ".git", ".vercel", "_updates", "_backups", "_incoming_updates", ".turbo",
    "/XF", ".env", ".env.local", "*.log"
  )

  if ($EnvBackupPath -and (Test-Path $EnvBackupPath)) {
    Copy-Item $EnvBackupPath $EnvPath -Force
    Write-Step "Restored existing .env after update."
  } elseif ((Test-Path (Join-Path $ProjectRoot ".env.example")) -and -not (Test-Path $EnvPath)) {
    Copy-Item (Join-Path $ProjectRoot ".env.example") $EnvPath
    Write-Step "Created new .env from .env.example."
  }

  Write-Step "Forcing public npm registry..."
  Run-Cmd "npm" "config set registry https://registry.npmjs.org/" $true

  if (-not $NoInstall) {
    Write-Step "Installing/updating dependencies..."
    Run-Cmd "npm" "install" $false
  } else {
    Write-Warn "Dependency install skipped because -NoInstall was used."
  }

  if (-not $NoDatabase) {
    $dockerAvailable = $false
    try {
      $dockerVersion = & docker --version 2>$null
      if ($LASTEXITCODE -eq 0) { $dockerAvailable = $true }
    } catch { $dockerAvailable = $false }

    if ($dockerAvailable -and (Test-Path (Join-Path $ProjectRoot "docker-compose.yml"))) {
      Write-Step "Starting Docker database services if available..."
      Run-Cmd "docker" "compose up -d" $true
    } else {
      Write-Warn "Docker is not available. Skipping local PostgreSQL/Redis auto-start."
    }

    if (Test-Path (Join-Path $ProjectRoot "prisma/schema.prisma")) {
      Write-Step "Generating Prisma client..."
      Run-Cmd "npm" "run db:generate --if-present" $true

      Write-Step "Running database migration if database is available..."
      Run-Cmd "npm" "run db:migrate -- --name auto_update_$timestamp" $true

      Write-Step "Running database seed if available..."
      Run-Cmd "npm" "run db:seed --if-present" $true
    }
  } else {
    Write-Warn "Database setup skipped because -NoDatabase was used."
  }

  Write-Step "Running TypeScript/build check in safe mode..."
  Run-Cmd "npm" "run typecheck --if-present" $true

  Write-Title "Update completed successfully"
  Write-Host "Update log: $LogFile" -ForegroundColor Cyan
  Write-Host "Admin email: admin@sarindustriesnetwork.com" -ForegroundColor Cyan
  Write-Host "Default local URL: http://localhost:3000" -ForegroundColor Cyan

  if (-not $NoRun) {
    $answer = Read-Host "Start localhost now? Type Y and press Enter"
    if ($answer -eq "Y" -or $answer -eq "y") {
      Write-Step "Starting localhost development server..."
      npm run dev
    }
  }
} catch {
  Write-Fail $_.Exception.Message
  Write-Host "A backup was created in _backups if backup was enabled." -ForegroundColor Yellow
  Write-Host "Check log file: $LogFile" -ForegroundColor Yellow
  exit 1
} finally {
  try { Stop-Transcript | Out-Null } catch {}
}
