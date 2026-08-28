import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Template from "@/models/Template";
import mongoose from "mongoose";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { templateId, invoiceNumber } = await request.json();
    await connectDB();
    const template = await Template.findById(templateId).select("name");
    if (!template) return NextResponse.json({ error: "Template not found" }, { status: 404 });

    const query = (session.user?.id && mongoose.isValidObjectId(session.user.id))
      ? { _id: session.user.id }
      : { email: session.user.email.toLowerCase() };

    await User.findOneAndUpdate(query, {
      $push: { downloads: { templateId, templateName: template.name, invoiceNumber } }
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
