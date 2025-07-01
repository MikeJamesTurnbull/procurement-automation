# MCP Server Configuration for Procurement App

This document explains how to set up and configure existing MCP servers for your procurement application development workflow.

## 🗄️ Database MCP Server

### PostgreSQL MCP Server (Official)
**Purpose**: Direct database operations, schema management, queries

**Installation**:
```bash
npm install -g @modelcontextprotocol/server-postgres
```

**Configuration** (add to Claude Desktop config):
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://procurement_user:procurement_pass@localhost:5432/procurement_db"]
    }
  }
}
```

**Features**:
- Execute SQL queries
- Schema inspection
- Table management
- Data analysis

## 📁 File System MCP Server

### Filesystem MCP Server (Official)
**Purpose**: File operations, code management

**Installation**:
```bash
npm install -g @modelcontextprotocol/server-filesystem
```

**Configuration**:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\MikeTurnbull\\playground\\internal-app"]
    }
  }
}
```

**Features**:
- Read/write files
- Directory operations
- Search files
- Code analysis

## 🐙 GitHub MCP Server

### GitHub MCP Server (Official)
**Purpose**: Repository management, CI/CD, deployment

**Installation**:
```bash
npm install -g @modelcontextprotocol/server-github
```

**Configuration**:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-github-token-here"
      }
    }
  }
}
```

**Features**:
- Repository management
- Issue tracking
- Pull requests
- CI/CD integration

## 🔧 Setup Instructions

### 1. Install MCP Servers
```bash
# Install all recommended servers
npm install -g @modelcontextprotocol/server-postgres
npm install -g @modelcontextprotocol/server-filesystem  
npm install -g @modelcontextprotocol/server-github
```

### 2. Configure Claude Desktop

**Location**: `%APPDATA%\Claude\claude_desktop_config.json` (Windows)

**Complete Configuration**:
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://procurement_user:procurement_pass@localhost:5432/procurement_db"],
      "env": {
        "NODE_ENV": "development"
      }
    },
    "filesystem": {
      "command": "npx", 
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\MikeTurnbull\\playground\\internal-app"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-github-token-here"
      }
    }
  }
}
```

### 3. Get GitHub Token
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token with repo, workflow, and admin permissions
3. Add token to the configuration above

## 🎯 Usage Examples

### Database Operations
- "Show me all procurement requests from the database"
- "Create a new procurement category"
- "Analyze spending patterns by department"

### File Operations  
- "Update the README with deployment instructions"
- "Find all TypeScript files with authentication logic"
- "Create a new component for approval workflow"

### GitHub Operations
- "Create a new feature branch for approval workflow"
- "Review open pull requests"
- "Set up GitHub Actions for deployment"

## 🔄 Alternative: Advanced Database MCP

For more advanced database features, consider:

### SchemaFlow MCP Server
**GitHub**: https://github.com/CryptoRadi/schemaflow-mcp-server
**Features**: Real-time schema access, database analysis

```bash
npm install -g @cryptoradi/schemaflow-mcp-server
```

## 📋 Next Steps

1. ✅ Install the MCP servers globally
2. ✅ Configure Claude Desktop with the servers
3. ✅ Generate GitHub personal access token
4. ✅ Test the connections
5. ✅ Start using MCP-enhanced development workflow!

Your procurement app will now have AI-powered:
- Database management and analysis
- File and code operations  
- GitHub repository management
- Development workflow automation
