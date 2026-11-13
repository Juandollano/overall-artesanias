# Servidor web local para el sitio Casa Over All (sin instalar nada).
# Uso:  powershell -ExecutionPolicy Bypass -File servidor.ps1 [-Puerto 8080]
param([int]$Puerto = 8080, [int]$Hilos = 12)
$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $MyInvocation.MyCommand.Path

$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $Puerto)
try { $listener.Start() } catch { Write-Host "No se pudo usar el puerto $Puerto (¿ya está en uso?). Probá: servidor.ps1 -Puerto 8090" -ForegroundColor Red; exit 1 }

$ips = [System.Net.Dns]::GetHostAddresses([System.Net.Dns]::GetHostName()) |
  Where-Object { $_.AddressFamily -eq 'InterNetwork' -and $_.ToString() -notlike '127.*' -and $_.ToString() -notlike '169.254.*' } |
  ForEach-Object { $_.ToString() }
Write-Host ""
Write-Host "  Casa Over All - servidor local en marcha" -ForegroundColor Green
Write-Host "  En esta PC:          http://localhost:$Puerto/"
foreach ($ip in $ips) { Write-Host "  En tu red (Wi-Fi):   http://${ip}:$Puerto/" -ForegroundColor Cyan }
Write-Host "  Ctrl+C para detener."
Write-Host ""

# Atiende una conexión (se ejecuta en paralelo dentro de un grupo de hilos)
$atender = {
  param($cliente, $raiz)
  $tipos = @{
    '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'; '.js' = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
    '.svg' = 'image/svg+xml'; '.ico' = 'image/x-icon'; '.webp' = 'image/webp'; '.txt' = 'text/plain; charset=utf-8'
  }
  $utf8 = New-Object System.Text.UTF8Encoding($false)
  $log = ''
  try {
    $cliente.ReceiveTimeout = 5000; $cliente.SendTimeout = 20000; $cliente.NoDelay = $true
    $stream = $cliente.GetStream()
    $lector = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::ASCII, $false, 4096, $true)
    $linea = $lector.ReadLine()
    if (-not $linea) { return }
    while (($h = $lector.ReadLine()) -ne $null -and $h -ne '') { }
    $partes = $linea.Split(' ')
    $metodo = $partes[0]; $ruta = if ($partes.Length -gt 1) { $partes[1] } else { '/' }
    $codigo = 200; $estado = 'OK'
    if ($metodo -ne 'GET' -and $metodo -ne 'HEAD') {
      $cuerpo = $utf8.GetBytes('Metodo no permitido'); $tipo = 'text/plain'; $codigo = 405; $estado = 'Method Not Allowed'
    } else {
      $ruta = [System.Uri]::UnescapeDataString(($ruta -split '[?#]')[0])
      if ($ruta.EndsWith('/')) { $ruta += 'index.html' }
      $rel = $ruta.TrimStart('/').Replace('/', '\')
      $archivo = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($raiz, $rel))
      $prohibido = ($rel -match '\.(ps1|bat)$') -or -not $archivo.StartsWith($raiz + '\', [System.StringComparison]::OrdinalIgnoreCase)
      if (-not $prohibido -and [System.IO.Directory]::Exists($archivo)) { $archivo = [System.IO.Path]::Combine($archivo, 'index.html') }
      if ($prohibido -or -not [System.IO.File]::Exists($archivo)) {
        $archivo = [System.IO.Path]::Combine($raiz, '404.html'); $codigo = 404; $estado = 'Not Found'
      }
      $ext = [System.IO.Path]::GetExtension($archivo).ToLower()
      $tipo = if ($tipos.ContainsKey($ext)) { $tipos[$ext] } else { 'application/octet-stream' }
      $cuerpo = [System.IO.File]::ReadAllBytes($archivo)
    }
    $cache = if ($tipo -like 'text/html*' -or $ext -eq '.js' -or $ext -eq '.css') { 'no-cache' } else { 'public, max-age=86400' }
    $cab = "HTTP/1.1 $codigo $estado`r`nContent-Type: $tipo`r`nContent-Length: $($cuerpo.Length)`r`nCache-Control: $cache`r`nX-Content-Type-Options: nosniff`r`nConnection: close`r`n`r`n"
    $b = $utf8.GetBytes($cab); $stream.Write($b, 0, $b.Length)
    if ($metodo -ne 'HEAD') { $stream.Write($cuerpo, 0, $cuerpo.Length) }
    $stream.Flush()
    $log = "{0:HH:mm:ss} {1} {2} {3}" -f (Get-Date), $codigo, $metodo, $ruta
  } catch { } finally { $cliente.Close() }
  $log
}

$pool = [RunspaceFactory]::CreateRunspacePool(1, $Hilos)
$pool.Open()
$tareas = New-Object System.Collections.ArrayList
try {
  while ($true) {
    if ($listener.Pending()) {
      $cliente = $listener.AcceptTcpClient()
      $ps = [PowerShell]::Create().AddScript($atender).AddArgument($cliente).AddArgument($raiz)
      $ps.RunspacePool = $pool
      [void]$tareas.Add(@{ ps = $ps; h = $ps.BeginInvoke() })
    } else {
      Start-Sleep -Milliseconds 5
    }
    # recoger tareas terminadas y mostrar el registro
    for ($i = $tareas.Count - 1; $i -ge 0; $i--) {
      $t = $tareas[$i]
      if ($t.h.IsCompleted) {
        try { $r = $t.ps.EndInvoke($t.h); if ($r) { Write-Host $r -ForegroundColor DarkGray } } catch { }
        $t.ps.Dispose(); $tareas.RemoveAt($i)
      }
    }
  }
} finally { $listener.Stop(); $pool.Close() }
