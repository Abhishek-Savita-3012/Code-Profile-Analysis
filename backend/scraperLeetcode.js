import axios from 'axios';
import LeetCodeProfile from './models/LeetcodeProfile.js';
import UserProfile from './models/UserProfile.js'; 

async function fetchLeetCodeData(username, userID) {
    const url = "https://leetcode.com/graphql";
    const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
          ranking
        }
        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

    const variables = { username };  // Ensure 'username' is passed correctly

    try {
        const response = await axios.post(
            url,
            { query, variables },  // Correctly pass the 'variables'
            {
                headers: {
                    "Content-Type": "application/json",
                    "Referer": `https://leetcode.com/${username}/`
                }
            }
        );

        if (response.data.errors) {
            console.error("GraphQL errors:", response.data.errors);
            return null;
        }

        const data = response.data?.data?.matchedUser;
        if (!data) return null;

        const solvedCount = {
            easy: 0,
            medium: 0,
            hard: 0
        };
        data.submitStats.acSubmissionNum.forEach(stat => {
            if (stat.difficulty === "Easy") solvedCount.easy = stat.count;
            else if (stat.difficulty === "Medium") solvedCount.medium = stat.count;
            else if (stat.difficulty === "Hard") solvedCount.hard = stat.count;
        });

        await LeetCodeProfile.findOneAndUpdate(
            { username: data.username },
            {
                username: data.username,
                realName: data.profile.realName,
                userAvatar: data.profile.userAvatar,
                ranking: data.profile.ranking,
                solvedCount
            },
            { upsert: true, new: true }
        );

        await UserProfile.findOneAndUpdate(
            { userId: userID },
            { $set: { leetcode: { username: data.username, realName: data.profile.realName, userAvatar: data.profile.userAvatar, ranking: data.profile.ranking, solvedCount } } },
            { upsert: true, new: true }
        );

        return {
            username: data.username,
            realName: data.profile.realName,
            avatar: data.profile.userAvatar,
            ranking: data.profile.ranking,
            solvedCount
        };

    } catch (error) {
        console.error("Error fetching LeetCode data:", error.response?.data || error.message);
        return null;
    }
}

export default fetchLeetCodeData;
