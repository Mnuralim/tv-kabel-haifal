import { Wrench } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

export const CompletedButton = () => {
  const { pending: isPending } = useFormStatus();
  return (
    <button className="w-full bg-blue-600 text-white border-2 border-neutral-700 px-4 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
      <Wrench className="w-4 h-4 mr-2" />
      {isPending ? "Memproses..." : "Tandai Selesai"}
    </button>
  );
};
