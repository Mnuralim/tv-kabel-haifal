"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  User,
  LogOut,
  CreditCard,
  MessageSquare,
  X,
  ChevronDown,
  Home,
  Tv,
  Menu,
  UserPlus,
  Receipt,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/customer";
import type { CompanySettings } from "@prisma/client";

const navigations = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Tagihan",
    href: "/bills",
    icon: CreditCard,
  },
  {
    name: "Instalasi",
    href: "/installations",
    icon: Tv,
  },
  {
    name: "Keluhan",
    href: "/complaints",
    icon: MessageSquare,
  },
];

interface Props {
  customerName?: string;
  notifications?: number;
  setting: CompanySettings;
}
export const CustomerHeader = ({
  customerName = "test",
  notifications = 0,
  setting,
}: Props) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileProfileRef = useRef<HTMLDivElement | null>(null);
  const pathName = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileProfileRef.current &&
        !mobileProfileRef.current.contains(event.target as Node)
      ) {
        setIsMobileProfileOpen(false);
      }
    };

    if (isMobileProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileProfileOpen]);

  if (pathName.startsWith("/admin") || pathName.startsWith("/register"))
    return null;

  const isHomePage = pathName === "/";

  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-black shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
              <span className="text-white font-black">TH</span>
            </div>
            <div>
              <h1 className="font-black text-xl text-red-600 tracking-tight">
                {setting.name}
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                {isHomePage
                  ? "Layanan TV Kabel Terpercaya"
                  : "Portal Pelanggan"}
              </p>
            </div>
          </div>

          {isHomePage ? (
            <div className="flex items-center gap-3">
              <Link
                href="/register"
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 border-2 border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:block">Daftar</span>
              </Link>
              <Link
                href="/bills"
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 hover:text-red-600 border-2 border-black bg-white hover:bg-gray-50 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 transition-all"
              >
                <Receipt className="w-4 h-4" />
                <span className="hidden sm:block">Cek Tagihan</span>
              </Link>
            </div>
          ) : (
            <>
              <nav className="hidden md:flex items-center gap-6">
                {navigations.map((nav) => {
                  const Icon = nav.icon;
                  return (
                    <Link
                      key={nav.name}
                      href={nav.href}
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-700 hover:text-red-600 border-2 border-transparent hover:border-black rounded-md hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 transition-all ${
                        pathName === nav.href ? "bg-gray-100" : ""
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {nav.name}
                    </Link>
                  );
                })}
              </nav>

              <div className="flex gap-1">
                <div className="flex items-center gap-3">
                  <Link
                    href={"/notifications"}
                    className="relative p-2 text-gray-700 hover:text-red-600 border-2 border-transparent hover:border-black rounded-md hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 transition-all"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {notifications > 9 ? "9+" : notifications}
                      </span>
                    )}
                  </Link>
                  <div
                    className="relative hidden md:block"
                    ref={profileDropdownRef}
                  >
                    <button
                      onClick={() =>
                        setIsProfileDropdownOpen(!isProfileDropdownOpen)
                      }
                      className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-gray-700 hover:text-red-600 border-2 border-transparent hover:border-black rounded-md hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 transition-all"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden sm:block">{customerName}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isProfileDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50">
                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            Profil Saya
                          </Link>
                          <form action={logout}>
                            <button
                              type="submit"
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-red-600 text-left"
                            >
                              <LogOut className="w-4 h-4" />
                              Keluar
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 text-gray-700 hover:text-red-600 border-2 border-transparent hover:border-black rounded-md hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 transition-all"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {!isHomePage && isMobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="px-4 py-2 space-y-1">
            {navigations.map((nav) => {
              const Icon = nav.icon;
              return (
                <Link
                  key={nav.name}
                  href={nav.href}
                  className={`flex items-center gap-3 px-3 py-3 text-sm font-bold text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                    pathName === nav.href ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {nav.name}
                </Link>
              );
            })}

            <div
              className="border-t-2 border-gray-200 pt-3 mt-3"
              ref={mobileProfileRef}
            >
              <button
                onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                className="flex items-center justify-between w-full gap-3 px-3 py-2 text-sm font-bold text-gray-800 hover:text-red-600 hover:bg-gray-50 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  {customerName}
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isMobileProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isMobileProfileOpen && (
                <div className="mt-2 ml-6 space-y-1">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-md"
                    onClick={() => {
                      setIsMobileProfileOpen(false);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="w-4 h-4" />
                    Profil Saya
                  </Link>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="flex items-center gap-3 w-full px-3 py-3 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-md text-left"
                      onClick={() => {
                        setIsMobileProfileOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isHomePage && (
        <div className="md:hidden border-t-2 border-black bg-white shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="px-4 py-3 flex gap-3">
            <Link
              href="/register"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-red-500 hover:bg-red-600 border-2 border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              Daftar
            </Link>
            <Link
              href="/bills"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-gray-700 hover:text-red-600 border-2 border-black bg-white hover:bg-gray-50 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 transition-all"
            >
              <Receipt className="w-4 h-4" />
              Cek Tagihan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
