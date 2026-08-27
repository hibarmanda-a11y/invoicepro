import { NextResponse } from "next/server";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "invoicepro";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadBufferToCloudinary(buffer, folder);

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}