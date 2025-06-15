"use server";

import prisma from "@/lib/prisma";
import type { AdminNotificationType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createAdminNotification(
  type: AdminNotificationType,
  title: string,
  message: string,
  redirectTo?: string
) {
  await prisma.adminNotification.create({
    data: {
      message,
      title,
      type,
      redirectTo: redirectTo ? redirectTo : null,
    },
  });

  revalidatePath("/admin/notifications");
}

export async function markAsRead(id: string) {
  await prisma.adminNotification.update({
    where: {
      id: id,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
  revalidatePath("/admin/notifications");
}

export async function markAllAsRead() {
  await prisma.adminNotification.updateMany({
    where: {
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
  revalidatePath("/admin/notifications");
}

export async function getAllAdminNotifications(
  limit: string,
  search?: string,
  type?: AdminNotificationType,
  hideRead?: "true"
) {
  const andConditions: Prisma.AdminNotificationWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          message: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (type) {
    andConditions.push({
      type: type,
    });
  }

  if (hideRead === "true") {
    andConditions.push({
      isRead: false,
    });
  }

  const where: Prisma.AdminNotificationWhereInput = {
    AND: andConditions,
    isActive: true,
  };

  return prisma.adminNotification.findMany({
    where,
    take: Number(limit),
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAdminNotificationCount() {
  return prisma.adminNotification.count({
    where: {
      isRead: false,
      isActive: true,
    },
  });
}
