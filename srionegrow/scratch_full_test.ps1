$payload = @{
    user_id    = 1
    amount     = 899
    name       = 'Hemanth'
    email      = 'sillahemanth02@gmail.com'
    address    = 'agara'
    city       = 'banglore'
    postalCode = '560102'
} | ConvertTo-Json

try {
    $res = Invoke-WebRequest -Uri 'https://srionegrow.com/backend/api/phonepe.php' -Method Post -Body $payload -ContentType 'application/json' -UseBasicParsing
    Write-Output "Status: $($res.StatusCode)"
    Write-Output "Content: $($res.Content)"
} catch {
    Write-Output "Error: $_"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Output "Body: $($reader.ReadToEnd())"
    }
}
