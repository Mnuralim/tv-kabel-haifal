"use client";

import { ArrowLeft } from "lucide-react";
import type { ComplainInfo } from "../../_components/complaints-list";
import { useRouter } from "next/navigation";
import { ComplaintInformation } from "./complaint-information";
import { CustomerInformation } from "./customer-information";
import { ComplaintActions } from "./complaint-actions";

interface Props {
  complaint: ComplainInfo;
}

export const ComplaintDetail = ({ complaint }: Props) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="bg-gray-600 text-white border-2 border-neutral-700 px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black border-b-8 border-red-500 pb-2 text-black">
            Detail Keluhan
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ComplaintInformation complaint={complaint} />
          <CustomerInformation customer={complaint.customer} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <ComplaintActions complaint={complaint} />
        </div>
      </div>
    </div>
  );
};
