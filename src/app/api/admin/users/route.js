import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  await connectDB();
  const users = await User.find().select("name email role createdAt").sort({ createdAt: -1 }).lean();
  return NextResponse.json({ users, total: users.length });
}

export async function PATCH(request) {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const { id, role } = await request.json();
  if (!id || !["user", "admin"].includes(role)) return NextResponse.json({ error: "Valid user and role are required" }, { status: 400 });
  await connectDB();
  const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("name email role");
  return NextResponse.json(user);
}
