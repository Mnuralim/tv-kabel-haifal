"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tv, CreditCard, Shield, ArrowRight, Star, Zap } from "lucide-react";

export default function WelcomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: <Tv className="w-6 h-6" />,
      title: "Channel Premium",
      description: "Akses ke 200+ channel berkualitas HD",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Internet Cepat",
      description: "Koneksi stabil hingga 100 Mbps",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Layanan 24/7",
      description: "Support pelanggan siap membantu kapan saja",
    },
  ];

  const testimonials = [
    {
      name: "Budi Santoso",
      rating: 5,
      comment:
        "Pelayanan sangat memuaskan, internet stabil dan channel lengkap!",
    },
    {
      name: "Siti Nurhaliza",
      rating: 5,
      comment: "Harga terjangkau dengan kualitas terbaik di kawasan ini.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className={`transform transition-all duration-1000 ${
                isLoaded
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
            >
              <div className="inline-block px-4 py-2 bg-red-100 border-2 border-black rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-6">
                <span className="text-sm font-bold text-red-800">
                  🎉 Promo Spesial Bulan Ini!
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                Nikmati <span className="text-red-600 ">TV Kabel </span>
                <span className="">Terbaik!</span>
              </h1>
              <p className="text-xl text-gray-700 font-medium mb-8 leading-relaxed">
                Dapatkan akses ke ratusan channel premium dan internet super
                cepat dengan harga terjangkau. Bergabunglah dengan ribuan
                pelanggan yang sudah merasakan kepuasan layanan kami.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="group px-8 py-4 bg-red-600 text-white font-black text-lg border-4 border-black rounded-md shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
                >
                  Daftar Sekarang
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/bills"
                  className="px-8 py-4 bg-white text-gray-900 font-black text-lg border-4 border-black rounded-md shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
                >
                  Cek Tagihan
                </Link>
              </div>
            </div>
            <div
              className={`transform transition-all duration-1000 delay-300 ${
                isLoaded
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
            >
              <div className="relative">
                <div className="bg-red-500 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 text-center">
                  <Tv className="w-24 h-24 text-white mx-auto mb-4" />
                  <h3 className="text-2xl font-black text-white mb-2">
                    200+ Channel
                  </h3>
                  <p className="text-red-100">Kualitas HD & 4K</p>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-yellow-400 rounded-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4">
                  <CreditCard className="w-12 h-12 text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 border-t-4 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Kenapa Pilih Kami?
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              Kami memberikan yang terbaik untuk kepuasan pelanggan
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all group"
              >
                <div className="w-16 h-16 bg-red-500 rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white mb-6 group-hover:rotate-12 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 font-medium">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Kata Pelanggan Kami
            </h2>
            <p className="text-xl text-gray-700 font-medium">
              Kepuasan pelanggan adalah prioritas utama kami
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-red-50 p-8 rounded-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 font-medium mb-4 text-lg">
                  &quot;{testimonial.comment}&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-500 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <span className="font-bold text-gray-900">
                    {testimonial.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-red-600 border-t-4 border-black">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Siap Bergabung?
          </h2>
          <p className="text-xl text-red-100 font-medium mb-8">
            Dapatkan akses penuh ke semua layanan kami dengan mendaftar sekarang
            juga!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-10 py-4 bg-white text-red-600 font-black text-xl border-4 border-black rounded-md shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:translate-x-2 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              Daftar Gratis
            </Link>
            <Link
              href="/login"
              className="px-10 py-4 bg-transparent text-white font-black text-xl border-4 border-white rounded-md shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:translate-y-2 hover:translate-x-2 hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] transition-all"
            >
              Sudah Punya Akun?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
