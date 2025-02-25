import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema({
  title: {
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
  employer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  applications: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const Job = mongoose.model("Job", jobSchema);
