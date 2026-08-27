import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    html: { type: String, required: true },
    css: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    hasBackgroundImage: { type: Boolean, default: false },
    defaultTaxEnabled: { type: Boolean, default: false },
    defaultDiscountEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Template ||
  mongoose.model("Template", TemplateSchema);