import mongoose from 'mongoose';

const CodeforcesProfileSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  contribution: Number,
  problemsSolvedAllTime: Number,
  problemsSolvedLastYear: Number,
  problemsSolvedLastMonth: Number,
  maxStreakAllTime: Number,
  maxStreakLastYear: Number,
  maxStreakLastMonth: Number
}, { timestamps: true });

const CodeforcesProfile = mongoose.model('CodeforcesProfile', CodeforcesProfileSchema);
export default CodeforcesProfile;
