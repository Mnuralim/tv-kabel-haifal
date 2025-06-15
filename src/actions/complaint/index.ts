"use server";

import { revalidatePath, unstable_cache } from "next/cache";
import { buildOrderBy, buildSearchConditions } from "./helper";
import type { ComplaintCategory, ComplaintStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { imagekit } from "@/lib/imagekit";
import { createAdminNotification } from "../admin-notification";
import { redirect } from "next/navigation";
import { createCustomerNotification } from "../customer-notification";

export const getAllComplaints = unstable_cache(async function getAllComplaints(
  take: string,
  skip: string,
  search?: string,
  sortBy?: string,
  sortOrder?: string,
  status?: "OPEN | IN_PROGRESS | RESOLVED | CLOSED",
  customerId?: string,
  category?: ComplaintCategory
) {
  const params: ComplaintPaginationParams = {
    skip,
    take,
    category,
    customerId,
    search,
    sortBy,
    sortOrder,
    status,
  };

  const where = buildSearchConditions(params);
  const orderBy = buildOrderBy(sortBy, sortOrder);

  const [complaints, totalCount] = await Promise.all([
    prisma.complaint.findMany({
      where,
      orderBy,
      include: {
        customer: true,
      },
      take: Number(take),
      skip: Number(skip),
    }),
    prisma.complaint.count({
      where,
    }),
  ]);

  return {
    complaints,
    totalCount,
    currentPage: Math.floor(parseInt(skip) / parseInt(take)) + 1,
    totalPages: Math.ceil(totalCount / parseInt(take)),
    itemsPerPage: parseInt(take),
  };
});

export const getComplaintById = unstable_cache(async function getComplaintById(
  id: string
) {
  return prisma.complaint.findUnique({
    where: { id, isActive: true },
    include: {
      customer: true,
    },
  });
});

export async function createComplaint(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const customerId = formData.get("customerId") as string;
    const category = formData.get("category") as ComplaintCategory;
    const image = formData.get("image") as File;

    if (!title || !description || !customerId || !category) {
      return {
        error: "Judul, Deskripsi, dan Kategori harus diisi.",
      };
    }

    let imageUrl = null;

    if (image && image.size > 0) {
      const buffer = await image.arrayBuffer();
      const fileBuffer = Buffer.from(buffer);
      const uploadFile = await imagekit.upload({
        file: fileBuffer,
        fileName: `complaint-${customerId}-${Date.now()}`,
        useUniqueFileName: true,
        folder: "tv-haikal/complaint",
      });

      imageUrl = uploadFile.url;
    }

    const complaintCreated = await prisma.complaint.create({
      data: {
        category,
        title,
        description,
        customerId,
        image: imageUrl,
      },
    });
    await createAdminNotification(
      "NEW_COMPLAINT",
      title,
      description,
      `/complaints/${complaintCreated.id}`
    );
  } catch (error) {
    console.error(error);
    return {
      error: "Terjadi kesalahan saat membuat laporan.",
    };
  }
  revalidatePath("/complaints");
  revalidatePath("/admin/complaints", "layout");
  redirect("/complaints");
}

export async function confirmComplaint(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const status = formData.get("status") as ComplaintStatus;
  const id = formData.get("id") as string;
  const adminResponse = formData.get("adminResponse") as string;
  const detail = formData.get("detail") as "0" | "1";
  try {
    const existingComplaint = await prisma.complaint.findUnique({
      where: {
        id: id,
        isActive: true,
      },
    });

    if (!existingComplaint) {
      return {
        error: "Keluhan tidak ditemukan.",
      };
    }

    let complaintStatus = existingComplaint.complaintStatus;
    const complaintNotification: { title: string; message: string } = {
      title: "",
      message: "",
    };

    if (status === "IN_PROGRESS") {
      complaintStatus = "IN_PROGRESS";
      complaintNotification.title = "Laporan sedang diproses";
      complaintNotification.message = `Laporan dengan keluhan '${existingComplaint.title}' sedang diproses oleh admin. Mohon menunggu informasi selanjutnya.`;
    }

    if (status === "RESOLVED") {
      complaintStatus = "RESOLVED";
      complaintNotification.title = "Laporan telah diselesaikan";
      complaintNotification.message = `Laporan dengan keluhan '${existingComplaint.title}' telah diselesaikan oleh admin. `;
    }

    if (status === "CLOSED") {
      complaintStatus = "CLOSED";
      complaintNotification.title = "Laporan telah ditutup";
      complaintNotification.message = `Laporan dengan keluhan '${existingComplaint.title}' telah ditutup oleh admin. `;
    }

    const complainCreated = await prisma.complaint.update({
      where: {
        id: id,
      },
      data: {
        complaintStatus,
        adminResponse: adminResponse ? adminResponse : null,
        completionDate: status === "CLOSED" ? new Date() : null,
      },
    });

    await createCustomerNotification(
      complainCreated.customerId,
      "COMPLAINT_UPDATE",
      complaintNotification.title,
      complaintNotification.message,
      `/complaints`
    );
  } catch (error) {
    console.error(error);
    return {
      error: "Terjadi kesalahan saat memverifikasi laporan.",
    };
  }
  revalidatePath("/complaints");
  revalidatePath("/admin/complaints", "layout");
  if (detail === "0") {
    redirect("/admin/complaints");
  } else {
    return {
      error: null,
    };
  }
}
