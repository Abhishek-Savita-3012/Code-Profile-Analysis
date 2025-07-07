import axios from 'axios';
import * as cheerio from 'cheerio';
import HackerRankProfile from './models/HackerRankProfile.js'; 
import UserProfile from './models/UserProfile.js'; 

async function scrapeHackerRank(username, userID) {
  try {
    const url = `https://www.hackerrank.com/${username}`;
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(data);

    const profileName = $('hr-heading-02 profile-title ellipsis').text().trim();
    const skills = [];
    $('.hr-flex.hr-align-center.profile-skills-tags .profile-skills-tag').each((i, el) => {
      skills.push($(el).text().trim());
    });
    const education = $('.timeline-item-title.hr-heading-05').text().trim();
    const github = $('a[href*="github"]').attr('href') || null;
    const linkedin = $('a[href*="linkedin"]').attr('href') || null;

    const profileData = {
      profileName : username,
      skills,
      education,
      github,
      linkedin
    };

    await HackerRankProfile.findOneAndUpdate(
      { profileName },
      profileData,
      { upsert: true, new: true }
    );

    await UserProfile.findOneAndUpdate(
      { userId: userID },
      { $set: { hackerrank: profileData } },
      { upsert: true, new: true }
    );

    return profileData;
  } catch (err) {
    console.error("Error scraping HackerRank:", err.message);
    return { error: 'Failed to fetch HackerRank data' };
  }
}

export default scrapeHackerRank;
