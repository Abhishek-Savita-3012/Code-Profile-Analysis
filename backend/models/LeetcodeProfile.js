import mongoose from 'mongoose';

const LeetCodeProfileSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  realName: String,
  userAvatar: String,
  ranking: Number,
  solvedCount: {
    easy: Number,
    medium: Number,
    hard: Number
  }
}, { timestamps: true });

const LeetCodeProfile = mongoose.model('LeetCodeProfile', LeetCodeProfileSchema);
export default LeetCodeProfile;
