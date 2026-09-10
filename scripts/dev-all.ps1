# CRM Platform - Dev Launcher Script (PowerShell)
# Launches the Centralized Spring Boot Backend and frontend clients

param (
    [switch]$BackendOnly,
    [switch]$WebOnly,
    [switch]$DesktopOnly,
    [switch]$MobileOnly
)

$PlatformRoot = Resolve-Path "$PSScriptRoot\.."

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host " Centralized CRM Platform - Dev Mode" -ForegroundColor Cyan
Write-Host " Root: $PlatformRoot" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

if ($BackendOnly) {
    Write-Host "Starting Centralized Spring Boot Backend on port 8080..." -ForegroundColor Green
    Set-Location "$PlatformRoot\backend"
    .\mvnw.cmd spring-boot:run
    exit
}

if ($WebOnly) {
    Write-Host "Starting Web Application on port 5173..." -ForegroundColor Green
    Set-Location "$PlatformRoot\apps\web"
    npm run dev
    exit
}

if ($DesktopOnly) {
    Write-Host "Starting Desktop Application (Tauri)..." -ForegroundColor Green
    Set-Location "$PlatformRoot\apps\desktop"
    npm run tauri dev
    exit
}

if ($MobileOnly) {
    Write-Host "Starting Mobile Application (Expo)..." -ForegroundColor Green
    Set-Location "$PlatformRoot\apps\mobile"
    npm start
    exit
}

Write-Host "Select an option:" -ForegroundColor Yellow
Write-Host "  1. Start Centralized Backend (Spring Boot :8080)"
Write-Host "  2. Start Web Application (Vite :5173)"
Write-Host "  3. Start Desktop Application (Tauri Dev)"
Write-Host "  4. Start Mobile Application (Expo)"
Write-Host "  5. Launch All in Separate Windows"
Write-Host "  Q. Quit"

$choice = Read-Host "Choice"
switch ($choice) {
    "1" {
        Set-Location "$PlatformRoot\backend"
        .\mvnw.cmd spring-boot:run
    }
    "2" {
        Set-Location "$PlatformRoot\apps\web"
        npm run dev
    }
    "3" {
        Set-Location "$PlatformRoot\apps\desktop"
        npm run tauri dev
    }
    "4" {
        Set-Location "$PlatformRoot\apps\mobile"
        npm start
    }
    "5" {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PlatformRoot\backend'; .\mvnw.cmd spring-boot:run"
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PlatformRoot\apps\web'; npm run dev"
        Write-Host "Launched Centralized Backend and Web in separate terminal windows." -ForegroundColor Green
    }
    default {
        Write-Host "Exiting."
    }
}
