"use server";

import type { PaymentStatus } from "@prisma/client";
import { buildOrderBy, buildSearchConditions } from "./helper";
import { revalidatePath, unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { createCustomerNotification } from "../customer-notification";
import { formatDate, generateReceiptPDF, getMonthName } from "@/lib/utils";
import { redirect } from "next/navigation";
import { receiptDocs } from "@/lib/receipt-docs";
import { imagekit } from "@/lib/imagekit";
import { getAdmin } from "../admin";
import { getSettings } from "../settings";

export const getAllBills = unstable_cache(async function getAllBills(
  take: string,
  skip: string,
  paymentStatus?: PaymentStatus,
  month?: string,
  year?: string,
  customerId?: string,
  sortBy?: string,
  sortOrder?: string,
  search?: string
) {
  const params: BillPaginationParams = {
    paymentStatus,
    month,
    year,
    customerId,
    search,
    skip,
    take,
    sortBy,
    sortOrder,
  };
  const where = buildSearchConditions(params);

  const orderBy = buildOrderBy(sortBy, sortOrder);

  const [bills, totalCount] = await Promise.all([
    prisma.bill.findMany({
      include: {
        customer: {
          select: {
            fullName: true,
            address: true,
            phoneNumber: true,
            idCardNumber: true,
          },
        },
        payment: {
          include: {
            admin: {
              select: {
                adminName: true,
              },
            },
          },
        },
      },
      orderBy,
      take: Number(take),
      skip: Number(skip),
      where,
    }),
    prisma.bill.count({
      where,
    }),
  ]);

  return {
    bills,
    totalCount,
    currentPage: Math.floor(parseInt(skip) / parseInt(take)) + 1,
    totalPages: Math.ceil(totalCount / parseInt(take)),
    itemsPerPage: parseInt(take),
  };
});

export const getBillById = unstable_cache(async function getBillById(
  id: string
) {
  return await prisma.bill.findUnique({
    include: {
      customer: {
        include: {
          user: {
            select: {
              username: true,
              lastLogin: true,
            },
          },
        },
      },
      payment: {
        include: {
          admin: {
            select: {
              adminName: true,
            },
          },
        },
      },
    },
    where: {
      isActive: true,
      id: id,
    },
  });
});

export async function createBill(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const customerId = formData.get("customerId") as string;
    const month = formData.get("month") as string;
    const year = formData.get("year") as string;

    if (!customerId || !month || !year) {
      return {
        error: "Customer, bulan, dan tahun harus diisi.",
      };
    }

    const existingCustomer = await prisma.customerDetail.findUnique({
      where: {
        id: customerId,
        isActive: true,
      },
    });

    if (!existingCustomer) {
      return {
        error: "Pelanggan tidak ditemukan.",
      };
    }

    if (existingCustomer.status !== "ACTIVE") {
      return {
        error: "Pelanggan tidak aktif.",
      };
    }

    if (!existingCustomer.subscriptionStartDate) {
      return {
        error: "Pelanggan belum berlangganan.",
      };
    }

    const existingBill = await prisma.bill.findUnique({
      where: {
        customerId_month_year: {
          customerId: existingCustomer.id,
          month: Number(month),
          year: Number(year),
        },
      },
    });

    if (existingBill) {
      return {
        error:
          "Tagihan untuk pelanggan ini pada bulan dan tahun tersebut sudah ada.",
      };
    }

    const setting = await prisma.companySettings.findFirst();

    if (!setting) {
      return {
        error: "Pengaturan perusahaan tidak ditemukan.",
      };
    }

    const dueDate = new Date(
      Number(year),
      Number(month) - 1,
      setting.billingDate
    );

    const currentDate = new Date();
    if (dueDate < currentDate) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }

    const billCreated = await prisma.bill.create({
      data: {
        customerId: existingCustomer.id,
        month: Number(month),
        year: Number(year),
        dueDate: dueDate,
        paymentStatus: "UNPAID",
        amount: setting.montyhlyRate,
      },
    });

    await createCustomerNotification(
      existingCustomer.id,
      "BILL_DUE",
      "Tagihan Jatuh Tempo",
      `Tagihan bulan ${getMonthName(
        Number(month)
      )} ${year} akan jatuh tempo pada tanggal ${formatDate(
        dueDate.toString()
      )}, harap segera membayar tagihan ini.`,
      `/bills/${billCreated.id}`
    );
  } catch (error) {
    console.error("Error creating bill:", error);
    return {
      error: "Terjadi kesalahan saat membuat tagihan.",
    };
  }
  revalidatePath("/bills", "layout");
  revalidatePath("/admin/bills", "layout");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  redirect("/admin/bills");
}

export async function updateBill(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const id = formData.get("id") as string;
    const customerId = formData.get("customerId") as string;
    const month = formData.get("month") as string;
    const year = formData.get("year") as string;

    if (!id || !customerId || !month || !year) {
      return {
        error: "Semua field harus diisi.",
      };
    }

    const billToUpdate = await prisma.bill.findUnique({
      where: {
        id: id,
        isActive: true,
      },
    });

    if (!billToUpdate) {
      return {
        error: "Tagihan tidak ditemukan.",
      };
    }

    const existingCustomer = await prisma.customerDetail.findUnique({
      where: {
        id: customerId,
        isActive: true,
      },
    });

    if (!existingCustomer) {
      return {
        error: "Pelanggan tidak ditemukan.",
      };
    }

    if (existingCustomer.status !== "ACTIVE") {
      return {
        error: "Pelanggan tidak aktif.",
      };
    }

    if (!existingCustomer.subscriptionStartDate) {
      return {
        error: "Pelanggan belum berlangganan.",
      };
    }

    const existingBill = await prisma.bill.findUnique({
      where: {
        isActive: true,
        customerId_month_year: {
          customerId: existingCustomer.id,
          month: Number(month),
          year: Number(year),
        },
      },
    });

    if (existingBill && existingBill.id !== id) {
      return {
        error:
          "Tagihan untuk pelanggan ini pada bulan dan tahun tersebut sudah ada.",
      };
    }

    const setting = await prisma.companySettings.findFirst();

    if (!setting) {
      return {
        error: "Pengaturan perusahaan tidak ditemukan.",
      };
    }

    const dueDate = new Date(
      Number(year),
      Number(month) - 1,
      setting.billingDate
    );

    const currentDate = new Date();
    if (dueDate < currentDate) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }

    await prisma.bill.update({
      where: {
        id: id,
      },
      data: {
        customerId: customerId,
        month: Number(month),
        year: Number(year),
        dueDate: dueDate,
        amount: setting.montyhlyRate,
      },
    });
  } catch (error) {
    console.error("Error updating bill:", error);
    return {
      error: "Terjadi kesalahan saat memperbarui tagihan.",
    };
  }

  revalidatePath("/bills", "layout");
  revalidatePath("/admin/bills", "layout");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  redirect("/admin/bills");
}

export async function confirmPaymentProof(
  id: string,
  status: "PAID" | "REJECTED",
  notes?: string
) {
  try {
    const bill = await prisma.bill.findUnique({
      where: {
        id: id,
        isActive: true,
      },
      include: {
        customer: {
          select: {
            fullName: true,
            address: true,
            phoneNumber: true,
            idCardNumber: true,
          },
        },
        payment: {
          include: {
            admin: {
              select: {
                adminName: true,
                id: true,
              },
            },
          },
        },
      },
    });

    if (!bill) {
      return {
        error: "Tagihan tidak ditemukan.",
      };
    }

    if (bill.paymentStatus === "PAID") {
      return {
        error: "Tagihan sudah lunas.",
      };
    }

    let receiptUrl = null;
    const setting = await getSettings();
    if (status === "PAID") {
      const doc = receiptDocs(bill, setting!);
      const pdfBuffer = await generateReceiptPDF(doc);

      const uploadResponse = await imagekit.upload({
        file: pdfBuffer,
        fileName: `receipt-${bill.id}-${Date.now()}.pdf`,
        folder: "tv-haikal/receipts/",
        useUniqueFileName: true,
      });

      receiptUrl = uploadResponse.url;
    }

    await prisma.bill.update({
      where: {
        id: id,
      },
      data: {
        paymentStatus: status,
        receipt: receiptUrl,
        verifiedAt: status === "PAID" ? new Date() : null,
        payment: {
          update: {
            notes: notes ? notes : null,
          },
        },
      },
    });

    const admin = await getAdmin();

    if (status === "PAID") {
      const month = bill.month;
      const year = bill.year;
      const reportAdminId = admin?.adminDetails?.id;

      const existingReport = await prisma.transactionReport.findUnique({
        where: {
          month_year: {
            month: month,
            year: year,
          },
        },
      });

      if (existingReport) {
        await prisma.transactionReport.update({
          where: {
            id: existingReport.id,
          },
          data: {
            totalRevenue: existingReport.totalRevenue + bill.amount,
            transactionCount: existingReport.transactionCount + 1,
          },
        });
      } else {
        await prisma.transactionReport.create({
          data: {
            adminId: reportAdminId!,
            month: month,
            year: year,
            totalRevenue: bill.amount,
            transactionCount: 1,
            notes: `Laporan transaksi untuk bulan ${month}/${year}`,
          },
        });
      }

      await createCustomerNotification(
        bill.customerId,
        "PAYMENT_CONFIRMED",
        "Pembayaran Konfirmasi",
        `Pembayaran untuk tagihan bulan ${bill.month}/${bill.year} telah berhasil dikonfirmasi.`,
        `/bills/${bill.id}`
      );
    } else {
      await createCustomerNotification(
        bill.customerId,
        "PAYMENT_CONFIRMED",
        "Pembayaran Ditolak",
        `Pembayaran untuk tagihan bulan ${bill.month}/${bill.year} telah ditolak. Dengan catatan: '${notes}', harap segera melakukan pembayaran kembali.`,
        `/bills/${bill.id}`
      );
    }
  } catch (error) {
    console.error("Error updating bill:", error);
    return {
      error: "Terjadi kesalahan saat memperbarui tagihan.",
    };
  }

  revalidatePath("/bills", "layout");
  revalidatePath("/admin/bills", "layout");
  revalidatePath("/admin");
  revalidatePath("/admin/reports");
  revalidatePath("/dashboard");
}
