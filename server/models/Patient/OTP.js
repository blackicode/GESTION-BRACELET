import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
