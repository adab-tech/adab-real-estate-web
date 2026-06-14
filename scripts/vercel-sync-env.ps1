# Sync missing environment variables from .env.local to Vercel (production).
# Never prints secret values. Requires: npx vercel login + npx vercel link
param(
  [ValidateSet("production", "preview", "development")]
  [string]$Environment = "production",
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$envLocal = Join-Path $projectRoot ".env.local"
$vercelDir = Join-Path $projectRoot ".vercel\project.json"

function Write-Info([string]$Message) {
  Write-Host $Message
}

# Native stderr (e.g. npm devdir warnings) must not terminate when $ErrorActionPreference is Stop.
function Invoke-VercelCli {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$ArgumentList
  )
  $prev = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    $output = & npx --yes vercel @ArgumentList 2>&1
    return [PSCustomObject]@{
      Output   = $output
      ExitCode = $LASTEXITCODE
    }
  } finally {
    $ErrorActionPreference = $prev
  }
}

function Invoke-VercelEnvAdd {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Name,
    [Parameter(Mandatory = $true)]
    [string]$EnvName,
    [Parameter(Mandatory = $true)]
    [string]$Value
  )
  $prev = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    $Value | & npx --yes vercel env add $Name $EnvName --force 2>&1 | Out-Null
    return $LASTEXITCODE
  } finally {
    $ErrorActionPreference = $prev
  }
}

if (-not (Test-Path $envLocal)) {
  Write-Info "No .env.local found at $envLocal"
  Write-Info "Create it with: npx vercel env pull .env.local"
  exit 1
}

if (-not (Test-Path $vercelDir)) {
  Write-Info "Project not linked (.vercel/project.json missing)."
  Write-Info "Run: npx vercel login"
  Write-Info "Then: npx vercel link --yes --project adab-real-estate-web"
  exit 1
}

# Parse .env.local (KEY=VALUE, # comments, optional quotes)
$localVars = [ordered]@{}
Get-Content -LiteralPath $envLocal -Encoding UTF8 | ForEach-Object {
  $line = $_.Trim()
  if ($line.Length -eq 0 -or $line.StartsWith("#")) { return }
  $eq = $line.IndexOf("=")
  if ($eq -lt 1) { return }
  $name = $line.Substring(0, $eq).Trim()
  $value = $line.Substring($eq + 1).Trim()
  if (
    ($value.StartsWith('"') -and $value.EndsWith('"')) -or
    ($value.StartsWith("'") -and $value.EndsWith("'"))
  ) {
    $value = $value.Substring(1, $value.Length - 2)
  }
  if ($name -and $value) {
    $localVars[$name] = $value
  }
}

if ($localVars.Count -eq 0) {
  Write-Info ".env.local has no KEY=VALUE pairs to sync."
  exit 0
}

Push-Location $projectRoot
try {
  $lsResult = Invoke-VercelCli -ArgumentList @("env", "ls", $Environment)
  if ($lsResult.ExitCode -ne 0) {
    Write-Info "Vercel CLI failed. Run: npx vercel login"
    Write-Info ($lsResult.Output | Out-String).Trim()
    exit 1
  }
  $lsRaw = $lsResult.Output

  $existing = [System.Collections.Generic.HashSet[string]]::new(
    [System.StringComparer]::OrdinalIgnoreCase
  )
  foreach ($line in ($lsRaw -split "`r?`n")) {
    $trimmed = $line.Trim()
    if ($trimmed -match '^[A-Z][A-Z0-9_]+$') {
      [void]$existing.Add($matches[0])
    }
    if ($trimmed -match '\s([A-Z][A-Z0-9_]+)\s') {
      [void]$existing.Add($matches[1])
    }
  }

  $added = 0
  $skipped = 0

  foreach ($entry in $localVars.GetEnumerator()) {
    $name = $entry.Key
    if ($existing.Contains($name)) {
      $skipped++
      continue
    }

    if ($DryRun) {
      Write-Info "[dry-run] Would add: $name ($Environment)"
      $added++
      continue
    }

    Write-Info "Adding $name to $Environment..."
    $addCode = Invoke-VercelEnvAdd -Name $name -EnvName $Environment -Value $entry.Value
    if ($addCode -ne 0) {
      Write-Info "Failed to add $name. Check Vercel login and project link."
      exit 1
    }
    $added++
  }

  Write-Info "Done. Added: $added, already present: $skipped."
  if ($added -gt 0 -and -not $DryRun) {
    Write-Info "Redeploy production: npx vercel deploy --prod"
  }
}
finally {
  Pop-Location
}
