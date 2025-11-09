# Clean dev server startup script
# This script kills any running Node processes, removes lock files, and starts the dev server

Write-Host "🧹 Cleaning up..." -ForegroundColor Cyan

# Kill all Node processes
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "   Stopping Node processes..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force
    Start-Sleep -Seconds 1
    Write-Host "   ✓ Node processes stopped" -ForegroundColor Green
} else {
    Write-Host "   ✓ No Node processes running" -ForegroundColor Green
}

# Remove lock file
if (Test-Path ".next\dev\lock") {
    Remove-Item ".next\dev\lock" -Force -ErrorAction SilentlyContinue
    Write-Host "   ✓ Lock file removed" -ForegroundColor Green
} else {
    Write-Host "   ✓ No lock file found" -ForegroundColor Green
}

# Remove .next folder if needed (optional - uncomment if you want a full clean)
# if (Test-Path ".next") {
#     Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
#     Write-Host "   ✓ .next folder cleared" -ForegroundColor Green
# }

Write-Host ""
Write-Host "🚀 Starting dev server..." -ForegroundColor Cyan
Write-Host ""

# Start the dev server
npm run dev

