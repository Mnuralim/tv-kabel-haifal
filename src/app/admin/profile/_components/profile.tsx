"use client";

import React, { useActionState, useState } from "react";
import { Edit3, X, User, Shield, Calendar, Clock, Key } from "lucide-react";
import type { Prisma } from "@prisma/client";
import { formatDate, getAdminLevelColor, getAdminLevelText } from "@/lib/utils";
import { updateAdmin, updateAdminPassword } from "@/actions/admin";
import { ErrorMessage } from "../../_components/error-message";
import { UpdateProfileButton } from "./update-profile-button";
import { UpdatePasswordButton } from "./update-password-button";

type UserAdmin = Prisma.UserGetPayload<{
  select: {
    username: true;
    id: true;
    role: true;
    lastLogin: true;
    createdAt: true;
    adminDetails: true;
  };
}>;

interface Props {
  admin: UserAdmin;
}

export const AdminProfile = ({ admin }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [updateProfileState, updateProfileAction] = useActionState(
    updateAdmin,
    {
      error: null,
    }
  );
  const [updatePasswordState, updatePasswordAction] = useActionState(
    updateAdminPassword,
    {
      error: null,
    }
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="inline-block px-4 py-2 bg-red-100 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4">
          <span className="text-sm font-bold text-red-800">
            👤 Profil Admin
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
          Profil <span className="text-red-600">Administrator</span>
        </h1>
        <p className="text-xl text-gray-700 font-medium">
          Kelola informasi profil dan pengaturan akun administrator
        </p>
      </div>

      <div className="mb-8">
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={handleEdit}
            className={`group px-6 py-3 font-black text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center ${
              isEditing ? "bg-red-600 text-white" : "bg-white text-gray-900"
            }`}
          >
            <Edit3 className="w-5 h-5 mr-2" />
            Edit Profil
          </button>
          <button
            onClick={() => setIsChangingPassword(!isChangingPassword)}
            className={`group px-6 py-3 font-black text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center ${
              isChangingPassword
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <Key className="w-5 h-5 mr-2" />
            Ubah Password
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-500 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-4">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                Informasi Dasar
              </h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <form action={updateProfileAction} className="flex-1 space-y-6">
                <input type="hidden" name="id" value={admin.id} />
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="adminName"
                        className="w-full p-3 border-2 border-gray-300 font-medium focus:border-purple-500 focus:outline-none"
                        defaultValue={admin.adminDetails?.adminName}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium">
                        {admin.adminDetails?.adminName}
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
                        className="w-full p-3 border-2 border-gray-300 font-medium focus:border-purple-500 focus:outline-none"
                        defaultValue={admin.username}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 border-2 border-gray-200 font-medium flex items-center">
                        <User className="w-4 h-4 mr-2 text-gray-500" />
                        {admin.username}
                      </div>
                    )}
                  </div>
                </div>

                {updateProfileState.error && (
                  <ErrorMessage message={updateProfileState.error} />
                )}

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <UpdateProfileButton />
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 bg-white text-gray-900 font-black text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center"
                    >
                      <X className="w-5 h-5 mr-2" />
                      Batal
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-4">
              <div
                className={`w-10 h-10 ${getAdminLevelColor(
                  admin.adminDetails?.level || "ADMIN"
                )} border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-3`}
              >
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-gray-900">Level Admin</h3>
            </div>
            <div className="text-2xl font-black text-red-600">
              {getAdminLevelText(admin.adminDetails?.level || "ADMIN")}
            </div>
          </div>

          {isChangingPassword && (
            <div className="bg-orange-50 p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-orange-500 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-4">
                  <Key className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">
                  Ubah Password
                </h2>
              </div>

              <form action={updatePasswordAction} className="space-y-6">
                <input type="hidden" name="id" value={admin.id} />
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
                {updatePasswordState.error && (
                  <ErrorMessage message={updatePasswordState.error} />
                )}
                <div className="flex gap-4 pt-4">
                  <UpdatePasswordButton />
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="px-6 py-3 bg-white text-gray-900 font-black text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-green-50 p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-green-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-3">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-gray-900">Bergabung</h3>
            </div>
            <div className="text-lg font-bold text-green-600">
              {formatDate(admin.createdAt.toString())}
            </div>
          </div>

          <div className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-indigo-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mr-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-gray-900">Info Sistem</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1">
                  LOGIN TERAKHIR
                </div>
                <div className="text-sm font-medium">
                  {admin.lastLogin
                    ? formatDate(admin.lastLogin?.toString(), true)
                    : "-"}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 mb-1">
                  DIBUAT
                </div>
                <div className="text-sm font-medium">
                  {formatDate(admin.createdAt.toString())}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 text-white p-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-xs font-bold text-gray-400 mb-1">ADMIN ID</div>
            <div className="text-xs font-mono break-all">
              {admin.adminDetails?.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
