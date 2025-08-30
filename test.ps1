# Test script for BFHL API (PowerShell version)
# Usage: .\test.ps1 [base-url]
# Default base URL is http://localhost:3000

param(
    [string]$BaseUrl = "http://localhost:3000"
)

$Endpoint = "$BaseUrl/bfhl"

Write-Host "Testing BFHL API at: $Endpoint" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Test Example A
Write-Host "`n🧪 Test Example A:" -ForegroundColor Yellow
Write-Host 'Request: {"data":["a","1","334","4","R","$"]}' -ForegroundColor Cyan
Write-Host "Response:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri $Endpoint -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"data":["a","1","334","4","R","$"]}'
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Example B  
Write-Host "`n🧪 Test Example B:" -ForegroundColor Yellow
Write-Host 'Request: {"data":["2","a","y","4","&","-","*","5","92","b"]}' -ForegroundColor Cyan
Write-Host "Response:" -ForegroundColor Cyan
try {
    $body = '{"data":["2","a","y","4","&","-","*","5","92","b"]}'
    $response = Invoke-WebRequest -Uri $Endpoint -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Example C
Write-Host "`n🧪 Test Example C:" -ForegroundColor Yellow  
Write-Host 'Request: {"data":["A","ABcD","DOE"]}' -ForegroundColor Cyan
Write-Host "Response:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri $Endpoint -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"data":["A","ABcD","DOE"]}'
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Error Case - Invalid JSON
Write-Host "`n🧪 Test Error Case - Missing data field:" -ForegroundColor Yellow
Write-Host 'Request: {"invalid":[]}' -ForegroundColor Cyan
Write-Host "Response:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri $Endpoint -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"invalid":[]}'
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Error Case - Wrong method
Write-Host "`n🧪 Test Error Case - GET method (should fail):" -ForegroundColor Yellow
Write-Host "Response:" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri $Endpoint -Method GET
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ All tests completed!" -ForegroundColor Green
