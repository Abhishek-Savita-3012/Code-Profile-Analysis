import fetch from 'node-fetch';
import CodeforcesProfile from './models/CodeforcesProfile.js';
import UserProfile from './models/UserProfile.js'; 

async function fetchCodeforcesData(username, userID) {
    try {
        const userInfoRes = await fetch(`https://codeforces.com/api/user.info?handles=${username}`);
        const userInfo = await userInfoRes.json();
        if (userInfo.status !== 'OK') throw new Error('User not found');

        const user = userInfo.result[0];
        const handle = user.handle;
        const contribution = user.contribution;

        const submissionsRes = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
        const submissionsJson = await submissionsRes.json();
        if (submissionsJson.status !== 'OK') throw new Error('Unable to fetch submissions');

        const submissions = submissionsJson.result;
        const now = new Date();
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const allProblems = new Set();
        const problemsLastYear = new Set();
        const problemsLastMonth = new Set();
        const submissionDates = new Set();

        for (let sub of submissions) {
            if (sub.verdict === "OK") {
                const pid = `${sub.problem.contestId}-${sub.problem.index}`;
                const subDate = new Date(sub.creationTimeSeconds * 1000);
                const subDateStr = subDate.toISOString().split("T")[0];

                allProblems.add(pid);
                submissionDates.add(subDateStr);

                if (subDate >= oneYearAgo) problemsLastYear.add(pid);
                if (subDate >= oneMonthAgo) problemsLastMonth.add(pid);
            }
        }

        function calculateStreak(datesSet) {
            const sortedDates = Array.from(datesSet).sort();
            let maxStreak = 0;
            let currentStreak = 0;
            let prevDate = null;

            for (let dateStr of sortedDates) {
                const date = new Date(dateStr);
                if (!prevDate) {
                    currentStreak = 1;
                } else {
                    const diff = (date - prevDate) / (1000 * 60 * 60 * 24);
                    currentStreak = diff === 1 ? currentStreak + 1 : 1;
                }
                if (currentStreak > maxStreak) maxStreak = currentStreak;
                prevDate = date;
            }
            return maxStreak;
        }

        const maxStreakAllTime = calculateStreak(submissionDates);
        const maxStreakLastYear = calculateStreak(
            new Set([...submissionDates].filter(date => new Date(date) >= oneYearAgo))
        );
        const maxStreakLastMonth = calculateStreak(
            new Set([...submissionDates].filter(date => new Date(date) >= oneMonthAgo))
        );

        const result = {
            username: handle,
            contribution,
            problemsSolvedAllTime: allProblems.size,
            problemsSolvedLastYear: problemsLastYear.size,
            problemsSolvedLastMonth: problemsLastMonth.size,
            maxStreakAllTime,
            maxStreakLastYear,
            maxStreakLastMonth
        };

        await CodeforcesProfile.findOneAndUpdate(
            { username: handle },
            result,
            { upsert: true, new: true }
        );

        await UserProfile.findOneAndUpdate(
            { userId: userID },
            { $set: { codeforces: result } },
            { upsert: true, new: true }
        );

        return result;

    } catch (error) {
        console.error("Error fetching Codeforces data:", error.message);
        return null;
    }
}

export default fetchCodeforcesData;
