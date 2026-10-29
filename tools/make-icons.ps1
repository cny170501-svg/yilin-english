# 生成 PWA 图标（无需安装任何依赖，使用 Windows 自带 .NET 绘图）
# 输出: icons/icon-192.png, icons/icon-512.png, icons/apple-touch-icon.png, icons/icon-maskable-512.png
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$iconDir = Join-Path $root "icons"
if (-not (Test-Path $iconDir)) { New-Item -ItemType Directory -Path $iconDir | Out-Null }

function New-RoundedRectPath([double]$x, [double]$y, [double]$w, [double]$h, [double]$r) {
    $p = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = 2 * $r
    $p.AddArc([float]$x, [float]$y, [float]$d, [float]$d, 180, 90)
    $p.AddArc([float]($x + $w - $d), [float]$y, [float]$d, [float]$d, 270, 90)
    $p.AddArc([float]($x + $w - $d), [float]($y + $h - $d), [float]$d, [float]$d, 0, 90)
    $p.AddArc([float]$x, [float]($y + $h - $d), [float]$d, [float]$d, 90, 90)
    $p.CloseFigure()
    return $p
}

function PF([double]$x, [double]$y) {
    return New-Object System.Drawing.PointF([float]$x, [float]$y)
}

function New-Icon([int]$size, [string]$outPath, [bool]$maskable = $false) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)

    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $bg = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        [System.Drawing.Color]::FromArgb(255, 96, 155, 255),
        [System.Drawing.Color]::FromArgb(255, 42, 98, 220),
        90)

    if ($maskable) {
        $bgPath = New-Object System.Drawing.Drawing2D.GraphicsPath
        $bgPath.AddRectangle($rect)
        $g.FillPath($bg, $bgPath)
    } else {
        $g.FillPath($bg, (New-RoundedRectPath 0 0 $size $size ($size * 0.22)))
    }

    $s = $size / 100.0

    # 白色对话气泡（居中）
    $g.FillPath([System.Drawing.Brushes]::White, (New-RoundedRectPath (18 * $s) (18 * $s) (64 * $s) (50 * $s) (12 * $s)))

    # 气泡小尾巴（左下，指向外下方）
    $tail = New-Object System.Drawing.Drawing2D.GraphicsPath
    $tail.AddPolygon(@((PF 28 66), (PF 40 66), (PF 30 80)))
    $g.FillPath([System.Drawing.Brushes]::White, $tail)

    # 橙色圆形播放按钮（气泡中心，圆心 (50,43) 半径 16）
    $orange = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 255, 149, 54))
    $g.FillEllipse($orange, [float](34 * $s), [float](27 * $s), [float](32 * $s), [float](32 * $s))

    # 白色三角（播放符号，略向右偏使视觉居中）
    $tri = New-Object System.Drawing.Drawing2D.GraphicsPath
    $tri.AddPolygon(@((PF 45 33), (PF 45 53), (PF 61 43)))
    $g.FillPath([System.Drawing.Brushes]::White, $tri)

    $g.Dispose()
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "生成 $outPath ($size x $size)"
}

New-Icon 192 (Join-Path $iconDir "icon-192.png") $false
New-Icon 512 (Join-Path $iconDir "icon-512.png") $false
New-Icon 512 (Join-Path $iconDir "icon-maskable-512.png") $true
New-Icon 180 (Join-Path $iconDir "apple-touch-icon.png") $false
Write-Host "全部图标生成完成。"
