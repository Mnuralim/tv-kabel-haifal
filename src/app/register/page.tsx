import { RegisterForm } from "./_components/register-form";

export default async function RegisterPage() {
  return (
    <div className="min-h-screen z-50 fixed w-full top-0 left-0 overflow-hidden flex items-center justify-center bg-neutral-100 p-4">
      <div className="absolute top-10 right-10 w-16 h-16 bg-red-500 rounded-md border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hidden md:block" />
      <div className="absolute bottom-10 left-10 w-24 h-12 bg-emerald-500 rounded-md border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hidden md:block" />
      <div className="absolute top-1/4 left-20 w-8 h-8 bg-orange-400 rounded-md border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hidden md:block" />
      <div className="absolute bottom-1/3 right-20 w-10 h-10 bg-yellow-400 rounded-md border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hidden md:block" />
      <div className="w-full max-w-md relative z-10">
        <RegisterForm />
      </div>
    </div>
  );
}
