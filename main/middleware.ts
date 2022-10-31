import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const isInBeta = JSON.parse(req.cookies.get("beta") || "false");
  req.nextUrl.pathname = isInBeta ? "/beta" : "/";
  return NextResponse.rewrite(req.nextUrl);
}

// Supports both a single value or an array of matches
export const config = {
  matcher: "/",
};
