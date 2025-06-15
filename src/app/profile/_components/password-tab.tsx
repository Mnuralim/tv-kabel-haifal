import { CreditCard } from "lucide-react";
import React, { useActionState } from "react";
import { UpdatePasswordButton } from "./password-submit-button";
import { ErrorMessage } from "@/app/admin/_components/error-message";
import { updatePassword } from "@/actions/customer/index";

interface Props {
  customerId: string;
}

export const PasswordTab = ({ customerId }: Props) => {
  const [state, action] = useActionState(updatePassword, {
    error: null,
  });
  return (
    <div className="bg-orange-50 p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-orange-500 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-4">
          <CreditCard className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Ubah Password</h2>
      </div>

      <form action={action} className="space-y-6">
        <input type="hidden" name="id" value={customerId} />
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Password Lama
          </label>
          <input
            type="password"
            name="oldPassword"
            className="w-full p-3 border-2 border-gray-300 font-medium focus:border-orange-500 focus:outline-none"
            placeholder="Masukkan password lama"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Password Baru
          </label>
          <input
            type="password"
            name="newPassword"
            className="w-full p-3 border-2 border-gray-300 font-medium focus:border-orange-500 focus:outline-none"
            placeholder="Masukkan password baru"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Konfirmasi Password Baru
          </label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full p-3 border-2 border-gray-300 font-medium focus:border-orange-500 focus:outline-none"
            placeholder="Konfirmasi password baru"
          />
        </div>
        <div className="mt-4">
          {state.error && <ErrorMessage message={state.error} />}
        </div>
        <div className="flex gap-4 pt-4">
          <UpdatePasswordButton />
        </div>
      </form>
    </div>
  );
};
