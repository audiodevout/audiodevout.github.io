# Builds the Chrome Web Store upload: dist\news-button-<version>.zip
# Only the files the extension needs at runtime go in; store\, docs and
# build scripts stay out.
# Usage: powershell -ExecutionPolicy Bypass -File build.ps1

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$version = (Get-Content (Join-Path $root "manifest.json") -Raw | ConvertFrom-Json).version

$files = @(
  "manifest.json",
  "background.js",
  "countries.js",
  "content.js",
  "content.css",
  "popup.html",
  "popup.css",
  "popup.js",
  "icons",
  "fonts"
)

$dist = Join-Path $root "dist"
$staging = Join-Path $dist "staging"
$zip = Join-Path $dist "news-button-$version.zip"

if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
if (Test-Path $zip) { Remove-Item $zip -Force }
New-Item -ItemType Directory -Force $staging | Out-Null

foreach ($f in $files) {
  Copy-Item (Join-Path $root $f) $staging -Recurse
}

# Entries are added one by one so their names use forward slashes: Windows
# PowerShell's zip helpers write "icons\icon16.png", which the Web Store
# can reject.
Add-Type -AssemblyName System.IO.Compression, System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::Open($zip, "Create")
try {
  Get-ChildItem $staging -Recurse -File | ForEach-Object {
    $name = $_.FullName.Substring($staging.Length + 1) -replace '\\', '/'
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $name) | Out-Null
  }
} finally {
  $archive.Dispose()
}
Remove-Item $staging -Recurse -Force

Write-Host "built $zip"
