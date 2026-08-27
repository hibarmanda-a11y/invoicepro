import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    downloads: [
      {
        templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template" },
        templateName: String,
        invoiceNumber: String,
        downloadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
