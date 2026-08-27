import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Template from "@/models/Template";
import { auth } from "@/auth";

export async function GET() {
  await connectDB();
  const templates = await Template.find().sort({ createdAt: -1 });
  return NextResponse.json(templates);
}

export async function POST(req) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  await connectDB();
  const body = await req.json();

  const {
    name,
    html,
    css,
    thumbnailUrl,
    hasBackgroundImage,
    defaultTaxEnabled,
    defaultDiscountEnabled,
  } = body;

  if (!name || !html || !css || !thumbnailUrl) {
    return NextResponse.json(
      { error: "name, html, css, thumbnailUrl are required" },
      { status: 400 }
    );
  }

  const template = await Template.create({
    name,
    html,
    css,
    thumbnailUrl,
    hasBackgroundImage: !!hasBackgroundImage,
    defaultTaxEnabled: !!defaultTaxEnabled,
    defaultDiscountEnabled: !!defaultDiscountEnabled,
  });

  return NextResponse.json(template, { status: 201 });
}