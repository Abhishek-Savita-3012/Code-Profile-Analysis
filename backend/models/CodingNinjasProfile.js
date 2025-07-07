import mongoose from 'mongoose';

const CodingNinjasProfileSchema = new mongoose.Schema({
  username: { type: String, required: true },
  university: String,
  problemSubmissions: String,
  currentStreak: String,
  maxStreak: String,
  easy: String,
  moderate: String,
  hard: String,
  ninja: String
}, { timestamps: true });

const CodingNinjasProfile = mongoose.model('CodingNinjasProfile', CodingNinjasProfileSchema);
export default CodingNinjasProfile;
