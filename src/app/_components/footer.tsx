"use client";
import type { CompanySettings } from "@prisma/client";
import { usePathname } from "next/navigation";
import React from "react";

interface Props {
  setting: CompanySettings;
}

export const Footer = ({ setting }: Props) => {
  const pathName = usePathname();
  if (pathName.startsWith("/admin") || pathName.startsWith("/register"))
    return null;
  return (
    <footer className="bg-black text-white py-12 border-t-4 border-black mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-md shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] flex items-center justify-center">
                <span className="text-white font-black">TH</span>
              </div>
              <h3 className="font-black text-xl">{setting?.name}</h3>
            </div>
            <p className="text-gray-400 font-medium">{setting?.aboutUs}</p>
          </div>
          <div>
            <h4 className="font-black text-lg mb-4">Layanan</h4>
            <ul className="space-y-2 text-gray-400">
              <li>TV Kabel Premium</li>
              <li>Internet Broadband</li>
              <li>Paket Bundling</li>
              <li>Customer Support</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-lg mb-4">Kontak</h4>
            <div className="text-gray-400 space-y-2">
              <p>📞 {setting?.phoneNumber}</p>
              <p>📧 {setting?.email}</p>
              <p>📍 {setting?.address}</p>
            </div>
          </div>
        </div>
        <div className="border-t-2 border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 font-medium">
            © {new Date().getFullYear()} {setting?.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
