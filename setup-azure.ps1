# Azure Setup Script for Procurement App
# Run these commands one by one to set up your Azure infrastructure

# Variables - Update these as needed
$RESOURCE_GROUP = "rg-procurement-app"
$LOCATION = "eastus2"
$APP_NAME = "procurement-app-$(Get-Random -Maximum 10000)"
$STATIC_WEB_APP_NAME = "swa-$APP_NAME"

Write-Host "Setting up Azure resources for Procurement App..." -ForegroundColor Green
Write-Host "Resource Group: $RESOURCE_GROUP" -ForegroundColor Yellow
Write-Host "Location: $LOCATION" -ForegroundColor Yellow
Write-Host "App Name: $APP_NAME" -ForegroundColor Yellow

# 1. Create Resource Group
Write-Host "`nStep 1: Creating Resource Group..." -ForegroundColor Cyan
az group create --name $RESOURCE_GROUP --location $LOCATION

# 2. Create Entra ID App Registration
Write-Host "`nStep 2: Creating Entra ID App Registration..." -ForegroundColor Cyan
$APP_REGISTRATION = az ad app create --display-name $APP_NAME --sign-in-audience "AzureADMyOrg" --web-redirect-uris "http://localhost:5173" "https://$STATIC_WEB_APP_NAME.azurestaticapps.net" --query appId -o tsv

if ($APP_REGISTRATION) {
    Write-Host "App Registration created with Client ID: $APP_REGISTRATION" -ForegroundColor Green
    
    # Get tenant ID
    $TENANT_ID = az account show --query tenantId -o tsv
    Write-Host "Tenant ID: $TENANT_ID" -ForegroundColor Green
    
    # Update environment files
    Write-Host "`nUpdating environment files..." -ForegroundColor Cyan
    
    # Update frontend .env
    $frontendEnv = Get-Content "src\.env" -Raw
    $frontendEnv = $frontendEnv -replace 'VITE_AZURE_CLIENT_ID=".*"', "VITE_AZURE_CLIENT_ID=`"$APP_REGISTRATION`""
    $frontendEnv = $frontendEnv -replace 'VITE_AZURE_TENANT_ID=".*"', "VITE_AZURE_TENANT_ID=`"$TENANT_ID`""
    $frontendEnv | Set-Content "src\.env"
    
    Write-Host "Frontend .env updated!" -ForegroundColor Green
} else {
    Write-Host "Failed to create App Registration" -ForegroundColor Red
}

# 3. Create Static Web App
Write-Host "`nStep 3: Creating Azure Static Web App..." -ForegroundColor Cyan
$STATIC_WEB_APP = az staticwebapp create --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --location $LOCATION --source "https://github.com/yourusername/yourrepo" --branch main --app-location "/src" --api-location "/api" --output-location "/dist" --query defaultHostname -o tsv

if ($STATIC_WEB_APP) {
    Write-Host "Static Web App created: https://$STATIC_WEB_APP" -ForegroundColor Green
} else {
    Write-Host "Static Web App creation may require GitHub repository setup" -ForegroundColor Yellow
}

Write-Host "`n=== Setup Complete! ===" -ForegroundColor Green
Write-Host "Client ID: $APP_REGISTRATION" -ForegroundColor Yellow
Write-Host "Tenant ID: $TENANT_ID" -ForegroundColor Yellow
Write-Host "Resource Group: $RESOURCE_GROUP" -ForegroundColor Yellow
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Set up GitHub repository for deployment" -ForegroundColor White
Write-Host "2. Test authentication with real Azure credentials" -ForegroundColor White
Write-Host "3. Deploy to Azure Static Web Apps" -ForegroundColor White
