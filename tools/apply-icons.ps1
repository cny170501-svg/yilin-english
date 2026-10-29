# 图标替换脚本:把操作类文本符号替换为 Lucide 内联 SVG 调用(Util.icon)
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$enc = New-Object System.Text.UTF8Encoding $true
$q = [char]39

$speaker = [string]([char]0xD83D) + [string]([char]0xDD0A)
$play    = [string][char]0x25B6
$stopS   = [string][char]0x23F9
$pauseS  = [string][char]0x23F8
$redo    = [string][char]0x21BA
$xMark   = [string][char]0x2715
$checkE  = [string][char]0x2705
$chevR   = [string][char]0x203A
$chevL   = [string][char]0x2039

function IconCall($name, $size) {
  return $q + ' + Util.icon(' + $q + $q + $name + $q + $q + ', ' + $size + ') + ' + $q
}

$files = @(
  'js\views\unit.js', 'js\views\article.js', 'js\views\practice.js',
  'js\views\dictation.js', 'js\views\grammar.js', 'js\views\reading.js',
  'js\views\wrong.js', 'js\views\home.js'
)

$summary = @()
foreach ($f in $files) {
  $p = Join-Path $root $f
  $t = [System.IO.File]::ReadAllText($p, [System.Text.Encoding]::UTF8)
  $before = $t.Length
  $counts = @{}

  # 大喇叭圆钮(listen-btn 内的 🔊):40px
  $big = '>' + $speaker + '</button>'
  $bigRepl = '>' + (IconCall 'volume' 40) + '</button>'
  $counts['bigSpeaker'] = ([regex]::Matches($t, [regex]::Escape($big))).Count
  $t = $t.Replace($big, $bigRepl)

  # 其余 🔊:18px
  $counts['speaker18'] = ([regex]::Matches($t, [regex]::Escape($speaker))).Count
  $t = $t.Replace($speaker, (IconCall 'volume' 18))

  # 控制类符号
  foreach ($pair in @(
    @($play + ' 连续播放', 'play', 16, 'playAll'),
    @($play + ' 朗读全文', 'play', 16, 'readAll'),
    @($stopS + ' 停止', 'stop', 16, 'stop'),
    @($pauseS + ' 暂停', 'pause', 16, 'pause'),
    @($redo + ' 重排', 'redo', 15, 'redo'),
    @($xMark + ' 退出', 'x', 14, 'quit'),
    @($checkE + ' 提交', 'check', 17, 'check')
  )) {
    $lit = $pair[0]; $name = $pair[1]; $size = $pair[2]
    $n = ([regex]::Matches($t, [regex]::Escape($lit))).Count
    if ($n -gt 0) {
      $t = $t.Replace($lit, (IconCall $name $size) + ' ')
      $counts[$pair[3]] = $n
    }
  }

  # 下一题/查看成绩/返回/推荐箭头
  $t = $t.Replace('下一题 ' + $chevR, '下一题 ' + (IconCall 'right' 16))
  $t = $t.Replace('查看成绩 ' + $chevR, '查看成绩 ' + (IconCall 'right' 16))
  $t = $t.Replace($chevL + ' 返回', (IconCall 'left' 15) + ' 返回')
  $t = $t.Replace($chevL + ' 阅读', (IconCall 'left' 15) + ' 阅读')
  $t = $t.Replace($chevL + ' 语法', (IconCall 'left' 15) + ' 语法')

  [System.IO.File]::WriteAllText($p, $t, $enc)
  $summary += ($f + ' => ' + ($counts.GetEnumerator() | ForEach-Object { $_.Key + ':' + $_.Value }) -join ' ')
}
$summary | ForEach-Object { Write-Host $_ }
Write-Host '图标替换完成'
