import React from "react";
import { CheckCircle, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegistrationSuccess() {
  return (
    <div className="min-h-screen  p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white border-4 border-black rounded-md overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]">
          <div className="p-6 border-b-4 border-black bg-emerald-400">
            <div className="flex justify-center">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                  <span className="text-white font-black">IN</span>
                </div>
                <h1 className="font-black text-xl text-red-600 tracking-tight">
                  Logo
                </h1>
              </div>
            </div>
          </div>

          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-400 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                <CheckCircle
                  className="w-10 h-10 text-green-800"
                  strokeWidth={3}
                />
              </div>
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-4">
              Pendaftaran Berhasil!
            </h2>

            <p className="text-gray-700 font-medium mb-8 leading-relaxed">
              Selamat! Akun Anda telah berhasil didaftarkan. Silakan menunggu
              konfirmasi dari admin kami.
            </p>

            <div className="bg-blue-100 border-2 border-black rounded-md p-6 mb-8 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-md border-2 border-black flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <div className="text-left">
                  <h3 className="font-black text-blue-800 mb-2">
                    Waktu Aktivasi
                  </h3>
                  <p className="text-blue-700 font-medium text-sm leading-relaxed">
                    Admin akan mengaktifkan akun Anda dalam waktu
                    <span className="font-black"> maksimal 1 x 24 jam</span>.
                    Setelah aktif, Anda dapat mendaftar instalasi TV kabel.
                  </p>
                </div>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="w-full bg-emerald-400 hover:bg-emerald-500 text-black font-black py-4 px-6 rounded-md 
                border-2 border-black 
                shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                focus:outline-none focus:ring-2 focus:ring-emerald-600
                transition-all duration-200
                flex items-center justify-center gap-3"
            >
              <span>Ke Dashboard</span>
              <ArrowRight className="w-5 h-5" strokeWidth={3} />
            </Link>

            <div className="mt-6 p-4 bg-gray-100 border-2 border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-gray-600 font-medium text-xs">
                💡 <span className="font-black">Tips:</span> Pastikan email dan
                nomor telepon Anda aktif untuk mendapatkan notifikasi aktivasi
                akun.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 font-medium text-sm">
            Butuh bantuan? Hubungi customer service kami
          </p>
          <div className="mt-2 inline-block bg-white border-2 border-black rounded-md px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-black text-red-600">📞 0800-1234-5678</span>
          </div>
        </div>
      </div>
    </div>
  );
}
