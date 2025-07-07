import axios from 'axios';
import { JSDOM } from 'jsdom';
import GFGProfile from './models/GFGProfile.js'; 
import UserProfile from './models/UserProfile.js'; 

async function scraperGFGData(username, userID) {
  try {
    const url = `https://auth.geeksforgeeks.org/user/${username}/`;
    const response = await axios.get(url);
    
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    const usernameText = document.querySelector('.profilePicSection_head_userHandle__oOfFy')?.textContent.trim() || "N/A";
    const rankingText = document.querySelector('.educationDetails_head_left_userRankContainer--text__wt81s')?.textContent.trim() || "N/A";
    const streakCount = document.querySelector('.circularProgressBar_head_mid_streakCnt__MFOF1.tooltipped')?.textContent.trim() || "N/A";

    const data = {
      username: usernameText,
      codingScore: document.querySelector('.scoreCard_head_left--score__oSi_x')?.textContent.trim() || "N/A",
      problemsSolved: document.querySelectorAll('.scoreCard_head_left--score__oSi_x')[1]?.textContent.trim() || "N/A",
      contestRating: document.querySelectorAll('.scoreCard_head_left--score__oSi_x')[2]?.textContent.trim() || "N/A",
      institution: document.querySelector('.educationDetails_head_left--text__tgi9I')?.textContent.trim() || "N/A",
      ranking: rankingText,
      languageUsed: document.querySelector('.educationDetails_head_right--text__lLOHI')?.textContent.trim() || "N/A",
      userHandle: usernameText,
      streakCount: streakCount
    };

    await GFGProfile.findOneAndUpdate(
      { username: data.username },
      data,
      { upsert: true, new: true }
    );

    await UserProfile.findOneAndUpdate(
      { userId: userID },
      { $set: { gfg: data } },
      { upsert: true, new: true }
    );

    return data;

  } catch (error) {
    throw new Error("Error extracting data: " + error.message);
  }
}

export default scraperGFGData;
