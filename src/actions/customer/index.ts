"use server";

import type { CustomerStatus } from "@prisma/client";
import { revalidatePath, unstable_cache } from "next/cache";
import {
  buildOrderBy,
  buildSearchConditions,
  checkExistingCustomerData,
  checkExistingUsername,
  extractFormData,
  getStatusNotification,
  parseAndValidateDates,
  validatePasswordMatch,
  validateRequiredFields,
} from "./helper";
import prisma from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { createAdminNotification } from "../admin-notification";
import { redirect } from "next/navigation";
import { createSession, deleteSession, getSession } from "../session";
import { createCustomerNotification } from "../customer-notification";

export const getAllCustomers = unstable_cache(async function getAllCustomers(
  take: string,
  skip: string,
  status?: CustomerStatus,
  search?: string,
  sortBy?: string,
  sortOrder?: string
) {
  const params: CustomerPaginationParams = {
    take,
    skip,
    status,
    search,
    sortBy,
    sortOrder,
  };

  const whereConditions = buildSearchConditions(params);
  const orderBy = buildOrderBy(sortBy, sortOrder);

  const [customers, totalCount] = await Promise.all([
    prisma.user.findMany({
      where: whereConditions,
      include: {
        customerDetails: {
          include: {
            complaints: true,
            bills: {
              where: { paymentStatus: { not: "PAID" } },
            },
          },
        },
      },
      take: parseInt(take),
      skip: parseInt(skip),
      orderBy,
    }),
    prisma.user.count({ where: whereConditions }),
  ]);

  return {
    customers,
    totalCount,
    currentPage: Math.floor(parseInt(skip) / parseInt(take)) + 1,
    totalPages: Math.ceil(totalCount / parseInt(take)),
    itemsPerPage: parseInt(take),
  };
});

export const getCustomerById = unstable_cache(async function getCustomerById(
  id: string
) {
  return await prisma.user.findUnique({
    where: { id, isActive: true },
    include: {
      customerDetails: {
        include: {
          bills: {
            orderBy: { createdAt: "desc" },
          },
          complaints: {
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });
});

export async function createCustomer(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const data = extractFormData<CustomerFormData>(formData, [
      "username",
      "fullName",
      "address",
      "phoneNumber",
      "email",
      "idCardNumber",
      "familyCardNumber",
      "birthDate",
      "birthPlace",
      "status",
      "registrationDate",
      "subscriptionDate",
      "password",
      "confirmPassword",
    ]);

    const requiredFields: (keyof CustomerFormData)[] = [
      "username",
      "fullName",
      "address",
      "phoneNumber",
      "email",
      "idCardNumber",
      "familyCardNumber",
      "birthDate",
      "birthPlace",
    ];

    const requiredFieldError = validateRequiredFields(data, requiredFields);
    if (requiredFieldError) return { error: requiredFieldError };

    const passwordError = validatePasswordMatch(
      data.password,
      data.confirmPassword
    );
    if (passwordError) return { error: passwordError };

    const existingUsernameError = await checkExistingUsername(data.username!);
    if (existingUsernameError) return { error: existingUsernameError };

    const existingCustomerError = await checkExistingCustomerData(data);
    if (existingCustomerError) return { error: existingCustomerError };

    const dates = parseAndValidateDates(data);

    const hashedPassword =
      data.password && data.confirmPassword
        ? await hash(data.password, 10)
        : await hash(data.username!, 10);

    await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          username: data.username!,
          password: hashedPassword,
          role: "CUSTOMER",
        },
      });

      await tx.customerDetail.create({
        data: {
          userId: newUser.id,
          fullName: data.fullName!,
          address: data.address!,
          phoneNumber: data.phoneNumber!,
          email: data.email!,
          idCardNumber: data.idCardNumber!,
          familyCardNumber: data.familyCardNumber!,
          birthDate: dates.birthDate,
          birthPlace: data.birthPlace!,
          status: data.status || "INACTIVE",
          registrationDate: dates.registrationDate,
          subscriptionStartDate: dates.subscriptionDate,
        },
      });

      if (data.password && data.confirmPassword) {
        await createAdminNotification(
          "USER_ACTIVATION_REQUEST",
          "Permintaan Aktivasi",
          "Permintaan aktivasi telah dikirimkan",
          `/customers/${newUser.id}`
        );
      }
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    return { error: "Terjadi kesalahan saat membuat customer" };
  }

  revalidatePath("/admin/customers");
  revalidatePath("/admin/bills");
  revalidatePath("/admin");

  const redirectPath =
    formData.get("password") && formData.get("confirmPassword")
      ? "/register-success"
      : "/admin/customers";

  redirect(redirectPath);
}

export async function updateCustomer(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  let currentUserId: string | undefined;
  let shouldRedirectToAdmin = false;
  try {
    const data = extractFormData<UpdateCustomerFormData>(formData, [
      "id",
      "username",
      "fullName",
      "address",
      "phoneNumber",
      "email",
      "idCardNumber",
      "familyCardNumber",
      "birthDate",
      "birthPlace",
      "status",
      "registrationDate",
      "subscriptionDate",
      "password",
    ]);

    const requiredFields: (keyof UpdateCustomerFormData)[] = [
      "id",
      "fullName",
      "address",
      "phoneNumber",
      "email",
      "idCardNumber",
      "familyCardNumber",
      "birthDate",
      "birthPlace",
    ];

    const requiredFieldError = validateRequiredFields(data, requiredFields);
    if (requiredFieldError) return { error: requiredFieldError };
    const user = await getSession();
    currentUserId = user?.userId;

    const existingCustomerError = await checkExistingCustomerData(
      data,
      data.id
    );
    if (existingCustomerError) return { error: existingCustomerError };

    const existingCustomer = await prisma.customerDetail.findUnique({
      where: { userId: data.id!, isActive: true },
    });

    const dates = parseAndValidateDates(data);

    await prisma.customerDetail.update({
      where: { userId: data.id! },
      data: {
        fullName: data.fullName!,
        address: data.address!,
        phoneNumber: data.phoneNumber!,
        email: data.email!,
        idCardNumber: data.idCardNumber!,
        familyCardNumber: data.familyCardNumber!,
        birthDate: dates.birthDate,
        birthPlace: data.birthPlace!,
        status: data.status || existingCustomer?.status,
        registrationDate:
          dates.registrationDate || existingCustomer?.registrationDate,
        subscriptionStartDate:
          dates.subscriptionDate || existingCustomer?.subscriptionStartDate,
      },
    });

    if (data.password) {
      const hashedPassword = await hash(data.password, 10);
      await prisma.user.update({
        where: { id: data.id! },
        data: { password: hashedPassword },
      });
    }

    if (data.username) {
      if (/\s/.test(data.username)) {
        return { error: "Username tidak boleh mengandung spasi" };
      }

      const usernameError = await checkExistingUsername(data.username, data.id);
      if (usernameError) return { error: usernameError };

      await prisma.user.update({
        where: { id: data.id! },
        data: { username: data.username },
      });
    }

    shouldRedirectToAdmin = currentUserId !== data.id;
  } catch (error) {
    console.error("Error updating customer:", error);
    return { error: "Terjadi kesalahan saat memperbarui customer" };
  }

  revalidatePath("/admin/customers", "layout");
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/admin");

  const redirectPath = shouldRedirectToAdmin ? "/admin/customers" : "/profile";
  redirect(redirectPath);
}

export async function updatePassword(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const data = extractFormData<PasswordUpdateData>(formData, [
      "id",
      "oldPassword",
      "newPassword",
      "confirmPassword",
    ]);

    const requiredFieldError = validateRequiredFields(data, [
      "id",
      "oldPassword",
      "newPassword",
      "confirmPassword",
    ]);
    if (requiredFieldError) return { error: requiredFieldError };

    const passwordMatchError = validatePasswordMatch(
      data.newPassword,
      data.confirmPassword
    );
    if (passwordMatchError)
      return { error: "Password baru dan konfirmasi password harus sama." };

    const existingCustomer = await prisma.user.findFirst({
      where: { id: data.id!, role: "CUSTOMER", isActive: true },
    });

    if (!existingCustomer) {
      return { error: "Pelanggan tidak ditemukan." };
    }

    const passwordMatch = await compare(
      data.oldPassword!,
      existingCustomer.password
    );
    if (!passwordMatch) {
      return { error: "Password lama salah." };
    }

    const hashedNewPassword = await hash(data.newPassword!, 10);
    await prisma.user.update({
      where: { id: data.id! },
      data: { password: hashedNewPassword },
    });
  } catch (error) {
    console.error("Error updating password:", error);
    return { error: "Terjadi kesalahan saat memperbarui password" };
  }

  revalidatePath("/profile");
  redirect("/profile?tab=password");
}

export async function deleteCustomer(id: string) {
  const user = await prisma.user.findUnique({
    where: { id, role: "CUSTOMER", isActive: true },
    include: { customerDetails: true },
  });
  await prisma.$transaction(async (tx) => {
    await tx.customerDetail.update({
      where: { userId: id },
      data: {
        isActive: false,
        deletedAt: new Date(),
        email: `${user?.customerDetails?.email}-deleted-${Date.now()}`,
        phoneNumber: `${
          user?.customerDetails?.phoneNumber
        }-deleted-${Date.now()}`,
        idCardNumber: `${
          user?.customerDetails?.idCardNumber
        }-deleted-${Date.now()}`,
        familyCardNumber: `${
          user?.customerDetails?.familyCardNumber
        }-deleted-${Date.now()}`,
      },
    });
    await tx.user.update({
      where: { id },
      data: {
        isActive: false,
        username: `${user?.username}-deleted-${Date.now()}`,
        deletedAt: new Date(),
      },
    });
  });

  revalidatePath("/admin/customers", "layout");
  revalidatePath("/admin");
  redirect("/admin/customers");
}

export async function handleCustomerStatus(status: CustomerStatus, id: string) {
  const updatedCustomer = await prisma.customerDetail.update({
    where: { userId: id },
    data: { status },
  });

  const notification = getStatusNotification(status);
  await createCustomerNotification(
    updatedCustomer.id,
    "SERVICE_ANNOUNCEMENT",
    notification.title,
    notification.description
  );

  revalidatePath("/admin/customers", "layout");
  revalidatePath("/profile");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

export async function loginUser(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();
  if (!username || !password) {
    return { error: "Username dan password harus diisi" };
  }

  const customer = await prisma.user.findFirst({
    where: {
      username,
      role: "CUSTOMER",
      isActive: true,
    },
  });

  if (!customer) {
    return { error: "Pelanggan tidak ditemukan" };
  }

  const passwordMatch = await compare(password, customer.password);
  if (!passwordMatch) {
    return { error: "Password salah" };
  }

  await Promise.all([
    createSession(customer.id, "CUSTOMER"),
    prisma.user.update({
      where: { id: customer.id },
      data: { lastLogin: new Date() },
    }),
  ]);

  return {
    error: null,
  };
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
