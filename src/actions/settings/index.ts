"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, unstable_cache } from "next/cache";

export const getSettings = unstable_cache(async function getSettings() {
  return prisma.companySettings.findFirst();
});

export async function updateSettings(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const email = formData.get("email") as string;
    const website = formData.get("website") as string;
    const logo = formData.get("logo") as string;
    const aboutUs = formData.get("aboutUs") as string;
    const monthlyRate = formData.get("monthlyRate") as string;
    const description = formData.get("description") as string;
    const billingDate = formData.get("billingDate") as string;
    const id = formData.get("id") as string;
    const bankName = formData.get("bankName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const accountName = formData.get("accountName") as string;

    if (
      !name ||
      !id ||
      !address ||
      !phoneNumber ||
      !email ||
      !website ||
      !logo ||
      !aboutUs ||
      !monthlyRate ||
      !billingDate ||
      !bankName ||
      !accountNumber ||
      !accountName
    ) {
      return {
        error: "Semua field harus diisi.",
      };
    }

    await prisma.companySettings.update({
      where: {
        id,
      },
      data: {
        name: name,
        address: address,
        phoneNumber: phoneNumber,
        email: email,
        website: website,
        logo: logo,
        aboutUs: aboutUs,
        montyhlyRate: parseFloat(monthlyRate),
        description: description,
        billingDate: Number(billingDate),
        accountName,
        accountNumber,
        bankName,
      },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/", "layout");
    return {
      error: null,
    };
  } catch (error) {
    console.error("Error updating settings:", error);
    return {
      error: "Terjadi kesalahan saat memperbarui pengaturan.",
    };
  }
}
