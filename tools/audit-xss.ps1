# XSS 转义覆盖扫描：找出视图中拼进 HTML 但未经过 esc() 的变量
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$files = Get-ChildItem -Path (Join-Path $root 'js\views'), (Join-Path $root 'js') -Filter *.js -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne 'util.js' }

$suspects = @()
foreach ($f in $files) {
  $lines = [System.IO.File]::ReadAllLines($f.FullName)
  for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    # 拼接进 HTML 的插值：'+ xxx +',xxx 不以 esc( 开头、不是纯数字/常量
    $ms = [regex]::Matches($line, "'\s*\+\s*([A-Za-z_$][\w$.]*)\s*\+")
    foreach ($m in $ms) {
      $var = $m.Groups[1].Value
      if ($var -match '^(esc|Util\.esc|pct|h|p|score|pct2|idx|total|correct|count|len|m$|n$|i$|k$)') { continue }
      if ($var -match '^\d') { continue }
      # 常量字符串片段（如 '+' 或 '：' 等）不会匹配上面的变量模式
      $suspects += [PSCustomObject]@{ File = $f.Name; Line = $i + 1; Var = $var; Code = $line.Trim().Substring(0, [Math]::Min(110, $line.Trim().Length)) }
    }
  }
}
Write-Host ("发现 {0} 处待核对插值：" -f $suspects.Count) -ForegroundColor Yellow
$suspects | ForEach-Object { Write-Host ("{0}:{1}  [{2}]  {3}" -f $_.File, $_.Line, $_.Var, $_.Code) }
