import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Template from "@/models/Template";

export async function GET() {
  await connectDB();
  const templates = await Template.find().sort({ createdAt: -1 });
  return NextResponse.json(templates);
}

export async function POST(req) {
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