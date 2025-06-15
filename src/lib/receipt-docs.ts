import type { BillInfo } from "@/app/admin/bills/_components/bill-list";
import { formatCurrency, getMonthName } from "./utils";
import jsPDF from "jspdf";
import type { CompanySettings } from "@prisma/client";

export const receiptDocs = (billData: BillInfo, setting?: CompanySettings) => {
  const doc = new jsPDF();

  doc.setFont("helvetica");

  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(setting?.name || "TV Kabel Haikal", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    setting?.address || "Jl. Mawar No. 123, Kendari, Sulawesi Tenggara",
    105,
    28,
    {
      align: "center",
    }
  );
  doc.text(
    `Telp: ${setting?.phoneNumber} | Email: ${setting?.email}`,
    105,
    34,
    {
      align: "center",
    }
  );

  doc.setTextColor(30, 64, 175);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");

  doc.text(`No. Kwitansi: ${billData.id}`, 105, 50, { align: "center" });

  doc.setTextColor(0, 0, 0);

  let yPos = 70;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Informasi Pelanggan", 20, yPos);

  yPos += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const customerInfo = [
    ["Nama Lengkap:", billData.customer.fullName],
    ["Alamat:", billData.customer.address],
    ["No. Telepon:", billData.customer.phoneNumber],
    ["No. KTP:", billData.customer.idCardNumber],
  ];

  customerInfo.forEach(([label, value]) => {
    doc.text(label, 20, yPos);
    doc.text(value, 60, yPos);
    yPos += 6;
  });

  yPos = 70;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Informasi Pembayaran", 120, yPos);

  yPos += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const paymentInfo = [
    ["Tanggal Bayar:", new Date().toLocaleDateString("id-ID")],
    ["Periode:", `${getMonthName(billData.month)} ${billData.year}`],
    ["Jatuh Tempo:", new Date(billData.dueDate).toLocaleDateString("id-ID")],
    ["Status:", "LUNAS"],
  ];

  paymentInfo.forEach(([label, value]) => {
    doc.text(label, 120, yPos);
    doc.text(value, 160, yPos);
    yPos += 6;
  });

  yPos = 120;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Rincian Tagihan", 20, yPos);

  yPos += 15;
  doc.setFillColor(226, 232, 240);
  doc.rect(20, yPos - 5, 170, 10, "F");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Deskripsi", 25, yPos);
  doc.text("Jumlah", 160, yPos);

  yPos += 15;
  doc.setFont("helvetica", "normal");

  doc.text(
    `Tagihan TV Kabel - ${getMonthName(billData.month)} ${billData.year}`,
    25,
    yPos
  );
  doc.text(formatCurrency(billData.amount), 160, yPos);
  yPos += 10;

  yPos += 5;
  doc.setFillColor(219, 234, 254);
  doc.rect(20, yPos - 5, 170, 12, "F");

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 64, 175);
  doc.text("Total Pembayaran", 25, yPos);
  doc.text(formatCurrency(billData.amount), 160, yPos);

  yPos += 25;
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(220, 252, 231);
  doc.rect(20, yPos - 5, 170, 20, "F");

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(22, 101, 52);
  doc.text("✓ Pembayaran Berhasil Diverifikasi", 25, yPos);

  yPos += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Diverifikasi pada: ${new Date().toLocaleString("id-ID")}`,
    25,
    yPos
  );

  yPos += 30;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Catatan:", 20, yPos);

  yPos += 8;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const notes = [
    "• Kwitansi ini adalah bukti pembayaran yang sah",
    "• Simpan kwitansi ini dengan baik",
    "• Hubungi customer service untuk pertanyaan",
  ];

  notes.forEach((note) => {
    doc.text(note, 25, yPos);
    yPos += 5;
  });

  const currentDate = new Date().toLocaleDateString("id-ID");
  doc.text(`Buton Tengah, ${currentDate}`, 140, yPos + 10);
  doc.text("Petugas", 140, yPos + 30);
  doc.line(140, yPos + 35, 180, yPos + 35);
  return doc;
};
