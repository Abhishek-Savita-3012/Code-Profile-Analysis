import mongoose from 'mongoose';

const GFGProfileSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  codingScore: String,
  problemsSolved: String,
  contestRating: String,
  institution: String,
  ranking: String,
  languageUsed: String,
  userHandle: String,
  streakCount: String
}, { timestamps: true });

const GFGProfile = mongoose.model('GFGProfile', GFGProfileSchema);
export default GFGProfile;
