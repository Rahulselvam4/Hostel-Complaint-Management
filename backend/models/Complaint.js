import mongoose from "mongoose";
const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    issueCategory: {
      type: String,
      enum: ["Electrical", "Plumbing", "Carpentry", "Cleaning", "Other"],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: { type: String, required: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Emergency"],
      default: "Low",
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved"],
      default: "Pending",
    },
    photo: { type: String }, // URL or filename if stored
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
    },
    resolvedAt: Date,
  },
  { timestamps: true }
);
complaintSchema.index({ status: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ student: 1 });
complaintSchema.index({ worker: 1 });
complaintSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "Resolved") {
    this.resolvedAt = new Date();
  }
  next();
});

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
