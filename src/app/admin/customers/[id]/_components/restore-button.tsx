import { RefreshCw } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

export const RestoreButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="bg-orange-600 text-white border-2 border-neutral-700 px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <RefreshCw className="w-4 h-4 animate-spin" />
      ) : (
        <RefreshCw className="w-4 h-4" />
      )}
      {pending ? "Memulihkan..." : "Pulihkan User"}
    </button>
  );
};
