import { CheckCheck } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

export const MarkAllAsReadButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-3 bg-green-500 text-white font-black text-sm sm:text-base border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center 
      disabled:opacity-50 disabled:cursor-not-allowed"
      title="Tandai Semua Dibaca"
    >
      {pending ? (
        "Memproses..."
      ) : (
        <>
          <CheckCheck className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Tandai Semua Dibaca</span>
          <span className="sm:hidden">Tandai Semua</span>
        </>
      )}
    </button>
  );
};
