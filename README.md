# Procurement Automation App

A full-stack procurement automation application built with:

## Frontend
- React with TypeScript
- Fluent UI components
- Azure MSAL for authentication
- Vite for build tooling

## Backend
- Azure Functions
- Prisma ORM
- PostgreSQL database
- JWT authentication

## Infrastructure
- Azure Static Web Apps
- Azure Database for PostgreSQL
- Azure Entra ID integration

## Deployment
This application is deployed to Azure using GitHub Actions for CI/CD.

Production URL: https://thankful-desert-002cc000f.2.azurestaticapps.net

## Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start PostgreSQL container: `docker-compose up -d`
5. Run database migrations: `cd api && npm run db:migrate`
6. Start development servers:
   - Frontend: `cd src && npm run dev`
   - Backend: `cd api && npm start`
