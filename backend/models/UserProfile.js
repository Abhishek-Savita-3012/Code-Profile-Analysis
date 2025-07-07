// models/UserProfile.js
import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  userId :{ type: String, required: true },

  leetcode: {
    username: String,
    realName: String,
    userAvatar: String,
    ranking: Number,
    solvedCount: {
      easy: Number,
      medium: Number,
      hard: Number
    }
  },

  hackerrank: {
    profileName: String,
    skills: [String],
    education: String,
    github: String,
    linkedin: String
  },

  gfg: {
    username: String,
    codingScore: String,
    problemsSolved: String,
    contestRating: String,
    institution: String,
    ranking: String,
    languageUsed: String,
    userHandle: String,
    streakCount: String
  },

  codingNinjas: {
    username: String,
    university: String,
    problemSubmissions: String,
    currentStreak: String,
    maxStreak: String,
    easy: String,
    moderate: String,
    hard: String,
    ninja: String
  },

  codeforces: {
    username: String,
    contribution: Number,
    problemsSolvedAllTime: Number,
    problemsSolvedLastYear: Number,
    problemsSolvedLastMonth: Number,
    maxStreakAllTime: Number,
    maxStreakLastYear: Number,
    maxStreakLastMonth: Number
  }
}, { timestamps: true });

const UserProfile = mongoose.model('UserProfile', UserProfileSchema);
export default UserProfile;
