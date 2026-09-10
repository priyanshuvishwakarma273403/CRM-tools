# CRM Platform - Database Migration Runner (PowerShell)
# Applies Flyway migrations (V1 schema, V2 seed) to local or target PostgreSQL database

param (
    [string]$JdbcUrl = "jdbc:postgresql://localhost:5432/crm_db",
    [string]$Username = "crm_user",
    [string]$Password = "crm_password"
)

$PlatformRoot = Resolve-Path "$PSScriptRoot\.."

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host " Running Flyway Database Migrations" -ForegroundColor Cyan
Write-Host " Target URL: $JdbcUrl" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

Push-Location "$PlatformRoot\backend"
try {
    .\mvnw.cmd flyway:migrate `
        "-Dflyway.url=$JdbcUrl" `
        "-Dflyway.user=$Username" `
        "-Dflyway.password=$Password" `
        "-Dflyway.locations=filesystem:$PlatformRoot/database/migrations,filesystem:$PlatformRoot/database/seed"

    if ($LASTEXITCODE -ne 0) { throw "Flyway migration failed with exit code $LASTEXITCODE" }
    Write-Host "[OK] Database migrations applied successfully!" -ForegroundColor Green
} finally {
    Pop-Location
}
