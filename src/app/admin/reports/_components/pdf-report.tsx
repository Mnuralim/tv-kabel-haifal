import React, { forwardRef } from "react";
import { formatDate, getMonthName } from "@/lib/utils";
import { type Prisma } from "@prisma/client";

type SalesReportWithAdminOrders = Prisma.TransactionReportGetPayload<{
  include: {
    admin: true;
  };
}>;

interface Props {
  reports: SalesReportWithAdminOrders[];
}

export const PrintableReport = forwardRef<HTMLDivElement, Props>(
  ({ reports }, ref) => {
    return (
      <div ref={ref} style={{ padding: 20, fontFamily: "Arial" }}>
        <h1>Laporan Penjualan</h1>
        <p>Tanggal Cetak: {formatDate(new Date().toISOString())}</p>

        <table
          style={{ borderCollapse: "collapse", width: "100%", marginTop: 20 }}
        >
          <thead>
            <tr>
              <th style={th}>No</th>
              <th style={th}>Periode</th>
              <th style={th}>Total Transaksi</th>
              <th style={th}>Pendapatan</th>
              <th style={th}>Kasir</th>
              <th style={th}>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={report.id}>
                <td style={td}>{index + 1}</td>
                <td style={td}>
                  {getMonthName(report.month)} {report.year}
                </td>
                <td style={td}>{report.transactionCount}</td>
                <td style={td}>{report.totalRevenue}</td>
                <td style={td}>{report.admin.adminName}</td>
                <td style={td}>{report.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

PrintableReport.displayName = "PrintableReport";

const th: React.CSSProperties = {
  border: "1px solid black",
  padding: 8,
  backgroundColor: "#f3f4f6",
};

const td: React.CSSProperties = {
  border: "1px solid black",
  padding: 8,
};
