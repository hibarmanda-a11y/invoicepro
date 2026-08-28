import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    let user = null;
    if (session.user?.id && mongoose.isValidObjectId(session.user.id)) {
      user = await User.findById(session.user.id).select("-password").lean();
    }
    if (!user && session.user?.email) {
      user = await User.findOne({ email: session.user.email.toLowerCase() }).select("-password").lean();
    }
    return NextResponse.json(user || { error: "User not found" }, { status: user ? 200 : 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
