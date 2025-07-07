import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import scraperGFGData from './scraperGeeksForGeeks.js';
import fetchLeetCodeData from './scraperLeetcode.js';
import scrapeHackerRank from './scrapeHackerRank.js';
import scrapeCodingNinjas from './scrapeCodingNinjas.js';
import scrapeCodeforces from './scrapeCodeforces.js';
import authRoutes from './routes/auth.js';
import User from './models/User.js'; 

import predictProficiencyRoute from './routes/predictProficiency.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/codeprofileslookup')
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.use('/api/auth', authRoutes);

app.use('/api', predictProficiencyRoute);

//LeetCode
app.get('/api/leetcode/:username', async (req, res) => {
    const { username } = req.params;
    const { email } = req.query; 

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const userId = user.userId;
        const data = await fetchLeetCodeData(username, userId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

//GFG
app.get('/scrapeGFG', async (req, res) => {
    const { username} = req.query;
    const { email } = req.query; 
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const userId = user.userId;
        const data = await scraperGFGData(username, userId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to scrape data", details: error.message });
    }
});

//HackerRank
app.post('/fetch-hackerrank', async (req, res) => {
    const { username} = req.body;
    const { email } = req.query; 

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const userId = user.userId;
        const data = await scrapeHackerRank(username, userId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching HackerRank profile", details: error.message });
    }
});

//Coding Ninjas
app.get('/codingninjas/:username', async (req, res) => {
    const { username } = req.params;
    const { email } = req.query;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const userId = user.userId;
        const data = await scrapeCodingNinjas(username, userId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching CodingNinjas profile', details: error.message });
    }
});

//Codeforces
app.get('/codeforces/:username', async (req, res) => {
    const { username } = req.params;
    const { email } = req.query;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const userId = user.userId;
        const data = await scrapeCodeforces(username, userId);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
