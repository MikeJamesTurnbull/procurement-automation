# Azure Deployment Guide

## 🚀 Deployment Steps for Production

### Prerequisites
- ✅ Azure CLI logged in
- ✅ Resource group created: `rg-procurement-app`
- ✅ Entra ID App Registration created
- ✅ Static Web App created
- 🔄 Azure PostgreSQL database being created

### 1. Configure Static Web App Deployment

#### Option A: GitHub Actions (Recommended)
1. **Create GitHub Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial procurement app"
   git remote add origin https://github.com/yourusername/procurement-app.git
   git push -u origin main
   ```

2. **Link to Static Web App**:
   ```bash
   az staticwebapp environment set --name "your-swa-name" --environment-name "Production" --source "GitHub" --branch "main" --app-location "/src" --api-location "/api" --output-location "/dist"
   ```

#### Option B: Manual Deployment
```bash
# Build frontend
cd src && npm run build

# Deploy to Static Web App
az staticwebapp environment deploy --name "your-swa-name" --environment-name "Production" --source-location "./dist"
```

### 2. Database Migration to Production

Once Azure PostgreSQL is created:

1. **Get Connection String**:
   ```bash
   az postgres flexible-server show-connection-string --server-name "postgres-procurement-app" --database-name "postgres" --admin-user "procurement_admin" --admin-password "SecureProcurement2025!"
   ```

2. **Update Production Environment**:
   - Copy `api/.env.production.example` to `api/.env.production`
   - Update DATABASE_URL with Azure PostgreSQL connection string

3. **Run Migrations**:
   ```bash
   cd api
   # Set production DATABASE_URL temporarily
   export DATABASE_URL="postgresql://procurement_admin:SecureProcurement2025!@postgres-procurement-app.postgres.database.azure.com:5432/postgres?sslmode=require"
   npx prisma db push
   npx prisma db seed
   ```

### 3. Configure Environment Variables in Azure

#### Static Web App Configuration:
```bash
# Set environment variables for the Static Web App
az staticwebapp appsettings set --name "your-swa-name" --setting-names VITE_AZURE_CLIENT_ID="6a09791e-6c2e-43e0-ac29-31b53f1923ae" VITE_AZURE_TENANT_ID="d80abc66-b757-4704-ac14-e106bda8c93a" VITE_API_BASE_URL="/api"
```

#### Function App Configuration:
```bash
# Set database and other secrets for the API
az staticwebapp appsettings set --name "your-swa-name" --setting-names DATABASE_URL="postgresql://..." JWT_SECRET="your-production-jwt-secret" NODE_ENV="production"
```

### 4. Update Entra ID Redirect URIs

Add your production URL to the App Registration:
```bash
az ad app update --id "6a09791e-6c2e-43e0-ac29-31b53f1923ae" --web-redirect-uris "http://localhost:5173" "https://your-swa-name.azurestaticapps.net"
```

### 5. Configure Firewall Rules for Database

Allow Azure services to access the database:
```bash
az postgres flexible-server firewall-rule create --resource-group "rg-procurement-app" --name "postgres-procurement-app" --rule-name "AllowAzureServices" --start-ip-address "0.0.0.0" --end-ip-address "0.0.0.0"
```

## 📊 Cost Estimates (Free Trial/Pay-as-you-go)

- **Static Web App**: Free tier (100GB bandwidth, custom domain)
- **PostgreSQL Flexible Server**: ~$15-30/month (Standard_B1ms)
- **Entra ID**: Free (basic features)
- **Resource Group**: No charge

## 🔐 Security Checklist

- [ ] Strong database password configured
- [ ] Firewall rules properly configured
- [ ] JWT secret is unique and secure
- [ ] HTTPS enforced on Static Web App
- [ ] Database SSL/TLS required
- [ ] Environment variables secured in Azure

## 🧪 Testing Production Deployment

1. **Test Authentication**: Verify login works with production domain
2. **Test API**: Ensure all endpoints respond correctly
3. **Test Database**: Verify data persistence and queries
4. **Test Performance**: Check response times and scaling

## 🔄 CI/CD Pipeline (Optional)

Create `.github/workflows/azure-static-web-apps.yml`:
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build_and_deploy_job:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Build And Deploy
      uses: Azure/static-web-apps-deploy@v1
      with:
        azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
        repo_token: ${{ secrets.GITHUB_TOKEN }}
        action: "upload"
        app_location: "/src"
        api_location: "/api"
        output_location: "/dist"
```

## 📞 Next Steps After Database Creation

1. Check database creation status
2. Configure connection strings
3. Run production migrations
4. Test end-to-end deployment
5. Set up monitoring and logging
