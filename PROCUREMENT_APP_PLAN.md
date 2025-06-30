# Comprehensive Plan: Internal Procurement Automation Web App

## 1. Project Overview

**Application Purpose**: Internal department web application to automate procurement processes with form submission, sequential approval workflow, and administrative oversight.

**Key Features**:
- Procurement request form submission
- Sequential approval workflow
- Administrative dashboard for monitoring
- Entra ID authentication and authorization
- Real-time status tracking

## 2. Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **UI Library**: Fluent UI React v9
- **State Management**: React Query for server state, Zustand for client state
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Authentication**: MSAL (Microsoft Authentication Library) for React

### Backend
- **Runtime**: Node.js with TypeScript
- **Platform**: Azure Functions v4
- **API Framework**: Azure Functions HTTP triggers
- **Authentication**: Azure Functions authentication with Entra ID
- **Database ORM**: Prisma

### Database
- **Database**: Azure Database for PostgreSQL
- **ORM**: Prisma with PostgreSQL adapter
- **Development**: Local PostgreSQL with Docker
- **Schema Management**: Prisma migrations
- **Query Builder**: Prisma Client with type safety

### Development Tooling
- **MCP Server**: Custom MCP server for database operations during development
- **Infrastructure**: Azure CLI with Bicep templates
- **CI/CD**: GitHub Actions
- **Monitoring**: Azure Application Insights

## 3. Architecture Design

### High-Level Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React SPA     │───▶│  Azure Functions │───▶│  PostgreSQL DB  │
│  (Static Web    │    │   (Node.js/TS)   │    │   (Azure)       │
│   App Hosting)  │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │
         ▼                        ▼
┌─────────────────┐    ┌──────────────────┐
│   Entra ID      │    │ Application      │
│ Authentication  │    │   Insights       │
└─────────────────┘    └──────────────────┘
```

### Database Schema Design
```prisma
// Prisma Schema (schema.prisma)
model User {
  id         String   @id @default(cuid())
  entraId    String   @unique @map("entra_id")
  email      String   @unique
  name       String
  department String
  role       UserRole
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  // Relations
  requests         ProcurementRequest[]
  approvals        ApprovalStep[]
  auditLogs        AuditLog[]

  @@map("users")
}

model ProcurementRequest {
  id          String            @id @default(cuid())
  userId      String            @map("user_id")
  title       String
  description String
  amount      Decimal           @db.Decimal(12, 2)
  status      RequestStatus
  categoryId  String            @map("category_id")
  createdAt   DateTime          @default(now()) @map("created_at")
  updatedAt   DateTime          @updatedAt @map("updated_at")

  // Relations
  user         User           @relation(fields: [userId], references: [id])
  category     Category       @relation(fields: [categoryId], references: [id])
  approvals    ApprovalStep[]
  attachments  Attachment[]
  auditLogs    AuditLog[]

  @@map("procurement_requests")
}

model ApprovalStep {
  id         String        @id @default(cuid())
  requestId  String        @map("request_id")
  approverId String        @map("approver_id")
  stepOrder  Int           @map("step_order")
  status     ApprovalStatus
  approvedAt DateTime?     @map("approved_at")
  comments   String?
  createdAt  DateTime      @default(now()) @map("created_at")

  // Relations
  request  ProcurementRequest @relation(fields: [requestId], references: [id])
  approver User              @relation(fields: [approverId], references: [id])

  @@unique([requestId, stepOrder])
  @@map("approval_steps")
}

model ApprovalTemplate {
  id        String   @id @default(cuid())
  name      String
  maxAmount Decimal  @db.Decimal(12, 2) @map("max_amount")
  stepsConfig Json   @map("steps_config")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  categories Category[]

  @@map("approval_templates")
}

model Category {
  id                String            @id @default(cuid())
  name              String
  approvalTemplateId String           @map("approval_template_id")
  createdAt         DateTime          @default(now()) @map("created_at")

  // Relations
  approvalTemplate ApprovalTemplate    @relation(fields: [approvalTemplateId], references: [id])
  requests         ProcurementRequest[]

  @@map("categories")
}

model Attachment {
  id        String   @id @default(cuid())
  requestId String   @map("request_id")
  filename  String
  blobUrl   String   @map("blob_url")
  fileSize  Int      @map("file_size")
  mimeType  String   @map("mime_type")
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  request ProcurementRequest @relation(fields: [requestId], references: [id])

  @@map("attachments")
}

model AuditLog {
  id        String   @id @default(cuid())
  requestId String   @map("request_id")
  userId    String   @map("user_id")
  action    String
  details   Json?
  timestamp DateTime @default(now())

  // Relations
  request ProcurementRequest @relation(fields: [requestId], references: [id])
  user    User              @relation(fields: [userId], references: [id])

  @@map("audit_logs")
}

// Enums
enum UserRole {
  USER
  APPROVER
  ADMINISTRATOR
}

enum RequestStatus {
  DRAFT
  SUBMITTED
  PENDING_APPROVAL
  APPROVED
  REJECTED
  CANCELLED
}

enum ApprovalStatus {
  PENDING
  APPROVED
  REJECTED
}
```

## 4. Security Implementation

### Entra ID Integration
- **Frontend**: MSAL React for single sign-on
- **Backend**: Azure Functions authentication middleware
- **API Protection**: Bearer token validation on all endpoints
- **Role-Based Access**: Custom roles (User, Approver, Administrator)

### Security Measures
- HTTPS enforcement (automatic with Azure Static Web Apps)
- CORS configuration for secure cross-origin requests
- Input validation and sanitization
- SQL injection prevention via parameterized queries
- File upload security (virus scanning, type validation)

## 5. Application Features & User Stories

### User Roles
1. **Requestor**: Submit procurement requests
2. **Approver**: Review and approve/reject requests
3. **Administrator**: Full system oversight and configuration

### Core Features

**Procurement Request Form**:
- Multi-step form with validation
- File attachment support
- Auto-save functionality
- Category selection (determines approval workflow)
- Cost center assignment

**Approval Workflow**:
- Dynamic approval chains based on amount/category
- Email notifications for pending approvals
- Approval comments and rejection reasons
- Escalation for overdue approvals
- Parallel and sequential approval options

**Dashboard & Monitoring**:
- Personal request tracking for requestors
- Pending approvals queue for approvers
- System-wide analytics for administrators
- Real-time status updates
- Reporting and export capabilities

## 6. Development Workflow with MCP Server

### MCP Server Setup
```typescript
// Custom MCP server for database operations with Prisma
interface DatabaseMCPServer {
  // Schema management
  generatePrismaMigration(name: string): Migration;
  runPrismaMigration(): Result;
  resetPrismaDatabase(): void;
  
  // Data operations
  seedTestData(): void;
  executeRawSQL(query: string): Result;
  
  // Prisma helpers
  generatePrismaClient(): void;
  introspectDatabase(): Schema;
  
  // Development helpers
  generateMockData(model: string, count: number): void;
  createTestUser(role: UserRole): User;
  createTestProcurementRequest(userId: string): ProcurementRequest;
}
```

### Development Environment
- Local PostgreSQL via Docker Compose
- Azure Functions Core Tools for local backend development
- Vite dev server for frontend hot reload
- MCP server for rapid database operations and testing

## 7. Azure Infrastructure

### Resource Architecture
```
Resource Group: rg-procurement-app-[env]
├── Static Web App (swa-procurement-[env])
├── Function App (func-procurement-api-[env])
├── PostgreSQL Server (psql-procurement-[env])
├── Storage Account (stprocurement[env])
├── Application Insights (ai-procurement-[env])
├── Key Vault (kv-procurement-[env])
└── App Service Plan (asp-procurement-[env])
```

### Cost Optimization
- Azure PostgreSQL Flexible Server (burstable tier for development)
- Consumption plan for Azure Functions
- Free tier for Azure Static Web Apps (suitable for internal apps)
- Shared Application Insights instance

## 8. Deployment Strategy

### Infrastructure as Code
```bicep
// Bicep templates for:
- Resource group and core resources
- Network security groups
- Database with connection strings in Key Vault
- Static Web App with custom domains
- Function App with managed identity
- Application Insights integration
```

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
- Build and test React app
- Build and test Azure Functions
- Deploy infrastructure changes
- Deploy frontend to Static Web Apps
- Deploy backend to Function App
- Run integration tests
- Database migrations
```

## 9. Data Flow & API Design

### API Endpoints
```typescript
// Authentication
GET  /api/auth/me
POST /api/auth/refresh

// Procurement Requests
GET    /api/requests
POST   /api/requests
GET    /api/requests/{id}
PUT    /api/requests/{id}
DELETE /api/requests/{id}

// Approvals
GET  /api/approvals/pending
POST /api/approvals/{requestId}/approve
POST /api/approvals/{requestId}/reject

// Administrative
GET /api/admin/dashboard
GET /api/admin/users
PUT /api/admin/approval-templates
```

### State Management
- React Query for server state caching
- Optimistic updates for better UX
- Real-time updates via SignalR (optional)

## 10. Implementation Phases

### Phase 1: Foundation (2-3 weeks)
- Set up development environment
- Implement Entra ID authentication
- Create basic React app with Fluent UI
- Set up Azure Functions backend
- Database schema and MCP server

### Phase 2: Core Features (3-4 weeks)
- Procurement request form
- Basic approval workflow
- User dashboard
- File upload functionality

### Phase 3: Advanced Features (2-3 weeks)
- Administrative features
- Advanced reporting
- Email notifications
- Audit logging

### Phase 4: Polish & Deploy (1-2 weeks)
- Performance optimization
- Security hardening
- Production deployment
- User training and documentation

## 11. Monitoring & Maintenance

### Application Monitoring
- Azure Application Insights for performance tracking
- Custom telemetry for business metrics
- Error tracking and alerting
- User activity analytics

### Maintenance Strategy
- Automated backup strategies
- Database maintenance windows
- Security patch management
- Performance monitoring and optimization

## 12. Estimated Costs (Monthly)

### Development Environment
- PostgreSQL Flexible Server (Burstable B1ms): ~$12
- Function App (Consumption): ~$5
- Static Web App: Free
- Storage Account: ~$2
- **Total Dev**: ~$19/month

### Production Environment
- PostgreSQL Flexible Server (General Purpose D2s_v3): ~$180
- Function App (Premium plan): ~$150
- Static Web App: Free
- Storage Account: ~$10
- Application Insights: ~$20
- **Total Prod**: ~$360/month

## 13. Next Steps

1. **Environment Setup**: Initialize the development workspace with the required tools
2. **Azure Resource Planning**: Create Bicep templates for infrastructure
3. **Authentication Setup**: Configure Entra ID app registrations
4. **Database Design**: Finalize schema and set up MCP server
5. **Frontend Foundation**: Create React app with Fluent UI components
6. **Backend API**: Develop Azure Functions with authentication
7. **Integration Testing**: End-to-end testing with real Azure resources

---

*Plan created on: June 30, 2025*
*Last updated: June 30, 2025*

This comprehensive plan provides a solid foundation for building the internal procurement automation web app. The architecture is scalable, secure, and follows Azure best practices while keeping costs reasonable for an internal application.
