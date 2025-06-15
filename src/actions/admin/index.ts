"use server";

import prisma from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSession, deleteSession, getSession } from "../session";

export async function loginAdmin(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();
  if (!username || !password) {
    return { error: "Username dan password harus diisi" };
  }

  const admin = await prisma.user.findFirst({
    where: {
      username,
      role: "ADMIN",
      isActive: true,
    },
  });

  if (!admin) {
    return { error: "Admin tidak ditemukan" };
  }

  const passwordMatch = await compare(password, admin.password);
  if (!passwordMatch) {
    return { error: "Password salah" };
  }

  await Promise.all([
    createSession(admin.id, "ADMIN"),
    prisma.user.update({
      where: {
        id: admin.id,
      },
      data: {
        lastLogin: new Date(),
      },
    }),
  ]);

  return {
    error: null,
  };
}

export async function getAdmin() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return await prisma.user.findUnique({
    where: { id: session.userId, role: "ADMIN", isActive: true },
    select: {
      username: true,
      id: true,
      role: true,
      lastLogin: true,
      createdAt: true,
      adminDetails: true,
    },
  });
}

export async function updateAdmin(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const name = formData.get("adminName") as string;
    const username = formData.get("username") as string;
    const adminId = formData.get("id") as string;

    if (!name || !username) {
      return {
        error: "Semua field harus diisi.",
      };
    }

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: username,
        isActive: true,
      },
    });

    if (existingUsername && existingUsername.id !== adminId) {
      return {
        error: "Username sudah digunakan.",
      };
    }

    if (/\s/.test(username.toString())) {
      return {
        error: "Username tidak boleh mengandung spasi",
      };
    }

    await prisma.user.update({
      where: {
        id: adminId,
      },
      data: {
        username: username,
        adminDetails: {
          update: {
            adminName: name,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Terjadi kesalahan.",
    };
  }

  revalidatePath("/admin/profile");
  redirect("/admin/profile");
}

export async function updateAdminPassword(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const adminId = formData.get("id") as string;

    if (!oldPassword || !confirmPassword || !newPassword) {
      return {
        error: "Semua field harus diisi.",
      };
    }

    const admin = await prisma.user.findUnique({
      where: {
        id: adminId,
        isActive: true,
      },
    });

    const verifyPassword = await compare(oldPassword, admin!.password);
    if (!verifyPassword) {
      return {
        error: "Password lama tidak cocok.",
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        error: "Password tidak cocok.",
      };
    }

    const hashPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: adminId,
      },
      data: {
        password: hashPassword,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      error: "Terjadi kesalahan.",
    };
  }

  revalidatePath("/admin/profile");
  redirect("/admin/profile");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

export async function customRevalidation() {
  revalidatePath("/", "layout");
}
