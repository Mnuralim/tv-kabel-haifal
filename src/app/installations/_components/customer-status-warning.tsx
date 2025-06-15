import type { Prisma } from "@prisma/client";
import { AlertCircle, Clock } from "lucide-react";
type Customer = Prisma.UserGetPayload<{
  select: {
    username: true;
    id: true;
    customerDetails: {
      select: {
        status: true;
        subscriptionStartDate: true;
        address: true;
        id: true;
        fullName: true;
      };
    };
  };
}>;

interface Props {
  customer: Customer;
}

export const CustomerStatusWarning = ({ customer }: Props) => {
  if (customer.customerDetails?.status === "ACTIVE") return null;
  const statusConfig = {
    INACTIVE: {
      title: "Akun Belum Diverifikasi",
      message:
        "Status akun Anda masih dalam proses verifikasi oleh admin. Harap tunggu hingga verifikasi selesai untuk dapat mengajukan instalasi.",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
    },
    SUSPENDED: {
      title: "Akun Ditangguhkan",
      message:
        "Akun Anda sementara ditangguhkan. Silakan hubungi customer service untuk informasi lebih lanjut.",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-600",
    },
  };

  const config = statusConfig[customer.customerDetails?.status || "INACTIVE"];

  return (
    <div
      className={`${config.bgColor} p-6 border-2 ${config.borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {customer.customerDetails?.status === "INACTIVE" ? (
            <Clock className={`w-6 h-6 ${config.iconColor}`} />
          ) : (
            <AlertCircle className={`w-6 h-6 ${config.iconColor}`} />
          )}
        </div>
        <div>
          <h3 className={`text-lg font-black ${config.textColor} mb-2`}>
            {config.title}
          </h3>
          <p className={`${config.textColor} font-medium mb-4`}>
            {config.message}
          </p>
          {customer.customerDetails?.status === "INACTIVE" && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className={`text-sm ${config.textColor} font-medium`}>
                Menunggu verifikasi admin...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
