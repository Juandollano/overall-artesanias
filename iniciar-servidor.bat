@echo off
title Casa Over All - servidor local
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor.ps1" %*
pause
