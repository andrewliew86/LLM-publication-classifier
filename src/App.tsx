import React, { useState } from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { OpenAI } from 'openai';

interface Paper {
  ID: string;
  title: string;
  abstract: string;
  result?: string;
}

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [csvData, setCsvData] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(
    `You are a medical research assistant. Given the title and abstract below, 
answer with only "Yes" or "No". Is this paper reporting on results from a clinical trial?`
  );

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<Paper>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
      },
    });
  };

  const createOpenAI = () => {
    return new OpenAI({
      apiKey: apiKey.trim(),
      dangerouslyAllowBrowser: true,
    });
  };

  const analyzePaper = async (openai: OpenAI, paper: Paper): Promise<string> => {
    const prompt = `
${customPrompt}

Title: ${paper.title}

Abstract: ${paper.abstract}

Answer:`;

    try {
      const chatResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
      });

      const reply = chatResponse.choices[0]?.message?.content?.trim() || 'Error';
      return reply.toLowerCase().startsWith('yes') ? 'Yes' : 'No';
    } catch (err) {
      console.error('Error analyzing paper:', err);
      return 'Error';
    }
  };

  const handleAnalyze = async () => {
    if (!apiKey) {
      alert('Please enter your OpenAI API key first.');
      return;
    }

    const openai = createOpenAI();
    setLoading(true);

    const updated: Paper[] = [];

    for (const paper of csvData) {
      const result = await analyzePaper(openai, paper);
      updated.push({ ...paper, result });
      await sleep(2000);
    }

    setCsvData(updated);
    setLoading(false);
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'analysis_results.csv');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>🧬 GPT-4o clinical trial analyzer</h1>
      <p>This basic webapp uses GPT-4o to analyze a csv file containing a list of titles and abstracts and determines whether each publication is a clinical trial.</p>
      <p>To use the app: </p>
      <div>
        <ol start="1">
          <li>Enter your OpenAI API key</li>
          <li>Customize the prompt (optional)</li>
          <li>Upload your CSV file containing publication data (follow formatting of sample dataset CSV file) </li>
          <li>Download the CSV file containing the GPT-4o output once the analysis is complete.</li>
        </ol>
      </div>      
      <label>
        🔐 Enter your OpenAI API key:
        <input
          type="password"
          placeholder="sk-..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{ width: '100%', margin: '0.5rem 0', padding: '0.5rem' }}
        />
      </label>

      <label>
        📝 Customize prompt:
        <textarea
          rows={4}
          style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem' }}
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
        />
      </label>

      <label>
        📁 Upload CSV:
        <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'block', marginTop: '0.5rem' }} />
      </label>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleAnalyze} disabled={loading || csvData.length === 0 || !apiKey}>
          {loading ? 'Analyzing...' : 'Run Analysis'}
        </button>{' '}
        <button onClick={downloadCSV} disabled={csvData.length === 0}>
          Download Results
        </button>
      </div>
    </div>
  );
};

export default App;
