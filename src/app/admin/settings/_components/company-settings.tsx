"use client";

import React, { useActionState, useState } from "react";
import {
  Edit3,
  X,
  Building,
  Mail,
  Phone,
  Globe,
  DollarSign,
  MapPin,
  Info,
  Clock,
  Calendar,
  CreditCard,
  Building2,
} from "lucide-react";
import type { CompanySettings as CompanySettingsType } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/utils";
import { updateSettings } from "@/actions/settings";
import { SubmitButton } from "./submit-button";
import { ErrorMessage } from "../../_components/error-message";

interface Props {
  setting: CompanySettingsType;
}

export const CompanySettings = ({ setting }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const [state, action] = useActionState(updateSettings, {
    error: null,
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <form action={action}>
      <input type="hidden" name="id" value={setting.id} />
      <div className="mb-8">
        <div className="inline-block px-4 py-2 bg-red-100 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
          <span className="text-sm font-bold text-red-800">
            ⚙️ Pengaturan Sistem
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
          Pengaturan <span className="text-red-600">Perusahaan</span>
        </h1>
        <p className="text-xl text-gray-700 font-medium">
          Kelola informasi dan konfigurasi perusahaan Anda
        </p>
      </div>

      <div className="mb-8">
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="group px-6 py-3 bg-red-600 text-white font-black text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center"
          >
            <Edit3 className="w-5 h-5 mr-2" />
            Edit Pengaturan
          </button>
        ) : (
          <div className="flex gap-4">
            <SubmitButton />
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-white text-gray-900 font-black text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center"
            >
              <X className="w-5 h-5 mr-2" />
              Batal
            </button>
          </div>
        )}
      </div>
      <div>{state.error && <ErrorMessage message={state.error} />}</div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-500 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-4">
                <Building className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                Informasi Perusahaan
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nama Perusahaan
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    className="w-full p-3 border-2 border-gray-300 font-medium focus:border-red-500 focus:outline-none"
                    defaultValue={setting.name}
                  />
                ) : (
                  <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium">
                    {setting.name}
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
                    defaultValue={setting.email}
                    className="w-full p-3 border-2 border-gray-300 font-medium focus:border-red-500 focus:outline-none"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {setting.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phoneNumber"
                    defaultValue={setting.phoneNumber}
                    className="w-full p-3 border-2 border-gray-300 font-medium focus:border-red-500 focus:outline-none"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {setting.phoneNumber}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="website"
                    defaultValue={setting.website}
                    className="w-full p-3 border-2 border-gray-300 font-medium focus:border-red-500 focus:outline-none"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-gray-500" />
                    {setting.website}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Alamat Lengkap
              </label>
              {isEditing ? (
                <textarea
                  rows={3}
                  name="address"
                  defaultValue={setting.address}
                  className="w-full p-3 border-2 border-gray-300 font-medium focus:border-red-500 focus:outline-none resize-none"
                />
              ) : (
                <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-1 flex-shrink-0" />
                  {setting.address}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-yellow-500 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                Informasi Bank
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nama Bank
                </label>
                {isEditing ? (
                  <input
                    name="bankName"
                    defaultValue={setting.bankName || ""}
                    className="w-full p-3 border-2 border-gray-300 font-medium focus:border-red-500 focus:outline-none resize-none"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium">
                    {setting.bankName || "Belum ada informasi bank"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  No. Rekening
                </label>
                {isEditing ? (
                  <input
                    name="accountNumber"
                    defaultValue={setting.accountNumber || ""}
                    className="w-full p-3 border-2 border-gray-300 font-medium focus:border-red-500 focus:outline-none resize-none"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium">
                    {setting.accountNumber || "Belum ada informasi bank"}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Atas Nama
                </label>
                {isEditing ? (
                  <input
                    name="accountName"
                    defaultValue={setting.accountName || ""}
                    className="w-full p-3 border-2 border-gray-300 font-medium focus:border-red-500 focus:outline-none resize-none"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium">
                    {setting.accountName || "Belum ada informasi bank"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-500 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-4">
                <Info className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                Tentang Perusahaan
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Deskripsi Perusahaan
                </label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    name="aboutUs"
                    defaultValue={setting.aboutUs || ""}
                    className="w-full p-3 border-2 border-gray-300 font-medium focus:border-red-500 focus:outline-none resize-none"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium">
                    {setting.aboutUs || "Belum ada deskripsi"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Deskripsi Layanan
                </label>
                {isEditing ? (
                  <textarea
                    rows={3}
                    name="description"
                    defaultValue={setting.description || ""}
                    className="w-full p-3 border-2 border-gray-300 font-medium focus:border-red-500 focus:outline-none resize-none"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium">
                    {setting.description || "Belum ada deskripsi layanan"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-green-50 p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-3">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-gray-900">
                Tarif Bulanan
              </h3>
            </div>
            {isEditing ? (
              <input
                type="number"
                name="monthlyRate"
                defaultValue={setting.montyhlyRate}
                className="w-full p-3 border-2 border-gray-300 font-bold text-lg focus:border-red-500 focus:outline-none"
              />
            ) : (
              <div className="text-2xl font-black text-green-600">
                {formatCurrency(setting.montyhlyRate)}
              </div>
            )}
          </div>

          <div className="bg-orange-50 p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-3">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-gray-900">
                Tanggal Tagihan
              </h3>
            </div>
            {isEditing ? (
              <div>
                <select
                  defaultValue={setting.billingDate}
                  name="billingDate"
                  className="w-full p-3 border-2 border-gray-300 font-bold text-lg focus:border-red-500 focus:outline-none"
                >
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      Tanggal {day}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-600 mt-2">
                  Pilih tanggal dalam bulan untuk tagihan bulanan
                </p>
              </div>
            ) : (
              <div>
                <div className="text-2xl font-black text-orange-600">
                  Tanggal {setting.billingDate}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Tagihan bulanan setiap tanggal {setting.billingDate}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-lg font-black text-gray-900 mb-4">
              Logo Perusahaan
            </h3>
            {isEditing ? (
              <input
                type="text"
                defaultValue={setting.logo}
                name="logo"
                className="w-full p-3 border-2 border-gray-300 font-medium focus:border-red-500 focus:outline-none"
                placeholder="Path ke file logo"
              />
            ) : (
              <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium text-sm">
                {setting.logo}
              </div>
            )}
          </div>

          <div className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-purple-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-gray-900">Info Sistem</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1">
                  DIBUAT
                </div>
                <div className="text-sm font-medium flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                  {formatDate(setting.createdAt.toString())}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1">
                  DIPERBARUI
                </div>
                <div className="text-sm font-medium flex items-center">
                  <Clock className="w-3 h-3 mr-1 text-gray-400" />
                  {formatDate(setting.updatedAt.toString())}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-xs font-bold text-gray-400 mb-1">
              COMPANY ID
            </div>
            <div className="text-xs font-mono break-all">{setting.id}</div>
          </div>
        </div>
      </div>
    </form>
  );
};
