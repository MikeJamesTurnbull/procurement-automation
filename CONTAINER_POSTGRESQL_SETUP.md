# Azure Container Instance PostgreSQL Setup

## Quick PostgreSQL Setup with Azure Container Instances

If the Flexible Server creation has issues, here's a reliable alternative that works in most regions:

### 1. Create PostgreSQL Container

```bash
# Create PostgreSQL in a container - works in most regions
az container create \
  --resource-group "rg-procurement-app" \
  --name "procurement-postgres-container" \
  --image "postgres:15-alpine" \
  --environment-variables \
    POSTGRES_DB=procurement_db \
    POSTGRES_USER=procurement_user \
    POSTGRES_PASSWORD=SecureProcurement2025! \
    PGDATA=/var/lib/postgresql/data/pgdata \
  --ports 5432 \
  --protocol TCP \
  --location "eastus2" \
  --memory 1 \
  --cpu 0.5 \
  --dns-name-label "procurement-postgres-$(date +%s)" \
  --restart-policy Always
```

### 2. Get Connection Details

```bash
# Get the public IP and FQDN
az container show --resource-group "rg-procurement-app" --name "procurement-postgres-container" --query "{FQDN:ipAddress.fqdn,IP:ipAddress.ip}" -o table

# Connection string will be:
# postgresql://procurement_user:SecureProcurement2025!@[FQDN]:5432/procurement_db
```

### 3. Update Environment Configuration

Update your `api/.env.production.example`:
```env
DATABASE_URL="postgresql://procurement_user:SecureProcurement2025!@procurement-postgres-[timestamp].eastus2.azurecontainer.io:5432/procurement_db"
```

### 4. Run Migrations

```bash
cd api
export DATABASE_URL="postgresql://procurement_user:SecureProcurement2025!@[container-fqdn]:5432/procurement_db"
npx prisma db push
npx prisma db seed
```

## Advantages of Container Approach

✅ **Works in all regions** (not restricted like Flexible Server)
✅ **Lower cost** (~$10/month vs ~$20/month)
✅ **Quick setup** (5 minutes vs 15+ minutes)
✅ **Full control** over PostgreSQL configuration
✅ **Persistent storage** with restart policy

## Disadvantages

❌ **No automatic backups** (need to set up yourself)
❌ **No automatic scaling** 
❌ **Manual maintenance** required
❌ **Less security features** than managed service

## Cost Comparison

- **Container Instance**: ~$10/month (1GB RAM, 0.5 CPU)
- **Flexible Server**: ~$20/month (B1ms)
- **With Free Trial**: Either uses ~5-10% of your $200 credit

## Security Configuration

Add these firewall rules for production:

```bash
# Allow only your Static Web App (after deployment)
az container create ... --ip-address Public --ports 5432

# For production, consider:
# 1. VNet integration
# 2. Private endpoints
# 3. SSL certificates
# 4. Backup scripts
```

This approach gives you a production PostgreSQL database that works within Free Trial limits!
