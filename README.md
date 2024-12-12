# Communication Assessment Tool

## Overview
The Communication Assessment Tool is an AI-driven web application designed to analyze and provide feedback on communication skills. Users can record video inputs directly from their browser, which are processed by an AI server to deliver actionable insights for improvement.

## Features
- **Video Recording**: Record communication samples in-browser.
- **AI Analysis**: Videos are analyzed for strengths and improvement areas.
- **Feedback Reports**: Download detailed assessments and improvement plans.

## Technologies
- **Frontend**: React (Vite), CSS Modules, `react-toastify`, `html2canvas`, `jsPDF`
- **Backend**: Node.js, MongoDB, AI-based video processing

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/communication-assessment-tool.git
   cd communication-assessment-tool
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add a `.env` file with:
   ```env
   REACT_APP_API_BASE_URL=<backend-url>
   MONGO_URI=<mongodb-uri>
   AI_SERVER_URL=<ai-server-url>
   ```
4. Start the app:
   ```bash
   npm run dev
   ```

## Usage
1. **Authenticate**: Sign up or log in.
2. **Record**: Capture communication videos.
3. **Analyze**: Submit videos for AI-driven feedback.
4. **Review**: Download feedback reports.

## Contact
For support, email [lemon10swargiary@gmail.com].

