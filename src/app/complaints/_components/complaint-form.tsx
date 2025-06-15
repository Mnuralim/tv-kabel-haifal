import { Upload } from "lucide-react";
import React, { useActionState, useState } from "react";
import { SubmitButton } from "./submit-button";
import { createComplaint } from "@/actions/complaint";
import { ErrorMessage } from "@/app/admin/_components/error-message";

interface Props {
  handleCloseModal: () => void;
  customerId: string;
}

export const complaintCategories = [
  {
    value: "VIDEO_ISSUE",
    label: "Masalah Video",
  },
  {
    value: "AUDIO_ISSUE",
    label: "Masalah Audio",
  },
  {
    value: "CHANNEL_ISSUE",
    label: "Masalah Channel",
  },
  {
    value: "BILLING_ISSUE",
    label: "Masalah Tagihan",
  },
  {
    value: "INSTALLATION",
    label: "Instalasi",
  },
  {
    value: "SERVICE_STAFF",
    label: "Layanan Staff",
  },
  {
    value: "OTHERS",
    label: "Lainnya",
  },
];

export const ComplaintForm = ({ handleCloseModal, customerId }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [state, action] = useActionState(createComplaint, {
    error: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  return (
    <form
      action={action}
      className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full"
    >
      {state.error ? <ErrorMessage message={state.error} /> : null}
      <input
        type="hidden"
        name="customerId"
        value={customerId}
        defaultValue={customerId}
      />
      <div className="p-6 border-b-2 border-black flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-900">Buat Keluhan Baru</h2>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-bold text-gray-900 mb-2"
          >
            Kategori Keluhan
          </label>
          <select
            name="category"
            id="category"
            className="w-full px-4 py-2 border-2 border-black font-medium focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-white"
          >
            <option value="">Pilih kategori...</option>
            {complaintCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-bold text-gray-900 mb-2"
          >
            Judul Keluhan
          </label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Masukkan judul keluhan..."
            className="w-full px-4 py-2 border-2 border-black font-medium focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-bold text-gray-900 mb-2"
          >
            Deskripsi Keluhan
          </label>
          <textarea
            rows={4}
            name="description"
            id="description"
            placeholder="Jelaskan masalah yang Anda alami..."
            className="w-full px-4 py-2 border-2 border-black font-medium focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all resize-none"
          />
        </div>

        <div>
          <p className="block text-sm font-bold text-gray-900 mb-2">
            Lampiran Gambar (Opsional)
          </p>
          <div className="w-full px-4 py-2 border-2 border-black font-medium focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all resize-none">
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/jpg,image/png,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="image"
            />
            <label
              htmlFor="image"
              className="cursor-pointer py-3 flex items-center flex-col"
            >
              <Upload className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-lg font-bold text-neutral-600 mb-2">
                {selectedFile ? "File Terpilih" : "Klik untuk upload file"}
              </p>
              {selectedFile && (
                <div className="p-6 text-center hover:border-black transition-colors cursor-pointer">
                  <p className="font-bold text-neutral-800">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {getFileSize(selectedFile.size)}
                  </p>
                </div>
              )}
              <p className="text-sm text-neutral-500 font-medium">
                Format: JPG, PNG, atau PDF
              </p>
              <p className="text-sm text-neutral-500 font-medium">
                Maksimal ukuran: 5MB
              </p>
            </label>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={handleCloseModal}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-bold border-2 border-black hover:bg-gray-300 transition-colors"
          >
            Batal
          </button>
          <SubmitButton />
        </div>
      </div>
    </form>
  );
};
