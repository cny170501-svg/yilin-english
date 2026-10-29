# 路径遍历复验:对本地服务器发起编码/明文穿越请求,全部应被拒绝
$tests = @(
  '/..%2f..%2f..%2fwindows/win.ini',
  '/../../windows/win.ini',
  '/..\/..\/..\/windows/system32/config/sam',
  '/js/../tools/serve.ps1',
  '/.%2e/.%2e/.%2e/etc/passwd',
  '/css/../../sw.js'
)
foreach ($t in $tests) {
  try {
    $r = Invoke-WebRequest -UseBasicParsing ('http://127.0.0.1:8080' + $t) -TimeoutSec 5
    Write-Output ("{0} => {1} len={2}" -f $t, $r.StatusCode, $r.Content.Length)
  } catch {
    $code = 0
    if ($_.Exception.Response) { $code = [int]$_.Exception.Response.StatusCode }
    Write-Output ("{0} => BLOCKED {1}" -f $t, $code)
  }
}
