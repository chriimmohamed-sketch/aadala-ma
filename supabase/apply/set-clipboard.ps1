param(
    [string]$Path = 'C:\Users\Mohamed Chraim\Downloads\CHRVVIM_Campus_CREATIVE_UPGRADE_CLOUDFLARE\aadala-ma\supabase\apply\2026-11-11_pending_bundle.sql'
)
$enc = New-Object System.Text.UTF8Encoding($false)
$t = [System.IO.File]::ReadAllText($Path, $enc)
Set-Clipboard -Value $t
$c = Get-Clipboard -Raw
Write-Output ('file=' + $Path)
Write-Output ('file_chars=' + $t.Length)
Write-Output ('clip_chars=' + $c.Length)
Write-Output ('clip_mojibake=' + ([regex]::Matches($c, [char]0x0637 + [string][char]0x00A7)).Count)
