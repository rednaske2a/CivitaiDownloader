@echo off
REM Windows-compatible development script
REM This replaces the problematic NODE_ENV syntax

set NODE_ENV=development
node_modules\.bin\tsx server\index.ts
