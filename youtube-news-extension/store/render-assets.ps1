# Renders the extension icons and store images from store/src with headless Edge.
# Usage: powershell -ExecutionPolicy Bypass -File store\render-assets.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$src = Join-Path $PSScriptRoot "src"
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$userData = Join-Path $env:TEMP "ytnews-render-profile"

# Icons keep a transparent background; store images must be opaque (no alpha).
function Render($page, $out, $w, $h, $bg = "FFFFFFFF") {
  $url = "file:///" + ((Join-Path $src $page) -replace '\\', '/')
  if (Test-Path $out) { Remove-Item $out }
  # Start-Process, because Edge logs to stderr and PowerShell 5.1 treats that as an error.
  $edgeArgs = @("--headless=new", "--disable-gpu", "--hide-scrollbars", "--user-data-dir=`"$userData`"",
    "--allow-file-access-from-files", "--default-background-color=$bg",
    "--virtual-time-budget=3000", "--window-size=$w,$h", "--screenshot=`"$out`"", "`"$url`"")
  Start-Process -FilePath $edge -ArgumentList $edgeArgs -Wait -WindowStyle Hidden
  if (-not (Test-Path $out)) { throw "Failed to render $out" }
  Write-Host "rendered $out"
}

New-Item -ItemType Directory -Force (Join-Path $root "icons") | Out-Null
foreach ($size in 16, 32) {
  Render "icon.html?src=icon-small.svg&size=$size" (Join-Path $root "icons\icon$size.png") $size $size "00000000"
}
foreach ($size in 48, 128) {
  Render "icon.html?src=icon.svg&size=$size" (Join-Path $root "icons\icon$size.png") $size $size "00000000"
}

Render "promo-small.html" (Join-Path $PSScriptRoot "promo-small-440x280.png") 440 280
Render "screenshot.html" (Join-Path $PSScriptRoot "screenshot-1-1280x800.png") 1280 800
