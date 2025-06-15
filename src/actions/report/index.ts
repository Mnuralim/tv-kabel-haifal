"use server";

import { unstable_cache } from "next/cache";
import { buildOrderBy, buildSearchConditions } from "./helper";
import prisma from "@/lib/prisma";

export const getAllReports = unstable_cache(async function getAllReports(
  take: string,
  skip: string,
  search?: string,
  startPeriod?: string,
  endPeriod?: string,
  sortBy?: string,
  sortOrder?: string
) {
  const params: ReportPaginationParams = {
    skip,
    take,
    endPeriod,
    search,
    sortBy,
    sortOrder,
    startPeriod,
  };

  const where = buildSearchConditions(params);
  const orderBy = buildOrderBy(sortBy, sortOrder);

  const [reports, totalCount] = await Promise.all([
    prisma.transactionReport.findMany({
      where,
      orderBy,
      take: parseInt(take),
      skip: parseInt(skip),
      include: {
        admin: true,
      },
    }),
    prisma.transactionReport.count(),
  ]);

  return {
    reports,
    totalCount,
    currentPage: Math.floor(parseInt(skip) / parseInt(take)) + 1,
    totalPages: Math.ceil(totalCount / parseInt(take)),
    itemsPerPage: parseInt(take),
  };
});
