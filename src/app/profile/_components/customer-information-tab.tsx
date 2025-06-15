import { IdCard, Mail, MapPin, Phone, User } from "lucide-react";
import React, { useActionState, useState } from "react";
import type { UserCustomer } from "./profile";
import { formatDate } from "@/lib/utils";
import { InformationSubmitButton } from "./information-submit-button";
import { ErrorMessage } from "@/app/admin/_components/error-message";
import { updateCustomer } from "@/actions/customer/index";

interface Props {
  customer: UserCustomer;
}

export const CustomerInformationTab = ({ customer }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [state, action] = useActionState(updateCustomer, {
    error: null,
  });
  return (
    <form
      action={action}
      className="p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
    >
      <input type="hidden" name="id" value={customer.id} />
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
          Data Pribadi
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Nama Lengkap
            </label>
            {isEditing ? (
              <input
                type="text"
                name="fullName"
                className="w-full p-3 border-2 border-gray-300 font-medium focus:border-blue-500 focus:outline-none"
                defaultValue={customer.customerDetails?.fullName}
              />
            ) : (
              <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium">
                {customer.customerDetails?.fullName}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Username
            </label>
            {isEditing ? (
              <input
                type="text"
                name="username"
                className="w-full p-3 border-2 border-gray-300 font-medium focus:border-blue-500 focus:outline-none"
                defaultValue={customer.username}
              />
            ) : (
              <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium flex items-center">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                {customer.username}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                className="w-full p-3 border-2 border-gray-300 font-medium focus:border-blue-500 focus:outline-none"
                defaultValue={customer.customerDetails?.email}
              />
            ) : (
              <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                {customer.customerDetails?.email}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Nomor Telepon
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phoneNumber"
                className="w-full p-3 border-2 border-gray-300 font-medium focus:border-blue-500 focus:outline-none"
                defaultValue={customer.customerDetails?.phoneNumber}
              />
            ) : (
              <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                {customer.customerDetails?.phoneNumber}
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Alamat
            </label>
            {isEditing ? (
              <textarea
                name="address"
                rows={3}
                className="w-full p-3 border-2 border-gray-300 font-medium focus:border-blue-500 focus:outline-none resize-none"
                defaultValue={customer.customerDetails?.address}
              />
            ) : (
              <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
                {customer.customerDetails?.address}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200 flex items-center">
          <IdCard className="w-5 h-5 mr-2" />
          Dokumen Identitas
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              NIK (KTP)
            </label>
            {isEditing ? (
              <input
                type="text"
                name="idCardNumber"
                className="w-full p-3 border-2 border-gray-300 font-medium focus:border-blue-500 focus:outline-none"
                defaultValue={customer.customerDetails?.idCardNumber}
              />
            ) : (
              <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium">
                {customer.customerDetails?.idCardNumber}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Nomor KK
            </label>
            {isEditing ? (
              <input
                type="text"
                name="familyCardNumber"
                className="w-full p-3 border-2 border-gray-300 font-medium focus:border-blue-500 focus:outline-none"
                defaultValue={customer.customerDetails?.familyCardNumber}
              />
            ) : (
              <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium">
                {customer.customerDetails?.familyCardNumber}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tempat Lahir
            </label>
            {isEditing ? (
              <input
                type="text"
                name="birthPlace"
                className="w-full p-3 border-2 border-gray-300 font-medium focus:border-blue-500 focus:outline-none"
                defaultValue={customer.customerDetails?.birthPlace}
              />
            ) : (
              <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium">
                {customer.customerDetails?.birthPlace}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tanggal Lahir
            </label>
            {isEditing ? (
              <input
                type="date"
                name="birthDate"
                className="w-full p-3 border-2 border-gray-300 font-medium focus:border-blue-500 focus:outline-none"
                defaultValue={
                  customer.customerDetails?.birthDate
                    ? new Date(customer.customerDetails.birthDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
              />
            ) : (
              <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium">
                {customer.customerDetails?.birthDate
                  ? formatDate(customer.customerDetails.birthDate.toString())
                  : "-"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        {state.error && <ErrorMessage message={state.error} />}
      </div>
      <div className="mt-4 flex gap-4">
        {isEditing ? <InformationSubmitButton /> : null}
        <button
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
          className="px-6 py-3 bg-white text-gray-900 font-black text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center"
        >
          {isEditing ? "Batal" : "Edit Informasi Profil"}
        </button>
      </div>
    </form>
  );
};
