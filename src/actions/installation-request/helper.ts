import prisma from "@/lib/prisma";
import type {
  CustomerDetail,
  InstallationRequest,
  InstallationStatus,
  Prisma,
} from "@prisma/client";

export function buildSearchConditions(
  params: RequestPaginationParams
): Prisma.InstallationRequestWhereInput {
  const andConditions: Prisma.InstallationRequestWhereInput[] = [];

  if (params.status) {
    andConditions.push({
      status: params.status,
    });
  }

  if (params.search) {
    andConditions.push({
      OR: [
        {
          customer: {
            user: {
              username: {
                contains: params.search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          customer: {
            fullName: {
              contains: params.search,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  return {
    isActive: true,
    ...(andConditions.length > 0 && { AND: andConditions }),
  };
}

export function buildOrderBy(
  sortBy?: string,
  sortOrder?: string
): Prisma.InstallationRequestOrderByWithRelationInput {
  if (sortBy === "fullName") {
    return {
      customer: {
        fullName: (sortOrder as Prisma.SortOrder) || "asc",
      },
    };
  } else {
    return {
      [sortBy || "createdAt"]: (sortOrder as Prisma.SortOrder) || "desc",
    };
  }
}

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export interface BillingParams {
  customerId: string;
  customerStatus: string;
}

export function validateCustomerSession(
  customer: Prisma.UserGetPayload<{
    include: {
      customerDetails: {
        include: {
          bills: true;
          complaints: true;
        };
      };
    };
  }>
): ValidationResult {
  if (!customer?.customerDetails?.id) {
    return {
      isValid: false,
      error: "Anda harus login untuk membuat permintaan instalasi.",
    };
  }
  return { isValid: true, error: null };
}

export function validateInstallationAddress(address: string): ValidationResult {
  if (!address) {
    return {
      isValid: false,
      error: "Alamat pemasangan tidak boleh kosong.",
    };
  }
  return { isValid: true, error: null };
}

export function validateExistingRequest(
  existingRequest: InstallationRequest | null
): ValidationResult {
  if (!existingRequest) {
    return { isValid: true, error: null };
  }

  const activeStatuses = ["PENDING", "APPROVED", "COMPLETED"];
  if (!activeStatuses.includes(existingRequest.status)) {
    return { isValid: true, error: null };
  }

  const errorMessages = {
    PENDING:
      "Anda masih memiliki permintaan instalasi yang sedang menunggu persetujuan.",
    APPROVED:
      "Anda memiliki permintaan instalasi yang sudah disetujui dan sedang dalam proses.",
    COMPLETED:
      "Anda sudah memiliki instalasi yang telah selesai. Hubungi customer service jika memerlukan instalasi tambahan.",
  };

  return {
    isValid: false,
    error: errorMessages[existingRequest.status as keyof typeof errorMessages],
  };
}

export function validateConfirmationRequest(
  existingRequest: InstallationRequest | null,
  status: InstallationStatus,
  scheduledDate?: string,
  notes?: string
): ValidationResult {
  if (!existingRequest) {
    return {
      isValid: false,
      error: "Permintaan instalasi tidak ditemukan.",
    };
  }

  if (existingRequest.status === "COMPLETED") {
    return {
      isValid: false,
      error: "Permintaan instalasi sudah selesai.",
    };
  }

  if (status === "APPROVED") {
    if (!scheduledDate) {
      return {
        isValid: false,
        error: "Tanggal pemasangan harus diisi.",
      };
    }

    if (new Date(scheduledDate) < new Date()) {
      return {
        isValid: false,
        error: "Tanggal pemasangan tidak boleh sebelum hari ini.",
      };
    }
  }

  if (status === "REJECTED" && !notes) {
    return {
      isValid: false,
      error: "Catatan harus diisi.",
    };
  }

  return { isValid: true, error: null };
}

export function validateCustomerStatus(
  customer: CustomerDetail | null
): ValidationResult {
  if (!customer) {
    return {
      isValid: false,
      error: "Pelanggan tidak ditemukan.",
    };
  }

  if (customer.status === "INACTIVE") {
    return {
      isValid: false,
      error: "Pelanggan tidak aktif.",
    };
  }

  if (customer.status === "SUSPENDED") {
    return {
      isValid: false,
      error: "Pelanggan telah ditangguhkan.",
    };
  }

  return { isValid: true, error: null };
}

export async function handleInstallationRequest(
  existingRequest: InstallationRequest | null,
  installationAddress: string,
  customerId: string
): Promise<string> {
  if (existingRequest && existingRequest.status === "REJECTED") {
    await prisma.installationRequest.update({
      where: { id: existingRequest.id },
      data: {
        installationAddress,
        status: "PENDING",
        createdAt: new Date(),
        scheduledDate: null,
        completionDate: null,
        notes: null,
        adminId: null,
      },
    });
    return existingRequest.id;
  } else {
    const newRequest = await prisma.installationRequest.create({
      data: {
        installationAddress,
        customerId,
        status: "PENDING",
      },
    });
    return newRequest.id;
  }
}

export function calculateBillingPeriod(): {
  billMonth: number;
  billYear: number;
} {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  let billMonth = currentMonth;
  let billYear = currentYear;

  if (currentDay > 15) {
    if (currentMonth === 12) {
      billMonth = 1;
      billYear = currentYear + 1;
    } else {
      billMonth = currentMonth + 1;
    }
  }

  return { billMonth, billYear };
}

export async function createBillForCustomer({
  customerId,
}: BillingParams): Promise<ValidationResult> {
  try {
    const { billMonth, billYear } = calculateBillingPeriod();

    const existingBill = await prisma.bill.findUnique({
      where: {
        isActive: true,
        customerId_month_year: {
          customerId,
          month: billMonth,
          year: billYear,
        },
      },
    });

    if (existingBill) {
      return { isValid: true, error: null };
    }

    const setting = await prisma.companySettings.findFirst();
    if (!setting) {
      return {
        isValid: false,
        error:
          "Pengaturan perusahaan tidak ditemukan. Tidak dapat membuat tagihan.",
      };
    }

    const dueDate = new Date(billYear, billMonth - 1, setting.billingDate);
    const currentDate = new Date();
    if (dueDate < currentDate) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }

    await prisma.bill.create({
      data: {
        customerId,
        month: billMonth,
        year: billYear,
        dueDate,
        paymentStatus: "UNPAID",
        amount: setting.montyhlyRate,
      },
    });

    await prisma.customerDetail.update({
      where: { id: customerId },
      data: {
        status: "ACTIVE",
        subscriptionStartDate: new Date(),
      },
    });

    return { isValid: true, error: null };
  } catch (error) {
    console.error("Error creating bill after installation completion:", error);
    return {
      isValid: false,
      error:
        "Instalasi berhasil diselesaikan, tetapi terjadi kesalahan saat membuat tagihan otomatis.",
    };
  }
}

export async function updateInstallationRequest(
  id: string,
  status: InstallationStatus,
  adminId: string,
  existingRequest: InstallationRequest | null,
  scheduledDate?: string,
  notes?: string
) {
  return await prisma.installationRequest.update({
    where: { id },
    data: {
      adminId,
      scheduledDate:
        status === "APPROVED"
          ? new Date(scheduledDate!)
          : status === "COMPLETED"
          ? existingRequest?.scheduledDate
          : null,
      status,
      completionDate: status === "COMPLETED" ? new Date() : null,
      notes: status === "REJECTED" ? notes : null,
      approvedDate:
        status === "APPROVED"
          ? new Date()
          : status === "COMPLETED"
          ? existingRequest?.approvedDate
          : null,
      rejectedDate: status === "REJECTED" ? new Date() : null,
    },
  });
}
