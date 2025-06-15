import { Save } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

export const InformationSubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-3 bg-green-500 text-white font-black text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 flex items-center disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:translate-x-0"
    >
      <Save className="w-5 h-5 mr-2" />
      {pending ? "Menyimpan..." : "Simpan"}
    </button>
  );
};
