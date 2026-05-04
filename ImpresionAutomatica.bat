@echo off
:: ═══════════════════════════════════════════════════
::  La Esquina del Sushi — Impresión Automática
:: ═══════════════════════════════════════════════════
::  Este archivo abre el panel de administración
::  con impresión silenciosa activada.
::
::  REQUISITOS:
::  1. Google Chrome instalado
::  2. Impresora térmica (80mm) como predeterminada
::  3. Activar el toggle "Auto-imprimir" en Pedidos
:: ═══════════════════════════════════════════════════

:: Intentar ruta estándar de Chrome
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk-printing --autoplay-policy=no-user-gesture-required --user-data-dir="%temp%\ChromePrintProfile" "https://laesquinadelsushi.com/admin.html"
    exit
)

:: Intentar ruta x86
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --kiosk-printing --autoplay-policy=no-user-gesture-required --user-data-dir="%temp%\ChromePrintProfile" "https://laesquinadelsushi.com/admin.html"
    exit
)

:: Si no se encontró Chrome
echo.
echo  ╔═══════════════════════════════════════════╗
echo  ║  ERROR: Google Chrome no encontrado       ║
echo  ║  Instala Chrome desde google.com/chrome   ║
echo  ╚═══════════════════════════════════════════╝
echo.
pause
