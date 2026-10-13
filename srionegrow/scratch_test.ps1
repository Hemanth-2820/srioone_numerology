$payload = '{"amount": 899, "user_id": 1, "name": "Banglore User", "email": "ompraksh@srionegrow.com"}'
try {
    $response = Invoke-WebRequest -Uri "https://srionegrow.com/backend/api/phonepe.php" -Method Post -Body $payload -ContentType "application/json" -UseBasicParsing
    Write-Output "HTTP Status: $($response.StatusCode)"
    Write-Output "Content: $($response.Content)"
} catch {
    Write-Output "Error: $_"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Output "Response body: $($reader.ReadToEnd())"
    }
}
