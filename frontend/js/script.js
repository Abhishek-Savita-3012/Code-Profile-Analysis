//const userEmail = document.getElementById("loginEmail").value.trim();
//const userEmail = localStorage.getItem('email');

function handlePlatformChange() {
    const platform = document.getElementById("platformSelect").value;
    const sections = document.querySelectorAll(".platform-section");
    sections.forEach(section => section.style.display = "none");

    const sectionId = {
        leetcode: "leetcodeSection",
        gfg: "gfgSection",
        hackerrank: "hackerrankSection",
        codingninjas: "codingninjasSection",
        codeforces: "codeforcesSection"
    }[platform];

    if (sectionId) document.getElementById(sectionId).style.display = "block";
}

async function fetchLeetCodeProfile() {
    const username = document.getElementById("usernameInput").value.trim();
    const userEmail = localStorage.getItem('email'); // ✅ Correct this line

    if (!username) return alert("Please enter a username.");
    if (!userEmail) return alert("You must be logged in to fetch data.");

    try {
        const response = await fetch(`http://127.0.0.1:5000/api/leetcode/${username}?email=${userEmail}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Received data:", data);

        if (data?.username) {
            document.getElementById("leetAvatar").src = data.avatar || "";
            document.getElementById("leetUsername").innerText = data.realName || "N/A";
            document.getElementById("leetRanking").innerText = `Global Ranking: ${data.ranking || "N/A"}`;
            document.getElementById("leetEasy").innerText = data.solvedCount.easy || "0";
            document.getElementById("leetMedium").innerText = data.solvedCount.medium || "0";
            document.getElementById("leetHard").innerText = data.solvedCount.hard || "0";
            document.getElementById("leetProfile").style.display = "block";
        } else {
            alert("LeetCode user not found!");
        }
    } catch (error) {
        console.error('❌ Error:', error);
        alert("Failed to fetch LeetCode profile.");
    }
}


async function scrapeGFGProfile() {
    const username = document.getElementById("gfgUsername").value;
    const userEmail = localStorage.getItem('email'); // ✅ Correct this line

    if (!username) {
        alert("Please enter a valid username");
        return;
    }

    document.getElementById("result").innerHTML = "Fetching data...";

    try {
        //const response = await fetch(`http://localhost:5000/scrapeGFG?username=${encodeURIComponent(username)}?email=${userEmail}`);
        const response = await fetch(`http://localhost:5000/scrapeGFG?username=${encodeURIComponent(username)}&email=${userEmail}`);

        const data = await response.json();
        console.log(data);

        if (data.error) {
            document.getElementById("result").innerHTML = `<p style="color: red;">${data.error}</p>`;
            return;
        }

        document.getElementById("result").innerHTML = `
            <h3>Profile Data</h3>
            <p><strong>Username:</strong> ${data.username}</p>
            <p><strong>Coding Score:</strong> ${data.codingScore}</p>
            <p><strong>Problems Solved:</strong> ${data.problemsSolved}</p>
            <p><strong>Contest Rating:</strong> ${data.contestRating}</p>
            <p><strong>Institution:</strong> ${data.institution}</p>
            <p><strong>Ranking:</strong> ${data.ranking}</p>
            <p><strong>Language Used:</strong> ${data.languageUsed}</p>
            <p><strong>User Handle:</strong> ${data.userHandle}</p>
            <p><strong>Streak Count:</strong> ${data.streakCount}</p>
        `;
    } catch (error) {
        document.getElementById("result").innerHTML = `<p style="color: red;">Error fetching data</p>`;
    }
}

async function scrapeHackerRankProfile() {
    const username = document.getElementById('hackerrankUsername').value;
    const userEmail = localStorage.getItem('email'); // ✅ Correct this line

    if (!username) {
        alert('Please enter a HackerRank username');
        return;
    }

    try {
        //const response = await fetch('http://localhost:5000/fetch-hackerrank?email=${userEmail}', {
        const response = await fetch(`http://localhost:5000/fetch-hackerrank?email=${userEmail}`, {

            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });

        const data = await response.json();

        if (data.error) {
            document.getElementById('hackerrankResult').innerHTML = `<p style="color:red;">${data.error}</p>`;
            return;
        }

        const resultHTML = `
            <p><strong>Username:</strong> ${data.profileName}</p>
            <p><strong>Education:</strong> ${data.education || 'N/A'}</p>
            <p><strong>Skills:</strong> ${data.skills?.join(', ') || 'N/A'}</p>
            <p><strong>GitHub:</strong> ${data.github ? `<a href="${data.github}" target="_blank">${data.github}</a>` : 'N/A'}</p>
            <p><strong>LinkedIn:</strong> ${data.linkedin ? `<a href="${data.linkedin}" target="_blank">${data.linkedin}</a>` : 'N/A'}</p>
        `;

        document.getElementById('hackerrankResult').innerHTML = resultHTML;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('hackerrankResult').innerHTML = `<p style="color:red;">Something went wrong!</p>`;
    }
}

async function scrapeCodingNinjasProfile() {
    const username = document.getElementById("codingNinjasUsername").value.trim();
    const userEmail = localStorage.getItem('email');
    const resultDiv = document.getElementById("codingNinjasResult");

    resultDiv.innerHTML = `<p><em>Fetching data...</em></p>`;

    if (!username) {
        resultDiv.innerHTML = "<p>Please enter a CodingNinjas username.</p>";
        return;
    }

    if (!userEmail) {
        resultDiv.innerHTML = "<p>Error: User email not found. Please log in again.</p>";
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/codingninjas/${username}?email=${userEmail}`);
        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
        } else {
            resultDiv.innerHTML = `
                <h3>Profile Info:</h3>
                <p><strong>Username:</strong> ${data.username}</p>
                <p><strong>University:</strong> ${data.university || 'N/A'}</p>
                <p><strong>Problem Submissions:</strong> ${data.problemSubmissions || 0}</p>
                <p><strong>Current Streak:</strong> ${data.currentStreak || 0}</p>
                <p><strong>Longest Streak:</strong> ${data.maxStreak || 0}</p>
                <p><strong>Easy Questions:</strong> ${data.easy || 0}</p>
                <p><strong>Moderate Questions:</strong> ${data.moderate || 0}</p>
                <p><strong>Hard Questions:</strong> ${data.hard || 0}</p>
                <p><strong>Ninja Questions:</strong> ${data.ninja || 0}</p>
            `;
        }
    } catch (err) {
        resultDiv.innerHTML = `<p style="color:red;">Error fetching profile data. Please try again later.</p>`;
        console.error("Error:", err);
    }
}


async function scrapeCodeforcesProfile() {
    const username = document.getElementById("codeforcesUsername").value.trim();
    const userEmail = localStorage.getItem('email'); // ✅ Correct this line

    const resultDiv = document.getElementById("codeforcesResult");

    if (!username) {
        resultDiv.innerHTML = "<p>Please enter a Codeforces username.</p>";
        return;
    }

    resultDiv.innerHTML = "Fetching data...";

    try {
        const response = await fetch(`http://localhost:5000/codeforces/${username}?email=${userEmail}`);
        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<p style="color:red;">${data.error}</p>`;
            return;
        }

        resultDiv.innerHTML = `
            <h3>Codeforces Profile Info:</h3>
            <p><strong>Username:</strong> ${data.username}</p>
            <p><strong>Contribution:</strong> ${data.contribution}</p>
            <p><strong>Problems Solved (All Time):</strong> ${data.problemsSolvedAllTime}</p>
            <p><strong>Problems Solved (Last Year):</strong> ${data.problemsSolvedLastYear}</p>
            <p><strong>Problems Solved (Last Month):</strong> ${data.problemsSolvedLastMonth}</p>
            <p><strong>Max Streak (All Time):</strong> ${data.maxStreakAllTime}</p>
            <p><strong>Max Streak (Last Year):</strong> ${data.maxStreakLastYear}</p>
            <p><strong>Max Streak (Last Month):</strong> ${data.maxStreakLastMonth}</p>
        `;
    } catch (error) {
        console.error("Error fetching Codeforces data:", error);
        resultDiv.innerHTML = `<p style="color:red;">Failed to fetch Codeforces profile.</p>`;
    }
}

async function getCodingInsights() {
    const userId = localStorage.getItem("userId"); // Assume stored on login

    if (!userId) {
        alert("Please login first.");
        return;
    }

    const res = await fetch("/api/predict-proficiency", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
    });

    const data = await res.json();

    if (res.ok) {
        document.getElementById("proficiencyResult").innerText =
            `Predicted Proficiency: ${data.proficiency}`;
    } else {
        alert("Error: " + data.message);
    }
}

