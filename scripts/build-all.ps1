# CRM Platform - Build All Script (PowerShell)
# Builds the centralized Spring Boot backend and all front-end applications

$ErrorActionPreference = "Stop"
$PlatformRoot = Resolve-Path "$PSScriptRoot\.."

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host " Building Centralized CRM Platform" -ForegroundColor Cyan
Write-Host " Root: $PlatformRoot" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# 1. Build Centralized Spring Boot Backend
Write-Host "`n[1/3] Building Centralized Spring Boot Backend..." -ForegroundColor Yellow
Push-Location "$PlatformRoot\backend"
try {
    .\mvnw.cmd clean package -DskipTests
    if ($LASTEXITCODE -ne 0) { throw "Backend build failed with exit code $LASTEXITCODE" }
    Write-Host "[OK] Backend build succeeded (JAR generated in backend/target/)" -ForegroundColor Green
} finally {
    Pop-Location
}

# 2. Build Web Application
Write-Host "`n[2/3] Building Web Application (Vite + React)..." -ForegroundColor Yellow
Push-Location "$PlatformRoot\apps\web"
try {
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing web dependencies..." -ForegroundColor Gray
        npm install
    }
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Web application build failed" }
    Write-Host "[OK] Web application build succeeded (dist/ generated)" -ForegroundColor Green
} finally {
    Pop-Location
}

# 3. Build Desktop Application
Write-Host "`n[3/3] Building Desktop Application (Vite + React UI)..." -ForegroundColor Yellow
Push-Location "$PlatformRoot\apps\desktop"
try {
    if (-not (Test-Path "node_modules")) {
        Write-Host "Installing desktop dependencies..." -ForegroundColor Gray
        npm install
    }
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Desktop application build failed" }
    Write-Host "[OK] Desktop application build succeeded (dist/ generated)" -ForegroundColor Green
} finally {
    Pop-Location
}

Write-Host "`n======================================================" -ForegroundColor Green
Write-Host " ALL COMPONENTS BUILT SUCCESSFULLY!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
