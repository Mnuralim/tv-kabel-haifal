import type { Prisma } from "@prisma/client";

export function buildSearchConditions(
  params: ReportPaginationParams
): Prisma.TransactionReportWhereInput {
  const andConditions: Prisma.TransactionReportWhereInput[] = [];

  if (params.search) {
    andConditions.push({
      OR: [
        {
          admin: {
            adminName: {
              contains: params.search,
              mode: "insensitive",
            },
          },
        },
        {
          admin: {
            user: {
              username: {
                contains: params.search,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  if (params.startPeriod && params.endPeriod) {
    const startPeriodMonth = params.startPeriod.split("-")[0];
    const startPeriodYear = params.startPeriod.split("-")[1];
    const endPeriodMonth = params.endPeriod.split("-")[0];
    const endPeriodYear = params.endPeriod.split("-")[1];

    andConditions.push({
      month: {
        gte: Number(startPeriodMonth),
        lte: Number(endPeriodMonth),
      },
      year: {
        gte: Number(startPeriodYear),
        lte: Number(endPeriodYear),
      },
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
): Prisma.TransactionReportOrderByWithRelationInput {
  if (sortBy === "revenue") {
    return {
      totalRevenue: (sortOrder as Prisma.SortOrder) || "desc",
    };
  } else {
    return {
      [sortBy || "createdAt"]: (sortOrder as Prisma.SortOrder) || "asc",
    };
  }
}
