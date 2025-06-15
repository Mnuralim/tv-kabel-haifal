import type { ComplaintStatus, Prisma } from "@prisma/client";

export function buildSearchConditions(
  params: ComplaintPaginationParams
): Prisma.ComplaintWhereInput {
  const andConditions: Prisma.ComplaintWhereInput[] = [];

  if (params.status) {
    andConditions.push({
      complaintStatus: params.status as ComplaintStatus,
    });
  }

  if (params.category) {
    andConditions.push({
      category: params.category,
    });
  }

  if (params.customerId) {
    andConditions.push({
      customer: {
        id: params.customerId,
      },
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
        {
          title: {
            contains: params.search,
            mode: "insensitive",
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
): Prisma.ComplaintOrderByWithRelationInput {
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
