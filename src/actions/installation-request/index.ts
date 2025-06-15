"use server";

import type { CustomerDetail, InstallationStatus } from "@prisma/client";
import { revalidatePath, unstable_cache } from "next/cache";
import {
  buildOrderBy,
  buildSearchConditions,
  createBillForCustomer,
  handleInstallationRequest,
  updateInstallationRequest,
  validateConfirmationRequest,
  validateCustomerSession,
  validateCustomerStatus,
  validateExistingRequest,
  validateInstallationAddress,
} from "./helper";
import prisma from "@/lib/prisma";
import { getCustomerById } from "../customer";
import { getSession } from "../session";
import { createAdminNotification } from "../admin-notification";
import { redirect } from "next/navigation";
import { getAdmin } from "../admin";
import { createCustomerNotification } from "../customer-notification";
import { formatDate } from "@/lib/utils";

export const getInstallationRequest = unstable_cache(
  async function getInstallationRequest(
    take: string,
    skip: string,
    status?: InstallationStatus,
    search?: string,
    sortBy?: string,
    sortOrder?: string
  ) {
    const params: RequestPaginationParams = {
      take,
      skip,
      status,
      search,
      sortBy,
      sortOrder,
    };
    const where = buildSearchConditions(params);

    const orderBy = buildOrderBy(sortBy, sortOrder);

    const [requests, totalCount] = await Promise.all([
      prisma.installationRequest.findMany({
        include: {
          admin: true,
          customer: true,
        },
        take: Number(take),
        skip: Number(skip),
        where,
        orderBy,
      }),
      prisma.installationRequest.count({
        where,
      }),
    ]);

    return {
      requests,
      totalCount,
      currentPage: Math.floor(parseInt(skip) / parseInt(take)) + 1,
      totalPages: Math.ceil(totalCount / parseInt(take)),
      itemsPerPage: parseInt(take),
    };
  }
);

export const getCustomerInstallationRequest = unstable_cache(
  async function getCustomerInstallationRequest(customerId: string) {
    const customer = await getCustomerById(customerId);
    return prisma.installationRequest.findFirst({
      where: {
        isActive: true,
        customerId: customer?.customerDetails?.id,
      },
      include: {
        admin: true,
        customer: true,
      },
    });
  }
);

export const getInstallationRequestById = unstable_cache(
  async function getInstallationRequestById(id: string) {
    return prisma.installationRequest.findUnique({
      where: {
        id: id,
        isActive: true,
      },
      include: {
        admin: true,
        customer: true,
      },
    });
  }
);

export async function createInstallationRequest(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await getSession();
  const user = await getCustomerById(session!.userId);
  const installationAddress = formData.get("installationAddress") as string;

  const customerValidation = validateCustomerSession(user!);
  if (!customerValidation.isValid) {
    return { error: customerValidation.error };
  }

  const addressValidation = validateInstallationAddress(installationAddress);
  if (!addressValidation.isValid) {
    return { error: addressValidation.error };
  }

  const isCustomerActive = user?.customerDetails?.status === "ACTIVE";
  if (!isCustomerActive) {
    return {
      error: "Anda harus aktif untuk membuat permintaan instalasi.",
    };
  }

  const existingRequest = await prisma.installationRequest.findUnique({
    where: { customerId: user?.customerDetails?.id, isActive: true },
  });

  const existingRequestValidation = validateExistingRequest(existingRequest);
  if (!existingRequestValidation.isValid) {
    return { error: existingRequestValidation.error };
  }

  try {
    const installationId = await handleInstallationRequest(
      existingRequest,
      installationAddress,
      user?.customerDetails!.id
    );

    await createAdminNotification(
      "INSTALLATION_REQUEST",
      "Permintaan Instalasi",
      `Permintaan instalasi baru telah dibuat oleh ${user?.customerDetails?.fullName}`,
      `/installation-request/${installationId}`
    );
  } catch (error) {
    console.error("Error creating installation request:", error);
    return {
      error:
        "Terjadi kesalahan saat membuat permintaan instalasi. Silakan coba lagi.",
    };
  }

  revalidatePath("/installations");
  revalidatePath("/admin/installation-request");
  redirect("/installations");
}

export async function confirmInstallationRequest(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const id = formData.get("id") as string;
  const status = formData.get("status") as InstallationStatus;
  const notes = formData.get("notes") as string;
  const scheduledDate = formData.get("scheduledDate") as string;
  const isDetail = formData.get("isDetail") as "0" | "1";

  const admin = await getAdmin();

  const existingRequest = await prisma.installationRequest.findUnique({
    where: { id, isActive: true },
  });

  const confirmationValidation = validateConfirmationRequest(
    existingRequest,
    status,
    scheduledDate,
    notes
  );
  if (!confirmationValidation.isValid) {
    return { error: confirmationValidation.error };
  }

  const customer = await prisma.customerDetail.findUnique({
    where: { id: existingRequest!.customerId, isActive: true },
  });

  const customerStatusValidation = validateCustomerStatus(customer);
  if (!customerStatusValidation.isValid) {
    return { error: customerStatusValidation.error };
  }

  if (status === "COMPLETED") {
    const billingResult = await createBillForCustomer({
      customerId: customer!.id,
      customerStatus: customer!.status,
    });

    if (!billingResult.isValid) {
      return { error: billingResult.error };
    }
  }

  try {
    await updateInstallationRequest(
      id,
      status,
      admin?.adminDetails?.id as string,
      existingRequest,
      scheduledDate,
      notes
    );

    await sendCustomerNotification(customer!, status, notes, scheduledDate);
  } catch (error) {
    console.error("Error confirming installation request:", error);
    return {
      error:
        "Terjadi kesalahan saat mengkonfirmasi permintaan instalasi. Silakan coba lagi.",
    };
  }

  revalidatePath("/admin/installation-request", "layout");
  revalidatePath("/installations");

  const redirectPath =
    isDetail === "1"
      ? `/admin/installation-request/${id}`
      : "/admin/installation-request";

  redirect(redirectPath);
}

async function sendCustomerNotification(
  customer: CustomerDetail,
  status: InstallationStatus,
  notes?: string,
  scheduledDate?: string
) {
  if (status === "REJECTED") {
    await createCustomerNotification(
      customer.id,
      "SERVICE_ANNOUNCEMENT",
      "Permintaan Instalasi Ditolak",
      `Permintaan Instalasi Ditolak dengan alasan '${notes}'. Silahkan hubungi admin untuk informasi lebih lanjut.`,
      `/installations`
    );
  } else if (status === "APPROVED") {
    await createCustomerNotification(
      customer.id,
      "SERVICE_ANNOUNCEMENT",
      "Permintaan Instalasi Disetujui",
      `Permintaan Instalasi Disetujui. Proses instalasi akan dimulai pada tanggal ${formatDate(
        scheduledDate!
      )} Jam 10. Silahkan hubungi admin untuk informasi lebih lanjut.`,
      `/installations`
    );
  }
}
