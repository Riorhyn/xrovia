import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PROVIA database...");

  // 1. Create Admin User
  const adminPassword = await bcrypt.hash("AdminSecretPassword123!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@provia.id" },
    update: {},
    create: {
      email: "admin@provia.id",
      passwordHash: adminPassword,
      role: "ADMIN",
      country: "United States",
      profile: {
        create: {
          professionalId: "PR-100001",
          fullName: "Provia System Administrator",
          headline: "Universal Career Registry Admin",
          isPublic: true,
          verificationStatus: "VERIFIED",
        },
      },
    },
  });

  // 2. Create Canonical Demo User (Rajinder Singh)
  const userPassword = await bcrypt.hash("DemoPassword123!", 12);
  const demoProfile = await prisma.profile.upsert({
    where: { professionalId: "PR-829471" },
    update: {},
    create: {
      professionalId: "PR-829471",
      fullName: "Rajinder Singh",
      headline: "Mechanical Engineer & Product Designer",
      location: "Chandigarh, India",
      about: "Mechanical Engineer with 6+ years specializing in finite element analysis, additive manufacturing, and CAD prototyping.",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      isPublic: true,
      verificationStatus: "USER_PROVIDED",
      user: {
        create: {
          email: "rajinder@example.com",
          passwordHash: userPassword,
          country: "India",
          role: "USER",
        },
      },
      education: {
        create: [
          {
            degree: "B.E. Mechanical Engineering",
            field: "Mechanical Engineering",
            institution: "Chandigarh University",
            startYear: 2017,
            endYear: 2021,
            grade: "8.8 CGPA",
            description: "Specialized in Thermal Systems and Computational Modeling.",
          },
        ],
      },
      experience: {
        create: [
          {
            company: "AeroDynamics Tech",
            jobTitle: "Senior Mechanical Engineer",
            employmentType: "Full-time",
            location: "Hybrid",
            startDate: new Date("2021-08-01"),
            isCurrent: true,
            description: "Leading CAD modeling and thermal optimization for next-generation drone housings.",
          },
        ],
      },
      skills: {
        create: [
          { name: "SolidWorks" },
          { name: "Finite Element Analysis" },
          { name: "Thermodynamics" },
          { name: "Rapid Prototyping" },
        ],
      },
      projects: {
        create: [
          {
            name: "High-Efficiency Drone Chassis",
            description: "Reduced aerodynamic drag by 14% via computational fluid dynamics simulation.",
            tools: "SolidWorks, ANSYS",
          },
        ],
      },
    },
  });

  // 3. Demo Member Benefits
  await prisma.benefit.createMany({
    data: [
      {
        business: "Demo Learning Hub",
        category: "Tech",
        discount: "20% OFF",
        location: "Online",
        terms: "Applicable on all professional engineering and coding tracks.",
        expiry: new Date("2026-12-31"),
        isDemo: true,
      },
      {
        business: "Demo Work Lounge & Café",
        category: "Lifestyle",
        discount: "10% OFF",
        location: "Chandigarh & Bangalore",
        terms: "Show your Provia QR card at billing counter.",
        expiry: new Date("2026-12-31"),
        isDemo: true,
      },
    ],
  });

  console.log("Database seeded successfully with demo ID: PR-829471 and admin: admin@provia.id");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });