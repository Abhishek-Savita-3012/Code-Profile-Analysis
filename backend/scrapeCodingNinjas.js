import puppeteer from 'puppeteer';
import CodingNinjasProfile from './models/CodingNinjasProfile.js'; 
import UserProfile from './models/UserProfile.js'; 

async function scrapeCodingNinjas(username, userID) {
    const browser = await puppeteer.launch({
        headless: false,
        timeout: 60000,
    });

    const page = await browser.newPage();
    const url = `https://www.codingninjas.com/studio/profile/${username}`;
    await page.goto(url, { waitUntil: 'load' });

    try {
        await page.waitForSelector('.profile-user-name', { timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 5000));

        const data = await page.evaluate(() => {
            const getText = (selector) => {
                const el = document.querySelector(selector);
                return el ? el.innerText.trim() : 'NA';
            };

            const username = getText('.profile-user-name');
            const university = getText('.profile-user-about-section-item-text');

            const problemSubmissionsEl = document.querySelectorAll('.zen-typo-caption-medium');
            const problemSubmissions = problemSubmissionsEl.length >= 1
                ? problemSubmissionsEl[0].innerText.match(/\d+/)?.[0] || '0'
                : '0';

            const streakValues = Array.from(document.querySelectorAll('.day-count-text')).map(el => el.innerText.trim());
            const currentStreak = streakValues[0] || '0';
            const maxStreak = streakValues[1] || '0';

            const difficulties = {
                easy: '0',
                moderate: '0',
                hard: '0',
                ninja: '0'
            };

            const difficultyBlocks = document.querySelectorAll('div.difficulty.ng-star-inserted');
            difficultyBlocks.forEach(block => {
                const title = block.querySelector('.title')?.innerText.trim().toLowerCase();
                const value = block.querySelector('.value')?.innerText.trim() || '0';
                if (title && difficulties.hasOwnProperty(title)) {
                    difficulties[title] = value;
                }
            });

            return {
                username,
                university,
                problemSubmissions,
                currentStreak,
                maxStreak,
                ...difficulties
            };
        });

        // Save to DB
        await CodingNinjasProfile.findOneAndUpdate(
            { username: data.username },
            data,
            { upsert: true, new: true }
        );

        await UserProfile.findOneAndUpdate(
            { userId: userID },
            { $set: { codingNinjas: data } },
            { upsert: true, new: true }
        );

        await browser.close();
        return data;

    } catch (error) {
        console.error("Error scraping profile:", error);
        await browser.close();
        return {
            username: 'NA',
            university: 'NA',
            problemSubmissions: '0',
            currentStreak: '0',
            maxStreak: '0',
            easy: '0',
            moderate: '0',
            hard: '0',
            ninja: '0'
        };
    }
}

export default scrapeCodingNinjas;

