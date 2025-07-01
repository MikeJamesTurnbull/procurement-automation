# 🚀 Deploy to Production

## Step 1: Create GitHub Repository

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial procurement app with Azure PostgreSQL"

# Create repository on GitHub and push
git remote add origin https://github.com/yourusername/procurement-app.git
git branch -M main
git push -u origin main
```

## Step 2: Configure Static Web App Deployment

Get your Static Web App deployment token:
```bash
az staticwebapp secrets list --name "swa-procurement-app" --resource-group "rg-procurement-app" --query "properties.apiKey" -o tsv
```

## Step 3: Set Environment Variables in Azure

Configure your Static Web App with production settings:
```bash
# Set frontend environment variables
az staticwebapp appsettings set --name "swa-procurement-app" --setting-names \
  VITE_AZURE_CLIENT_ID="6a09791e-6c2e-43e0-ac29-31b53f1923ae" \
  VITE_AZURE_TENANT_ID="d80abc66-b757-4704-ac14-e106bda8c93a" \
  VITE_API_BASE_URL="/api"

# Set backend environment variables  
az staticwebapp appsettings set --name "swa-procurement-app" --setting-names \
  DATABASE_URL="postgresql://procurement_admin:SecureProcurement2025!@procurement-postgres-db.postgres.database.azure.com/flexibleserverdb?sslmode=require" \
  JWT_SECRET="azure-production-jwt-secret-procurement-2025-secure" \
  NODE_ENV="production" \
  FUNCTIONS_WORKER_RUNTIME="node"
```

## Step 4: Update Redirect URIs

Add your production domain to Azure App Registration:
```bash
# Get your Static Web App URL
$SWA_URL = az staticwebapp show --name "swa-procurement-app" --resource-group "rg-procurement-app" --query "defaultHostname" -o tsv

# Update App Registration with production URL
az ad app update --id "6a09791e-6c2e-43e0-ac29-31b53f1923ae" --web-redirect-uris "http://localhost:5173" "https://$SWA_URL"
```

## Step 5: Create GitHub Actions Workflow

Create `.github/workflows/azure-static-web-apps.yml`:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches: [ main ]

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/src"
          api_location: "/api"
          output_location: "/dist"
          app_build_command: "npm run build"
          api_build_command: "npm run build"

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

## Step 6: Configure Secrets

In your GitHub repository settings, add:
- `AZURE_STATIC_WEB_APPS_API_TOKEN`: Get from Step 2

## Step 7: Deploy!

```bash
git add .
git commit -m "Add GitHub Actions workflow"
git push origin main
```

Your app will automatically deploy to:
`https://swa-procurement-app.azurestaticapps.net`

## 🎉 Production Ready!

Your procurement app is now running in production with:
- ✅ Azure PostgreSQL database
- ✅ Azure Static Web Apps hosting
- ✅ Real Entra ID authentication
- ✅ Automatic CI/CD deployment
- ✅ HTTPS and custom domain support

**Total cost**: ~$15-20/month from your $200 Free Trial credit!
