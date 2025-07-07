## **💻 Code Profile Analysis - Skill Ranking System**
A full-stack web application that analyzes and ranks a user’s coding performance across multiple competitive programming platforms like LeetCode, GeeksforGeeks, Codeforces, HackerRank, HackerEarth, and Coding Ninjas using real-time data and machine learning.

## **🚀 Features**
- 🔐 User Signup and Login (JWT-based authentication)
- 📊 Real-time data fetching from:
  - LeetCode (GraphQL)
  - GeeksforGeeks
  - Codeforces
  - HackerRank
  - HackerEarth
  - Coding Ninjas

- #### **📈 Dashboard with:** (In progress)
  - Questions solved
  - Time complexity
  - Language analysis
  - Code efficiency insights

- 🤖 NLP-based code review and ML-driven skill ranking (In progress)
- 🔁 Password reset functionality (In progress)

## **🧠 Tech Stack**
**Frontend**
- HTML, CSS, JavaScript
**Backend**
- Node.js + Express.js
- JWT (Authentication)
- bcrypt.js (Password hashing)
**Database**
- MongoDB (Mongoose)
**Machine Learning**
- Python (for code analysis, ranking, NLP review)

## **🏗️ Project Architecture**
<pre lang="markdown">
```
CodeProfileAnalysis/
├── backend/
│ ├── models/
│ │ ├── CodeforcesProfile.js
│ │ ├── CodingNinjasProfile.js
│ │ ├── GFGProfile.js
│ │ ├── HackerRackProfile.js
│ │ ├── LeetcodeProfile.js
│ │ ├── User.js
│ │ └── UserProfile.js
│ ├── routes/
│ │ └── auth.js
│ ├── scrapeCodeforces.js
│ ├── scrapeCodingNinjas.js
│ ├── scrapeHackerRank.js
│ ├── scrapeGeeksForGeeks.js
│ ├── scraperLeetcode.js
│ └── server.js
│
├── frontend/
│ ├── css/
│ │ └── style.css
│ ├── js/
│ │ ├── authentication.js
│ │ └── script.js
│ └── index.html
```</pre>

## **🔧 Installation & Setup**
**1. Clone the repository :** <br>
git clone https://github.com/your-username/CodeProfileAnalysis.git <br>
cd CodeProfileAnalysis<br>
<br>
**2. Install backend dependencies :** <br>
cd backend<br>
npm install<br>
<br>
**3. Setup MongoDB :** <br>
•	Create a local or Atlas MongoDB database.<br>
•	Update the MongoDB URI in server.js:<br>
mongoose.connect('mongodb://localhost:27017/code_profile');<br>
<br>
**4. Start the backend server :** <br>
node server.js<br>
<br>
**5. Open the frontend :** <br>
Open frontend/index.html or frontend/login.html in your browser using Live Server or a static server.<br>
<br>
## **🌐 APIs Used**
**Platform	      Integration** <br>
LeetCode	        GraphQL API <br>
Codeforces	      Official REST API <br>
GFG / Others	    Web scraping / unofficial APIs <br>

## **🤝 Contributing**
Contributions, issues and feature requests are welcome!

## **✨ Acknowledgements**
•	LeetCode GraphQL<br>
•	Codeforces API<br>
•	OpenAI GPT for code insights<br>



