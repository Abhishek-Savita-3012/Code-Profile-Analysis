import mongoose from 'mongoose';

const HackerRankProfileSchema = new mongoose.Schema({
  profileName: { type: String, required: true },
  skills: [String],
  education: String,
  github: String,
  linkedin: String
}, { timestamps: true });

const HackerRankProfile = mongoose.model('HackerRankProfile', HackerRankProfileSchema);
export default HackerRankProfile;
