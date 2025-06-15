"use server";

import { imagekit } from "@/lib/imagekit";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminNotification } from "../admin-notification";

export async function createPaymentProof(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const file = formData.get("paymentProof") as File;
    const billId = formData.get("billId") as string;
    const paymentDate = formData.get("paymentDate") as string;

    if (!file || !billId || !paymentDate) {
      return {
        error: "Semua field harus diisi.",
      };
    }

    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        error: "Ukuran file terlalu besar. Maksimal 3MB.",
      };
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        error:
          "Format file tidak didukung. Hanya JPG, PNG, dan PDF yang diperbolehkan.",
      };
    }

    const bill = await prisma.bill.findFirst({
      where: {
        id: billId,
        isActive: true,
      },
      include: {
        payment: true,
      },
    });

    if (!bill) {
      return {
        error: "Tagihan tidak ditemukan.",
      };
    }

    if (bill.payment && bill.paymentStatus !== "REJECTED") {
      return {
        error: "Tagihan ini sudah diajukan.",
      };
    }

    if (bill.paymentStatus === "IN_REVIEW") {
      return {
        error: "Tagihan ini sedang dalam peninjauan.",
      };
    }

    if (bill.paymentStatus === "PAID") {
      return {
        error: "Tagihan ini sudah dibayar.",
      };
    }

    let photoUrl = null;

    if (file && file.size > 0) {
      const buffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(buffer);
      const uploadFile = await imagekit.upload({
        file: fileBuffer,
        fileName: `payment-proof-${billId}-${Date.now()}`,
        useUniqueFileName: true,
        folder: "tv-haikal/payment-proof",
      });
      photoUrl = uploadFile.url;
    }

    if (bill.paymentStatus === "REJECTED") {
      await prisma.payment.update({
        where: {
          billId: bill.id,
        },
        data: {
          paymentProof: photoUrl,
          paymentDate: new Date(paymentDate),
          uploadDate: new Date(),
        },
      });
    } else {
      await prisma.payment.create({
        data: {
          billId: bill.id,
          paymentDate: new Date(paymentDate),
          paymentProof: photoUrl,
          uploadDate: new Date(),
        },
      });
    }

    await Promise.all([
      prisma.bill.update({
        where: {
          id: bill.id,
        },
        data: {
          paymentStatus: "IN_REVIEW",
        },
      }),
      await createAdminNotification(
        "NEW_PAYMENT",
        "Ada pembayaran baru",
        `Pembayaran untuk tagihan dengan ID ${bill.id} telah diajukan.`,
        `/bills/${bill.id}`
      ),
    ]);
  } catch (error) {
    console.error("Error creating payment proof:", error);
    return {
      error: "Gagal membuat bukti pembayaran. Silakan coba lagi.",
    };
  }

  revalidatePath("/bills", "layout");
  revalidatePath("/admin/bills", "layout");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  redirect("/bills");
}
