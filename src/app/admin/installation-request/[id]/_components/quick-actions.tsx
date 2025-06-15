import { formatDate } from "@/lib/utils";
import { CheckCircle, Phone, XCircle } from "lucide-react";
import type { InstallationRequestInfo } from "../../_components/installation-request-list";
import { useActionState, useState } from "react";
import { Modal } from "@/app/admin/_components/modal";
import { ConfirmationForm } from "../../_components/confirmation-form";
import { CompletedButton } from "./completed-button";
import { confirmInstallationRequest } from "@/actions/installation-request";

interface Props {
  request: InstallationRequestInfo;
}

export const QuickActions = ({ request }: Props) => {
  const [showConfirmation, setShowConfirmation] = useState<
    "accept" | "reject" | null
  >(null);

  const [, confirmAction] = useActionState(confirmInstallationRequest, {
    error: null,
  });

  return (
    <div>
      <div className="bg-white border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h3>
        <div className="space-y-3">
          {request.status === "PENDING" && (
            <>
              <button
                onClick={() => setShowConfirmation("accept")}
                className="w-full bg-green-600 text-white border-2 border-neutral-700 px-4 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Setujui Permintaan
              </button>
              <button
                onClick={() => setShowConfirmation("reject")}
                className="w-full bg-red-600 text-white border-2 border-neutral-700 px-4 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Tolak Permintaan
              </button>
            </>
          )}

          {request.status === "APPROVED" && (
            <form action={confirmAction}>
              <input type="hidden" name="id" value={request.id} />
              <input type="hidden" name="isDetail" defaultValue={"1"} />
              <input type="hidden" name="status" defaultValue="COMPLETED" />
              <CompletedButton />
            </form>
          )}

          <button className="w-full bg-orange-600 text-white border-2 border-neutral-700 px-4 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center">
            <Phone className="w-4 h-4 mr-2" />
            Hubungi Pelanggan
          </button>
        </div>
      </div>

      <div className="mt-4 bg-white border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Timeline</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
            <div>
              <p className="text-sm font-semibold">Permintaan Dibuat</p>
              <p className="text-xs text-gray-600">
                {formatDate(request.createdAt.toString())}
              </p>
            </div>
          </div>

          {request.approvedDate && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-semibold">Permintaan Disetujui</p>
                <p className="text-xs text-gray-600">
                  {formatDate(request.approvedDate.toString())}
                </p>
              </div>
            </div>
          )}

          {request.scheduledDate && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-semibold">Instalasi Dijadwalkan</p>
                <p className="text-xs text-gray-600">
                  {formatDate(request.scheduledDate.toString())}
                </p>
              </div>
            </div>
          )}

          {request.completionDate && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-semibold">Instalasi Selesai</p>
                <p className="text-xs text-gray-600">
                  {formatDate(request.completionDate.toString())}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showConfirmation === "accept" || showConfirmation === "reject"}
        onClose={() => setShowConfirmation(null)}
      >
        <ConfirmationForm
          onClose={() => setShowConfirmation(null)}
          modal={showConfirmation!}
          selectedId={request.id}
          isDetail="1"
        />
      </Modal>

      {/* <Modal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
      >
        <div className="bg-white border-4 border-neutral-700 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] p-6 mx-4">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
            <h3 className="text-xl font-bold">Tolak Permintaan Instalasi</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Mohon berikan alasan mengapa permintaan ini ditolak:
          </p>
          <textarea
            value={rejectionNotes}
            onChange={(e) => setRejectionNotes(e.target.value)}
            className="w-full border-2 border-neutral-700 p-2 mb-4"
            rows={4}
            placeholder="Contoh: Alamat tidak tercover area layanan, dokumen tidak lengkap, dll."
          />
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowRejectionModal(false)}
              className="bg-gray-600 text-white border-2 border-neutral-700 px-4 py-2 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectionNotes || isProcessing}
              className="bg-red-600 text-white border-2 border-neutral-700 px-4 py-2 font-bold shadow-[3px_3px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Memproses..." : "Konfirmasi Penolakan"}
            </button>
          </div>
        </div>
      </Modal> */}
    </div>
  );
};
