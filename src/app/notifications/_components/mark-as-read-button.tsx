import { Eye } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

export const MarkAsReadButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-2 py-2 sm:px-3 bg-green-500 text-white font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title="Tandai sudah dibaca"
    >
      {pending ? "Memproses..." : <Eye className="w-4 h-4" strokeWidth={2.5} />}
    </button>
  );
};
