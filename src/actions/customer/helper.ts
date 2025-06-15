import prisma from "@/lib/prisma";
import type { CustomerStatus, Prisma } from "@prisma/client";

export function extractFormData<T extends Record<string, string>>(
  formData: FormData,
  fields: (keyof T)[]
): Partial<T> {
  const result: Partial<T> = {};

  fields.forEach((field) => {
    const value = formData.get(field as string);
    if (value !== null) {
      result[field] = value as T[keyof T];
    }
  });

  return result;
}

export function validateRequiredFields<T extends Record<string, string>>(
  data: Partial<T>,
  requiredFields: (keyof T)[]
): string | null {
  for (const field of requiredFields) {
    if (!data[field]) {
      return "Semua field harus diisi";
    }
  }
  return null;
}

export function validatePassword(
  password?: string,
  confirmPassword?: string
): string | null {
  if (password && confirmPassword) {
    if (password !== confirmPassword) {
      return "Password dan konfirmasi password tidak cocok";
    }
  }
  return null;
}

export function validatePasswordMatch(
  password?: string,
  confirmPassword?: string
): string | null {
  if (password && confirmPassword && password !== confirmPassword) {
    return "Password dan konfirmasi password tidak cocok";
  }
  return null;
}

export function parseAndValidateDates(data: Partial<CustomerFormData>) {
  const parseDate = (dateString?: string, fieldName?: string): Date | null => {
    if (!dateString) return null;

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error(`Format ${fieldName || "tanggal"} tidak valid`);
    }
    return date;
  };

  return {
    birthDate: parseDate(data.birthDate, "tanggal lahir")!,
    registrationDate: parseDate(data.registrationDate, "tanggal registrasi"),
    subscriptionDate: parseDate(data.subscriptionDate, "tanggal berlangganan"),
  };
}

export async function checkExistingUsername(
  username: string,
  excludeId?: string
): Promise<string | null> {
  const existing = await prisma.user.findFirst({
    where: {
      username,
      isActive: true,
      ...(excludeId && { id: { not: excludeId } }),
    },
  });

  return existing ? "Username sudah digunakan" : null;
}

export async function checkExistingCustomerData(
  data: Partial<CustomerFormData>,
  excludeUserId?: string
): Promise<string | null> {
  const existing = await prisma.customerDetail.findFirst({
    where: {
      isActive: true,
      OR: [
        { phoneNumber: data.phoneNumber },
        { email: data.email },
        { idCardNumber: data.idCardNumber },
        { familyCardNumber: data.familyCardNumber },
      ],
      ...(excludeUserId && { userId: { not: excludeUserId } }),
    },
    include: { user: true },
  });

  if (!existing) return null;

  const conflicts = [
    {
      field: existing.phoneNumber,
      value: data.phoneNumber,
      message: "Nomor telepon sudah terdaftar",
    },
    {
      field: existing.email,
      value: data.email,
      message: "Email sudah terdaftar",
    },
    {
      field: existing.idCardNumber,
      value: data.idCardNumber,
      message: "Nomor KTP sudah terdaftar",
    },
    {
      field: existing.familyCardNumber,
      value: data.familyCardNumber,
      message: "Nomor Kartu Keluarga sudah terdaftar",
    },
  ];

  for (const conflict of conflicts) {
    if (conflict.field === conflict.value) {
      return conflict.message;
    }
  }

  return null;
}

export function buildSearchConditions(
  params: CustomerPaginationParams
): Prisma.UserWhereInput {
  const andConditions: Prisma.UserWhereInput[] = [];

  if (params.status) {
    andConditions.push({
      customerDetails: { status: params.status },
    });
  }

  if (params.search) {
    andConditions.push({
      OR: [
        { username: { contains: params.search, mode: "insensitive" } },
        {
          customerDetails: {
            fullName: { contains: params.search, mode: "insensitive" },
          },
        },
        {
          customerDetails: {
            email: { contains: params.search, mode: "insensitive" },
          },
        },
      ],
    });
  }

  return {
    role: "CUSTOMER",
    isActive: true,
    ...(andConditions.length > 0 && { AND: andConditions }),
  };
}

export function buildOrderBy(
  sortBy?: string,
  sortOrder?: string
): Prisma.UserOrderByWithRelationInput {
  const order = (sortOrder as Prisma.SortOrder) || "desc";

  if (sortBy === "fullName") {
    return { customerDetails: { fullName: order } };
  }

  return { [sortBy || "createdAt"]: order };
}

export function getStatusNotification(status: CustomerStatus) {
  const notifications = {
    ACTIVE: {
      title: "Status Pelanggan",
      description:
        "Selamat status pelanggan anda berhasil diaktifkan, kini anda dapat menggunakan fitur-fitur Pelanggan.",
    },
    SUSPENDED: {
      title: "Status Pelanggan",
      description:
        "Mohon maaf status pelanggan anda telah ditangguhkan, kini anda tidak dapat menggunakan fitur-fitur Pelanggan. Silahkan hubungi admin untuk informasi lebih lanjut.",
    },
    INACTIVE: {
      title: "Status Pelanggan",
      description: "Status pelanggan anda saat ini tidak aktif.",
    },
  };

  return notifications[status] || notifications.INACTIVE;
}
