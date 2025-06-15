import { formatDate } from "@/lib/utils";
import { CheckCircle, Phone, MessageSquare, PlayCircle } from "lucide-react";
import { useActionState } from "react";
import type { ComplainInfo } from "../../_components/complaints-list";
import { confirmComplaint } from "@/actions/complaint";

interface Props {
  complaint: ComplainInfo;
}

export const ComplaintActions = ({ complaint }: Props) => {
  const [, confirmationAction] = useActionState(confirmComplaint, {
    error: null,
  });
  return (
    <div>
      <div className="bg-white border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h3>
        <div className="space-y-3">
          {complaint.complaintStatus === "OPEN" && (
            <form action={confirmationAction}>
              <input type="hidden" name="id" value={complaint.id} />
              <input type="hidden" name="detail" value={"1"} />
              <input type="hidden" name="status" value={"IN_PROGRESS"} />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white border-2 border-neutral-700 px-4 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Mulai Penanganan
              </button>
            </form>
          )}

          {complaint.complaintStatus === "IN_PROGRESS" && (
            <form action={confirmationAction}>
              <input type="hidden" name="id" value={complaint.id} />
              <input type="hidden" name="detail" value={"1"} />
              <input type="hidden" name="status" value={"RESOLVED"} />
              <button className="w-full bg-green-600 text-white border-2 border-neutral-700 px-4 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Selesaikan Keluhan
              </button>
            </form>
          )}

          <button className="w-full bg-orange-600 text-white border-2 border-neutral-700 px-4 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center">
            <Phone className="w-4 h-4 mr-2" />
            Hubungi Pelanggan
          </button>

          <button className="w-full bg-purple-600 text-white border-2 border-neutral-700 px-4 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Kirim Pesan
          </button>
        </div>
      </div>

      <div className="mt-4 bg-white border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Timeline</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-semibold">Keluhan Dibuat</p>
              <p className="text-xs text-gray-600">
                {formatDate(complaint.createdAt.toString())}
              </p>
            </div>
          </div>

          {complaint.complaintStatus !== "OPEN" && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-semibold">Penanganan Dimulai</p>
                <p className="text-xs text-gray-600">
                  {formatDate(complaint.createdAt.toString())}
                </p>
              </div>
            </div>
          )}

          {complaint.completionDate && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-semibold">Keluhan Selesai</p>
                <p className="text-xs text-gray-600">
                  {formatDate(complaint.completionDate.toString())}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
