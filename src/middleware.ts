import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./actions/session";

const adminProtectedRoutes = [
  "/admin",
  "/admin/bills",
  "/admin/customers",
  "/admin/installation-request",
  "/admin/reports",
  "/admin/complaints",
  "/admin/settings",
  "/admin/profile",
  "/admin/notifications",
];
const adminPublicRoutes = ["/admin/login"];
const userProtectedRoutes = [
  "/dashboard",
  "/bills",
  "/complaints",
  "/installations",
  "/notifications",
  "/profile",
];
const userPublicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isAdminProtected = adminProtectedRoutes.includes(path);
  const isAdminPublic = adminPublicRoutes.includes(path);
  const isUserProtected = userProtectedRoutes.includes(path);
  const isUserPublic = userPublicRoutes.includes(path);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", path);
  requestHeaders.set("x-url", req.nextUrl.href);

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (isAdminProtected) {
    if (!session?.userId || session?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", req.nextUrl));
    }
  }
  if (isAdminPublic && session?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  if (isUserProtected) {
    if (!session?.userId || session?.role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }
  if (isUserPublic && session?.role === "CUSTOMER") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
