import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Template from "@/models/Template";

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { templateId, invoiceNumber } = await request.json();
  await connectDB();
  const template = await Template.findById(templateId).select("name");
  if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });
  await User.findByIdAndUpdate(session.user.id, { $push: { downloads: { templateId, templateName: template.name, invoiceNumber } } });
  return NextResponse.json({ ok: true });
}
