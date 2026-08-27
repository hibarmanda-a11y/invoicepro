import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  const { name, email, password } = await request.json();
  if (!name || !email || !password || password.length < 6) return NextResponse.json({ error: "Name, email and a 6+ character password are required." }, { status: 400 });
  await connectDB();
  const normalizedEmail = email.toLowerCase().trim();
  if (await User.exists({ email: normalizedEmail })) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  const role = process.env.ADMIN_EMAIL?.toLowerCase().trim() === normalizedEmail ? "admin" : "user";
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 12), role });
  return NextResponse.json({ id: user._id.toString() }, { status: 201 });
}
