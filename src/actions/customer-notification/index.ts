"use server";

import prisma from "@/lib/prisma";
import type { CustomerNotificationType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getSession } from "../session";
import { getCustomerById } from "../customer";

export async function createCustomerNotification(
  customerId: string,
  type: CustomerNotificationType,
  title: string,
  message: string,
  redirectTo?: string
) {
  await prisma.customerNotification.create({
    data: {
      customerId,
      message,
      title,
      type,
      redirectTo: redirectTo ? redirectTo : null,
    },
  });

  revalidatePath("/admin/notifications");
}

export async function markAsRead(id: string) {
  await prisma.customerNotification.update({
    where: {
      id: id,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
  revalidatePath("/notifications");
}

export async function markAllAsRead() {
  await prisma.customerNotification.updateMany({
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

export async function getAllCustomerNotifications(
  limit: string,
  search?: string,
  type?: CustomerNotificationType,
  customerId?: string,
  hideRead?: "true"
) {
  const andConditions: Prisma.CustomerNotificationWhereInput[] = [];

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

  if (customerId) {
    andConditions.push({
      customerId: customerId,
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

  const where: Prisma.CustomerNotificationWhereInput = {
    AND: andConditions,
    isActive: true,
  };

  return prisma.customerNotification.findMany({
    where,
    take: Number(limit),
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCustomerNotificationCount() {
  const session = await getSession();
  if (!session) {
    return 0;
  }
  const customer = await getCustomerById(session.userId);
  if (!customer) {
    return 0;
  }
  return prisma.customerNotification.count({
    where: {
      isRead: false,
      customerId: customer.customerDetails?.id,
    },
  });
}
