import { NextResponse } from "next/server";
import { uploadBufferToCloudinary } from "@/lib/cloudinary";
import { auth } from "@/auth";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") || "invoicepro").toString();

    // Only admins can upload to thumbnails folder
    if (folder.includes("thumbnails") && session.user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required for template thumbnails." }, { status: 403 });
    }

    // Allowed user folders: logo, signature, general invoicepro assets
    const isAllowedFolder =
      folder === "invoicepro" ||
      folder.startsWith("invoicepro/logo") ||
      folder.startsWith("invoicepro/signature") ||
      folder.startsWith("invoicepro/thumbnails");

    if (!isAllowedFolder) {
      return NextResponse.json({ error: "Invalid upload target folder." }, { status: 400 });
    }

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // File validation: Size limit 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 5MB limit." }, { status: 400 });
    }

    // File validation: Image MIME types
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    if (file.type && !allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Please upload a PNG, JPG, WEBP, or SVG image." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadBufferToCloudinary(buffer, folder);

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}