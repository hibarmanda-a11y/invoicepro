import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Template from "@/models/Template";
import { auth } from "@/auth";

export async function GET(req, { params }) {
  await connectDB();
  const { id } = await params;
  const template = await Template.findById(id);

  if (!template) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(template);
}

export async function DELETE(req, { params }) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  await connectDB();
  const { id } = await params;
  const deleted = await Template.findByIdAndDelete(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}