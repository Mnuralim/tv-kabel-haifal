import type { Prisma } from "@prisma/client";

export function buildSearchConditions(
  params: BillPaginationParams
): Prisma.BillWhereInput {
  const andConditions: Prisma.BillWhereInput[] = [];

  if (params.paymentStatus) {
    andConditions.push({
      paymentStatus: params.paymentStatus,
    });
  }

  if (params.month) {
    andConditions.push({
      month: Number(params.month),
    });
  }

  if (params.year) {
    andConditions.push({
      year: Number(params.year),
    });
  }

  if (params.customerId) {
    andConditions.push({
      customerId: params.customerId,
    });
  }

  if (params.search) {
    andConditions.push({
      customer: {
        OR: [
          {
            fullName: {
              contains: params.search,
              mode: "insensitive",
            },
          },
          {
            user: {
              username: {
                contains: params.search,
                mode: "insensitive",
              },
            },
          },
        ],
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
): Prisma.BillOrderByWithRelationInput {
  if (sortBy === "fullName") {
    return {
      customer: {
        fullName: (sortOrder as Prisma.SortOrder) || "asc",
      },
    };
  } else if (sortBy === "amount") {
    return {
      amount: (sortOrder as Prisma.SortOrder) || "asc",
    };
  } else {
    return {
      [sortBy || "createdAt"]: (sortOrder as Prisma.SortOrder) || "desc",
    };
  }
}
