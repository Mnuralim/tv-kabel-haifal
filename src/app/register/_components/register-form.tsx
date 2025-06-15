"use client";

import React, { useActionState, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Home,
  CreditCard,
} from "lucide-react";
import { RegisterButton } from "./register-button";
import { createCustomer } from "@/actions/customer";

interface FormData {
  username?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  idCardNumber?: string;
  familyCardNumber?: string;
  birthDate?: string;
  birthPlace?: string;
}

interface Step {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const RegisterForm = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({});
  const [state, action] = useActionState(createCustomer, {
    error: null,
  });

  const totalSteps = 3;

  const steps: Step[] = [
    {
      id: 1,
      title: "Informasi Akun",
      icon: User,
      description: "Username dan nama lengkap",
    },
    {
      id: 2,
      title: "Data Pribadi",
      icon: Home,
      description: "Alamat dan kontak",
    },
    {
      id: 3,
      title: "Dokumen",
      icon: CreditCard,
      description: "KTP dan Kartu Keluarga",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          !!formData.username &&
          !!formData.password &&
          !!formData.confirmPassword
        );
      case 2:
        return !!(
          formData.address &&
          formData.phoneNumber &&
          formData.email &&
          formData.fullName
        );
      case 3:
        return !!(
          formData.idCardNumber &&
          formData.familyCardNumber &&
          formData.birthDate &&
          formData.birthPlace
        );
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Username *
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md border-2 border-black bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Password *
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md border-2 border-black bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="Masukkan password"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Konfirmasi Password *
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md border-2 border-black bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="Masukkan konfirmasi password"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Nama Lengkap *
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md border-2 border-black bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Alamat Lengkap *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 rounded-md border-2 border-black bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all resize-none"
                placeholder="Masukkan alamat lengkap"
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Nomor Telepon *
              </label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md border-2 border-black bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-md border-2 border-black bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="email@example.com"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div>
              <label
                htmlFor="idCardNumber"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Nomor KTP *
              </label>
              <input
                id="idCardNumber"
                type="text"
                name="idCardNumber"
                value={formData.idCardNumber || ""}
                onChange={handleInputChange}
                maxLength={16}
                className="w-full px-4 py-3 rounded-md border-2 border-black bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="16 digit nomor KTP"
              />
            </div>
            <div>
              <label
                htmlFor="familyCardNumber"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Nomor Kartu Keluarga *
              </label>
              <input
                id="familyCardNumber"
                type="text"
                name="familyCardNumber"
                value={formData.familyCardNumber || ""}
                onChange={handleInputChange}
                maxLength={16}
                className="w-full px-4 py-3 rounded-md border-2 border-black bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                placeholder="16 digit nomor KK"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Tanggal Lahir *
                </label>
                <input
                  id="birthDate"
                  type="date"
                  name="birthDate"
                  value={formData.birthDate || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-md border-2 border-black bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>
              <div>
                <label
                  htmlFor="birthPlace"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Tempat Lahir *
                </label>
                <input
                  id="birthPlace"
                  type="text"
                  name="birthPlace"
                  value={formData.birthPlace || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-md border-2 border-black bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  placeholder="Kota tempat lahir"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white border-4 border-black rounded-md overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] max-w-2xl mx-auto">
      <div className="p-6 border-b-4 border-black">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
              <span className="text-white font-black">IN</span>
            </div>
            <h1 className="font-black text-xl text-red-600 tracking-tight">
              Logo
            </h1>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-black">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-b-2 border-black">
        <div className="flex justify-between items-center">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center text-center flex-1"
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center mb-2 transition-all ${
                    isActive
                      ? "bg-red-500 text-white"
                      : isCompleted
                      ? "bg-emerald-500 text-white"
                      : "bg-white text-gray-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="hidden sm:block">
                  <div
                    className={`text-xs font-bold ${
                      isActive
                        ? "text-red-600"
                        : isCompleted
                        ? "text-emerald-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black text-gray-800">
            {steps.find((s) => s.id === currentStep)?.title}
          </h2>
          <p className="text-gray-700 mt-2 font-medium">
            {steps.find((s) => s.id === currentStep)?.description}
          </p>
        </div>

        {state.error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 text-sm rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            {state.error}
          </div>
        )}

        <form action={currentStep === totalSteps ? action : undefined}>
          {Object.entries(formData).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value || ""} />
          ))}

          {renderStepContent()}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-md border-2 border-black font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                currentStep === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className={`flex items-center gap-2 px-6 py-3 rounded-md border-2 border-black font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  !isStepValid(currentStep)
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <RegisterButton />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
