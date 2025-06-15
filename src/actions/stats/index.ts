"use server";
import prisma from "@/lib/prisma";
import {
  endOfDay,
  startOfDay,
  subMonths,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { unstable_cache } from "next/cache";

export const getCableBillingStats = unstable_cache(
  async function getCableBillingStats() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const previousMonthDate = subMonths(today, 1);
    const previousMonth = previousMonthDate.getMonth() + 1;
    const previousMonthYear = previousMonthDate.getFullYear();

    const totalRevenueReport = await prisma.bill.aggregate({
      where: {
        paymentStatus: "PAID",
        isActive: true,
        verifiedAt: { not: null },
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });

    const currentMonthBills = await prisma.bill.count({
      where: {
        month: currentMonth,
        year: currentYear,
        isActive: true,
      },
    });

    const paidBillsThisMonth = await prisma.bill.count({
      where: {
        month: currentMonth,
        year: currentYear,
        paymentStatus: "PAID",
        isActive: true,
      },
    });

    const overdueBills = await prisma.bill.count({
      where: {
        paymentStatus: "UNPAID",
        isActive: true,
        dueDate: {
          lt: today,
        },
      },
    });

    const billsInReview = await prisma.bill.count({
      where: {
        paymentStatus: "IN_REVIEW",
        isActive: true,
      },
    });

    const activeCustomers = await prisma.customerDetail.count({
      where: {
        status: "ACTIVE",
        isActive: true,
      },
    });

    const todayPayments = await prisma.payment.count({
      where: {
        isActive: true,
        paymentDate: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
        bill: {
          paymentStatus: "PAID",
        },
      },
    });

    const currentMonthRevenue = await prisma.bill.aggregate({
      where: {
        isActive: true,
        month: currentMonth,
        year: currentYear,
        paymentStatus: "PAID",
      },
      _sum: {
        amount: true,
      },
    });

    const previousMonthRevenue = await prisma.bill.aggregate({
      where: {
        isActive: true,
        month: previousMonth,
        year: previousMonthYear,
        paymentStatus: "PAID",
      },
      _sum: {
        amount: true,
      },
    });

    const currentRevenue = currentMonthRevenue._sum.amount || 0;
    const previousRevenue = previousMonthRevenue._sum.amount || 0;

    const revenueChangePercentage =
      previousRevenue > 0
        ? (
            ((currentRevenue - previousRevenue) / previousRevenue) *
            100
          ).toFixed(1)
        : currentRevenue > 0
        ? "100.0"
        : "0.0";

    const collectionRate =
      currentMonthBills > 0
        ? ((paidBillsThisMonth / currentMonthBills) * 100).toFixed(1)
        : "0.0";

    return {
      totalRevenue: totalRevenueReport._sum.amount || 0,
      revenueChangePercentage,
      totalBills: currentMonthBills,
      paidBills: paidBillsThisMonth,
      collectionRate,
      overdueBills,
      billsInReview,
      activeCustomers,
      todayPaymentCount: todayPayments || 0,
    };
  }
);

export const getMonthlyPayments = unstable_cache(
  async function getMonthlyPayments() {
    const today = new Date();
    const monthlyData = [];

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];

    for (let i = 5; i >= 0; i--) {
      const date = subMonths(today, i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const monthNumber = date.getMonth() + 1;
      const year = date.getFullYear();

      const monthlyPayments = await prisma.payment.count({
        where: {
          isActive: true,
          paymentDate: {
            gte: monthStart,
            lte: monthEnd,
          },
          bill: {
            paymentStatus: "PAID",
          },
        },
      });

      const monthlyRevenue = await prisma.bill.aggregate({
        where: {
          isActive: true,
          month: monthNumber,
          year: year,
          paymentStatus: "PAID",
        },
        _sum: {
          amount: true,
        },
      });

      monthlyData.push({
        month: monthNames[date.getMonth()],
        payments: monthlyPayments || 0,
        revenue: monthlyRevenue._sum.amount || 0,
      });
    }

    return monthlyData;
  }
);

export const getMonthlyBillingStats = unstable_cache(
  async function getMonthlyBillingStats() {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const billingStatus = await prisma.bill.groupBy({
      by: ["paymentStatus"],
      where: {
        isActive: true,
        month: currentMonth,
        year: currentYear,
      },
      _count: {
        paymentStatus: true,
      },
    });

    const openComplaints = await prisma.complaint.count({
      where: {
        isActive: true,
        complaintStatus: {
          in: ["OPEN", "IN_PROGRESS"],
        },
      },
    });

    const pendingInstallations = await prisma.installationRequest.count({
      where: {
        isActive: true,
        status: "PENDING",
      },
    });

    return {
      billingStatus: billingStatus.map((status) => ({
        status: status.paymentStatus,
        count: status._count.paymentStatus,
      })),
      openComplaints,
      pendingInstallations,
    };
  }
);
