import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    skills: [String],
    experience: Number,
    isActive: {
      type: Boolean,
      default: true,
    },
    employer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["pending", "reviewed", "accepted", "rejected"],
          default: "pending",
        },
        resume: String,
        coverLetter: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Job = mongoose.model("Job", jobSchema);
