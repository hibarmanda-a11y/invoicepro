import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Template from "@/models/Template";
import User from "@/models/User";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  await connectDB();
  const [templates, users, downloads] = await Promise.all([Template.countDocuments(), User.countDocuments(), User.aggregate([{ $project: { count: { $size: { $ifNull: ["$downloads", []] } } } }, { $group: { _id: null, total: { $sum: "$count" } } }])]);
  return NextResponse.json({ templates, users, downloads: downloads[0]?.total || 0 });
}
