import { PrismaClient, UserRole, RequestStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create approval template
  const basicTemplate = await prisma.approvalTemplate.create({
    data: {
      name: 'Basic Approval (Under $5,000)',
      maxAmount: 5000,
      stepsConfig: {
        steps: [
          { order: 1, role: 'APPROVER', description: 'Department Manager Approval' }
        ]
      }
    }
  });

  const advancedTemplate = await prisma.approvalTemplate.create({
    data: {
      name: 'Advanced Approval (Over $5,000)',
      maxAmount: 50000,
      stepsConfig: {
        steps: [
          { order: 1, role: 'APPROVER', description: 'Department Manager Approval' },
          { order: 2, role: 'APPROVER', description: 'Finance Director Approval' }
        ]
      }
    }
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Office Supplies',
        approvalTemplateId: basicTemplate.id
      }
    }),
    prisma.category.create({
      data: {
        name: 'Equipment',
        approvalTemplateId: advancedTemplate.id
      }
    }),
    prisma.category.create({
      data: {
        name: 'Software',
        approvalTemplateId: basicTemplate.id
      }
    }),
    prisma.category.create({
      data: {
        name: 'Services',
        approvalTemplateId: advancedTemplate.id
      }
    })
  ]);

  // Create test users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        entraId: 'user1@company.com',
        email: 'john.doe@company.com',
        name: 'John Doe',
        department: 'Engineering',
        role: UserRole.USER
      }
    }),
    prisma.user.create({
      data: {
        entraId: 'manager1@company.com',
        email: 'jane.smith@company.com',
        name: 'Jane Smith',
        department: 'Engineering',
        role: UserRole.APPROVER
      }
    }),
    prisma.user.create({
      data: {
        entraId: 'admin1@company.com',
        email: 'admin@company.com',
        name: 'Admin User',
        department: 'IT',
        role: UserRole.ADMINISTRATOR
      }
    })
  ]);

  // Create sample procurement requests
  const requests = await Promise.all([
    prisma.procurementRequest.create({
      data: {
        title: 'New Development Laptops',
        description: 'Need 5 new MacBook Pros for the development team',
        amount: 12500.00,
        status: RequestStatus.SUBMITTED,
        userId: users[0].id,
        categoryId: categories[1].id // Equipment
      }
    }),
    prisma.procurementRequest.create({
      data: {
        title: 'Office Printer Paper',
        description: 'Monthly supply of printer paper for the office',
        amount: 150.00,
        status: RequestStatus.APPROVED,
        userId: users[0].id,
        categoryId: categories[0].id // Office Supplies
      }
    })
  ]);

  console.log('Database seeded successfully!');
  console.log(`Created ${users.length} users`);
  console.log(`Created ${categories.length} categories`);
  console.log(`Created ${requests.length} procurement requests`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
