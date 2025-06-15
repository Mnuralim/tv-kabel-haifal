import type {
  AdminLevel,
  AdminNotificationType,
  ComplaintCategory,
  ComplaintStatus,
  CustomerNotificationType,
  CustomerStatus,
  InstallationStatus,
  PaymentStatus,
} from "@prisma/client";
import type jsPDF from "jspdf";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Hourglass,
  Info,
  Megaphone,
  MessageSquare,
  UserPlus,
  Wrench,
  XCircle,
} from "lucide-react";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string, detail: boolean = false) => {
  const date = new Date(dateString);
  return detail
    ? new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    : new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
        .format(date)
        .split("pukul")[0]
        .trim();
};

export const generateUniqueCode = () => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let code = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    code += characters.charAt(randomIndex);
  }
  return code;
};

export const getMonthName = (month: number) => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return months[month - 1];
};

export const getStatusText = (status: PaymentStatus) => {
  switch (status) {
    case "PAID":
      return "LUNAS";
    case "UNPAID":
      return "BELUM BAYAR";
    case "IN_REVIEW":
      return "MENUNGGU VERIFIKASI";
    case "REJECTED":
      return "DITOLAK";
    default:
      return status;
  }
};

export const getStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-800 border-green-300";
    case "UNPAID":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "IN_REVIEW":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "REJECTED":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const getStatusIcon = (status: PaymentStatus) => {
  switch (status) {
    case "PAID":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "UNPAID":
      return <Clock className="w-4 h-4 text-blue-600" />;
    case "IN_REVIEW":
      return <Hourglass className="w-4 h-4 text-yellow-600" />;
    case "REJECTED":
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-600" />;
  }
};

export const generateReceiptPDF = async (doc: jsPDF) => {
  return Buffer.from(doc.output("arraybuffer"));
};

export const getCustomerStatusColor = (status: CustomerStatus) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800 border-green-300";
    case "INACTIVE":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "SUSPENDED":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const getCustomerStatusText = (status: CustomerStatus) => {
  switch (status) {
    case "ACTIVE":
      return "Aktif";
    case "INACTIVE":
      return "Tidak Aktif";
    case "SUSPENDED":
      return "Ditangguhkan";
    default:
      return "Tidak Diketahui";
  }
};

export const getComplaintStatusColor = (status: ComplaintStatus) => {
  switch (status) {
    case "OPEN":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "RESOLVED":
      return "bg-green-100 text-green-800 border-green-300";
    case "CLOSED":
      return "bg-gray-100 text-gray-800 border-gray-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const getInstallationRequestStatusText = (
  status: InstallationStatus
) => {
  switch (status) {
    case "APPROVED":
      return "Disetujui";
    case "PENDING":
      return "Menunggu Persetujuan";
    case "COMPLETED":
      return "Selesai";
    case "REJECTED":
      return "Ditolak";
    default:
      return "Tidak Diketahui";
  }
};

export const getInstallationRequestStatusColor = (
  status: InstallationStatus
) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-400 border-green-600 text-green-900";
    case "PENDING":
      return "bg-yellow-400 border-yellow-600 text-yellow-900";
    case "COMPLETED":
      return "bg-blue-400 border-blue-600 text-blue-900";
    case "REJECTED":
      return "bg-red-400 border-red-600 text-red-900";
    default:
      return "bg-gray-400 border-gray-600 text-gray-900";
  }
};

export const getInstalationStatusIcon = (status: InstallationStatus) => {
  switch (status) {
    case "PENDING":
      return <Clock className="w-5 h-5" />;
    case "APPROVED":
      return <CheckCircle className="w-5 h-5" />;
    case "COMPLETED":
      return <CheckCircle className="w-5 h-5" />;
    case "REJECTED":
      return <XCircle className="w-5 h-5" />;
    default:
      return <AlertTriangle className="w-5 h-5" />;
  }
};

export const getComplaintCategoryText = (category: ComplaintCategory) => {
  switch (category) {
    case "AUDIO_ISSUE":
      return "Masalah Audio";
    case "CHANNEL_ISSUE":
      return "Masalah Channel";
    case "BILLING_ISSUE":
      return "Masalah Tagihan";
    case "INSTALLATION":
      return "Pemasangan";
    case "VIDEO_ISSUE":
      return "Masalah Video";
    case "SERVICE_STAFF":
      return "Masalah Video";
    default:
      return "Lainnya";
  }
};

export const getComplaintStatusIcon = (status: ComplaintStatus) => {
  switch (status) {
    case "OPEN":
      return <AlertTriangle className="w-4 h-4" />;
    case "IN_PROGRESS":
      return <Clock className="w-4 h-4" />;
    case "RESOLVED":
      return <CheckCircle className="w-4 h-4" />;
    case "CLOSED":
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <MessageSquare className="w-4 h-4" />;
  }
};

export const getComplaintStatusText = (status: ComplaintStatus) => {
  switch (status) {
    case "OPEN":
      return "DIBUAT";
    case "IN_PROGRESS":
      return "DIPROSES";
    case "RESOLVED":
      return "SELESAI";
    case "CLOSED":
      return "DITUTUP";
    default:
      return status;
  }
};

export const getAdminLevelColor = (level: AdminLevel) => {
  switch (level) {
    case "SUPER_ADMIN":
      return "bg-red-500";
    case "ADMIN":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

export const getAdminLevelText = (level: AdminLevel) => {
  switch (level) {
    case "SUPER_ADMIN":
      return "Super Admin";
    case "ADMIN":
      return "Admin";
    default:
      return "Unknown";
  }
};

export const generateMonthYearList = () => {
  const result: { label: string; value: string }[] = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  for (let year = currentYear - 4; year <= currentYear; year++) {
    const startMonth = 0;
    const endMonth = year === currentYear ? currentMonth : 11;

    for (let month = startMonth; month <= endMonth; month++) {
      const monthName = new Date(year, month).toLocaleString("id-ID", {
        month: "long",
      });
      result.push({
        label: `${monthName} ${year}`,
        value: `${month + 1}-${year}`,
      });
    }
  }

  return result;
};

export const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes} menit yang lalu`;
  if (hours < 24) return `${hours} jam yang lalu`;
  return `${days} hari yang lalu`;
};

export const getAdminNotificationTypeIcon = (type: AdminNotificationType) => {
  switch (type) {
    case "NEW_PAYMENT":
      return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
    case "NEW_COMPLAINT":
      return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
    case "INSTALLATION_REQUEST":
      return <Info className="w-4 h-4 sm:w-5 sm:h-5" />;
    case "USER_ACTIVATION_REQUEST":
      return <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />;
    default:
      return <Info className="w-4 h-4 sm:w-5 sm:h-5" />;
  }
};

export const getAdminNotificationTypeColor = (type: AdminNotificationType) => {
  switch (type) {
    case "NEW_PAYMENT":
      return "bg-green-500";
    case "NEW_COMPLAINT":
      return "bg-orange-500";
    case "INSTALLATION_REQUEST":
      return "bg-blue-500";
    case "USER_ACTIVATION_REQUEST":
      return "bg-indigo-500";

    default:
      return "bg-gray-500";
  }
};

export const getAdminNotificationTypeBgColor = (
  type: AdminNotificationType
) => {
  switch (type) {
    case "NEW_PAYMENT":
      return "bg-green-50";
    case "NEW_COMPLAINT":
      return "bg-orange-50";
    case "INSTALLATION_REQUEST":
      return "bg-blue-50";
    case "USER_ACTIVATION_REQUEST":
      return "bg-indigo-50";
    default:
      return "bg-gray-50";
  }
};

export const getCustomerNotificationTypeIcon = (
  type: CustomerNotificationType
) => {
  switch (type) {
    case "BILL_DUE":
      return <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />;
    case "PAYMENT_CONFIRMED":
      return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
    case "COMPLAINT_UPDATE":
      return <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />;
    case "INSTALLATION_SCHEDULED":
      return <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />;
    case "SERVICE_ANNOUNCEMENT":
      return <Megaphone className="w-4 h-4 sm:w-5 sm:h-5" />;
    default:
      return <Info className="w-4 h-4 sm:w-5 sm:h-5" />;
  }
};

export const getCustomerNotificationTypeColor = (
  type: CustomerNotificationType
) => {
  switch (type) {
    case "BILL_DUE":
      return "bg-red-500";
    case "PAYMENT_CONFIRMED":
      return "bg-green-500";
    case "COMPLAINT_UPDATE":
      return "bg-orange-500";
    case "INSTALLATION_SCHEDULED":
      return "bg-blue-500";
    case "SERVICE_ANNOUNCEMENT":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

export const getCustomerNotificationTypeBgColor = (
  type: CustomerNotificationType
) => {
  switch (type) {
    case "BILL_DUE":
      return "bg-red-50";
    case "PAYMENT_CONFIRMED":
      return "bg-green-50";
    case "COMPLAINT_UPDATE":
      return "bg-orange-50";
    case "INSTALLATION_SCHEDULED":
      return "bg-blue-50";
    case "SERVICE_ANNOUNCEMENT":
      return "bg-purple-50";
    default:
      return "bg-gray-50";
  }
};
