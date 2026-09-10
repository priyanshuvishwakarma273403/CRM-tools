# CRM Platform - Test All Script (PowerShell)
# Runs comprehensive tests on the centralized Spring Boot backend

$ErrorActionPreference = "Stop"
$PlatformRoot = Resolve-Path "$PSScriptRoot\.."

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host " Running Automated Tests for CRM Platform" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# 1. Run Spring Boot Backend Unit & Integration Tests (Flyway H2 in-memory)
Write-Host "`n[1/1] Running Spring Boot Backend Tests..." -ForegroundColor Yellow
Push-Location "$PlatformRoot\backend"
try {
    .\mvnw.cmd test
    if ($LASTEXITCODE -ne 0) { throw "Backend test suite failed with exit code $LASTEXITCODE" }
    Write-Host "[OK] All backend unit and integration tests passed!" -ForegroundColor Green
} finally {
    Pop-Location
}

Write-Host "`n======================================================" -ForegroundColor Green
Write-Host " ALL TEST SUITES PASSED!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
