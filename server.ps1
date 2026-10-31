# ==============================================================================
# Oddiy va Tezkor Mahalliy Web Server (PowerShell & .NET HttpListener)
# ==============================================================================

param (
    [int]$Port = 3000,
    [string]$Path = $PSScriptRoot
)

if ([string]::IsNullOrWhiteSpace($Path)) {
    $Path = (Get-Location).Path
}

$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host " Shaxsiy Link Hub Localhost Serveri Ishga Tushdi!" -ForegroundColor Green
    Write-Host " Manzil: $prefix" -ForegroundColor Yellow
    Write-Host " Papka:  $Path" -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Cyan

    $mimeTypes = @{
        ".html" = "text/html; charset=utf-8"
        ".htm"  = "text/html; charset=utf-8"
        ".css"  = "text/css; charset=utf-8"
        ".js"   = "application/javascript; charset=utf-8"
        ".json" = "application/json; charset=utf-8"
        ".svg"  = "image/svg+xml"
        ".png"  = "image/png"
        ".jpg"  = "image/jpeg"
        ".jpeg" = "image/jpeg"
        ".gif"  = "image/gif"
        ".ico"  = "image/x-icon"
    }

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawPath = $request.Url.LocalPath
        $urlPath = $rawPath.TrimStart([char]47)
        if ([string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "index.html"
        }

        $localFilePath = Join-Path $Path $urlPath

        if (Test-Path $localFilePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localFilePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $mime
            
            $fileBytes = [System.IO.File]::ReadAllBytes($localFilePath)
            $response.ContentLength64 = $fileBytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
        } else {
            $response.StatusCode = 404
            $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - Fayl topilmadi")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $notFoundBytes.Length
            $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
        }

        $response.OutputStream.Close()
    }
}
catch {
    Write-Error "Serverda xatolik yuz berdi: $_"
}
finally {
    $listener.Stop()
    $listener.Close()
}
