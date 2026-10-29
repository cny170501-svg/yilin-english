# 简易静态文件服务器（仅本机/家庭网络使用）
# 用法: powershell -ExecutionPolicy Bypass -File tools\serve.ps1 [端口]
# 启动后用手机/平板浏览器访问 http://<本机IP>:<端口>
param(
    [int]$Port = 8080
)

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
# 统一带尾随分隔符，避免 StartsWith 前缀匹配出现兄弟目录绕过
if (-not $root.EndsWith('\')) { $root = $root + '\' }

$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.webmanifest' = 'application/manifest+json; charset=utf-8'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.md'   = 'text/markdown; charset=utf-8'
    '.txt'  = 'text/plain; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$lanMode = $true
try {
    $listener.Prefixes.Add("http://+:$Port/")
    $listener.Start()
} catch {
    try {
        $listener.Close()
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add("http://localhost:$Port/")
        $listener.Start()
        $lanMode = $false
    } catch {
        Write-Host "启动失败：$($_.Exception.Message)" -ForegroundColor Red
        Write-Host "提示：如果端口被占用，换个端口试试，例如 .\serve.ps1 8090"
        exit 1
    }
}

$ip = $null
try {
    $ip = (Get-NetIPAddress -AddressFamily IPv4 |
        Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } |
        Select-Object -First 1).IPAddress
} catch { }

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  译林英语复习工具 已启动" -ForegroundColor Cyan
Write-Host ""
Write-Host "  本机访问:   http://localhost:$Port" -ForegroundColor Yellow
if ($lanMode -and $ip) {
    Write-Host "  手机/iPad:  http://${ip}:$Port  (需同一 WiFi)" -ForegroundColor Yellow
} else {
    Write-Host "  当前仅本机可访问。如需手机/iPad 访问，请以管理员身份运行，" -ForegroundColor DarkYellow
    Write-Host "  或先执行一次（管理员）: netsh http add urlacl url=http://+:$Port/ user=Everyone" -ForegroundColor DarkYellow
}
Write-Host ""
Write-Host "  按 Ctrl+C 停止服务器" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Start-Process "http://localhost:$Port"

$utf8 = [System.Text.Encoding]::UTF8
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    try {
        $raw = $ctx.Request.Url.AbsolutePath
        $path = [System.Uri]::UnescapeDataString($raw) -replace '/', '\'
        $path = $path.TrimStart('\')
        if ([string]::IsNullOrWhiteSpace($path)) { $path = 'index.html' }
        $file = Join-Path $root $path
        $full = [System.IO.Path]::GetFullPath($file)
        $ext = [System.IO.Path]::GetExtension($full).ToLower()

        if ((Test-Path $full -PathType Container)) {
            $full = Join-Path $full 'index.html'
            $ext = '.html'
        }

        if ((Test-Path $full -PathType Leaf) -and $full.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase) -and $mime.ContainsKey($ext)) {
            # 工具链/构建目录不是网站资源,不对外服务(node.exe、package.json、脚本等)
            $rel = $full.Substring($root.Length).TrimStart('\')
            if ($rel -like 'tools\*' -or $rel -like 'tw\*') {
                $ctx.Response.StatusCode = 403
                $msg = $utf8.GetBytes('403 Forbidden')
                $ctx.Response.ContentType = 'text/plain; charset=utf-8'
                $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
                continue
            }
            $bytes = [System.IO.File]::ReadAllBytes($full)
            $ctx.Response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
            $ctx.Response.ContentLength64 = $bytes.Length
            $ctx.Response.Headers.Add('Cache-Control', 'no-store')
            $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $ctx.Response.StatusCode = 404
            $msg = $utf8.GetBytes('404 Not Found')
            $ctx.Response.ContentType = 'text/plain; charset=utf-8'
            $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
        }
    } catch {
        try { $ctx.Response.StatusCode = 500 } catch { }
    } finally {
        try { $ctx.Response.OutputStream.Close() } catch { }
    }
}
