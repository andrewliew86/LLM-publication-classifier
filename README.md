# 🧬 Clinical Trial Analyzer

This tool helps identify whether research papers are clinical trials by leveraging OpenAI's GPT-4o model. You can upload a CSV file containing paper titles and abstracts, and the model will return a simple **"Yes" or "No"** answer for each paper. The prompt used for analysis can be customized to fit your research needs.

## ⚠️ Disclaimer

This is a bare-bones prototype, “vibe-coded” using GPT-4o to explore a proof of concept. It is not production-ready — there's minimal validation, no unit tests and the app runs entirely in-browser!

---

## 🔍 How It Works

- Upload a CSV file with the following columns: `ID`, `title`, `abstract`
- Enter your OpenAI API key (kept local to your browser)
- Customize the GPT prompt question if needed
- Run the analysis and download the results as a new CSV file

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/LLM-publication-classifier.git
cd LLM-publication-classifier
```

### 2. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) installed. Then run:

```bash
npm install
```

### 3. Start the App Locally

```bash
npm run dev
```

This will launch the app at `http://localhost:5173` (or similar, depending on your setup).

---

## 📁 CSV Format

Ensure your CSV includes at least these columns in the following format:

| ID            | title         | abstract     |
| ------------- | ------------- | ------------ |
| 1             | Publication title 1 | Publication abstract 1 | 
| 2             | Publication title 2 | Publication abstract 2 |

A sample csv file dataset has been included in the repository for you to test the app.

---

## 🔐 API Key

Your **OpenAI API key** is entered at runtime.

---

## 🛠 Tech Stack

- React (with TypeScript)
- Vite for fast builds
- OpenAI SDK
- Papaparse (CSV parsing)
- FileSaver.js (for exporting results)

## Future improvements

- Write unit tests
- Implement rate limiter for API calls. See: https://python.langchain.com/docs/how_to/chat_model_rate_limiting/
- Add a SQL database to save all prompts and model outputs
- Include unit tests
- Add option to switch OpenAI models
