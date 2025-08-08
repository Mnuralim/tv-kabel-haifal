import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

async function createAdmin() {
  console.log("Seeding admin...");

  const defaultAdmin = {
    username: process.env.ADMIN_USERNAME!,
    password: process.env.ADMIN_PASSWORD!,
  };

  const existingAdmin = await prisma.user.findFirst({
    where: { username: defaultAdmin.username, role: "ADMIN" },
  });

  if (!existingAdmin) {
    const hashedPassword = await hash(defaultAdmin.password, 10);

    await prisma.user.create({
      data: {
        username: defaultAdmin.username,
        password: hashedPassword,
        role: "ADMIN",
        adminDetails: {
          create: {
            adminName: "Admin Magang",
          },
        },
      },
    });

    console.log("Admin seeded successfully!");
  } else {
    console.log("Admin already exists. Skipping seeding.");
  }
}

async function createSettings() {
  const setting = {
    name: "TV Kabel Haifal",
    address: "Jl. Mawar No. 123, Buton Tengah, Sulawesi Tenggara",
    phoneNumber: "(021) 1234-5678",
    email: "info@tvkabelhaikal.com",
    website: "www.tvkabelhaikal.com",
    logo: "/logo-company.png",
    aboutUs:
      "Penyedia layanan TV kabel dan internet terpercaya di kawasan Anda.",
    montyhlyRate: 30000,
    description: "",
  };

  const existingSetting = await prisma.companySettings.findFirst();

  if (existingSetting) {
    return;
  }

  await prisma.companySettings.create({
    data: setting,
  });

  console.log("Settings seeded successfully!");
}

async function main() {
  await createAdmin();
  await createSettings();
}

main()
  .catch((e) => {
    console.error("Error seeding database", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
