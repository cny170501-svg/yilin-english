@echo off
title Yilin English Study Tool
echo.
echo  Starting Yilin English Study Tool...
echo  A browser window will open automatically.
echo  For phone/iPad, use the LAN address shown in the server window.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\serve.ps1" %1
pause
