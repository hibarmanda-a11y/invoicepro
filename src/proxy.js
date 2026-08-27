import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((request) => {
  const { pathname, search } = request.nextUrl;
  const user = request.auth?.user;
  const callbackUrl = `${pathname}${search}`;
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", callbackUrl);

  if (pathname === "/profile" || pathname.startsWith("/profile/")) {
    if (!user) return NextResponse.redirect(loginUrl);
    return NextResponse.redirect(new URL(user.role === "admin" ? "/admin" : "/userprofile", request.url));
  }

  if (pathname.startsWith("/admin") && user?.role !== "admin") {
    if (!user) return NextResponse.redirect(loginUrl);
    return NextResponse.redirect(new URL("/userprofile", request.url));
  }

  if (pathname.startsWith("/userprofile") && !user) {
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = { matcher: ["/admin/:path*", "/userprofile/:path*", "/profile/:path*"] };
