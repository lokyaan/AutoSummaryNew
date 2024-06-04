import React, { useState } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaste, faCopy, faDownload, faTrash, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { getDocument } from 'pdfjs-dist';

const SummarizationComponent = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [minLength, setMinLength] = useState(50);
  const [maxLength, setMaxLength] = useState(150);
  const [file, setFile] = useState(null);

  const handleSummarize = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, min_length: minLength, max_length: maxLength }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Failed to fetch:', error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([summary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'summary.txt';
    document.body.appendChild(element);
    element.click();
  };

  const handlePaste = () => {
    navigator.clipboard.readText().then((clipText) => setText(clipText));
  };

  const handleClearText = () => {
    setText('');
  };

  const handleClearSummary = () => {
    setSummary('');
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    setFile(file);
    const fileReader = new FileReader();
    fileReader.onload = async () => {
      const typedArray = new Uint8Array(fileReader.result);
      const pdf = await getDocument({ data: typedArray }).promise;
      let pdfText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        pdfText += textContent.items.map(item => item.str).join(' ');
      }
      setText(pdfText);
    };
    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div className="container">
      <header>
        <h1>Quick Recap</h1>
        <p>Free tool for content creation and summarization</p>
      </header>
      <div className="controls">
        <label>
          Min Length:
          <input
            type="number"
            value={minLength}
            onChange={(e) => setMinLength(Number(e.target.value))}
          />
        </label>
        <label>
          Max Length:
          <input
            type="number"
            value={maxLength}
            onChange={(e) => setMaxLength(Number(e.target.value))}
          />
        </label>
        <button onClick={handleSummarize}>SUMMARIZE</button>
      </div>
      <div className="content">
        <div className="text-section">
          <h3>Your text (no character limit)</h3>
          <textarea
            rows="20"
            cols="50"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="input-buttons">
            <FontAwesomeIcon icon={faPaste} onClick={handlePaste} className="icon-button" />
            <FontAwesomeIcon icon={faTrash} onClick={handleClearText} className="icon-button" />
            <label htmlFor="pdf-upload" className="icon-button">
              <FontAwesomeIcon icon={faFilePdf} />
            </label>
            <input
              id="pdf-upload"
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        <div className="summary-section">
          <h3>Summary</h3>
          <div className="summary">
            {summary}
          </div>
          <div className="output-buttons">
            <FontAwesomeIcon icon={faCopy} onClick={handleCopy} className="icon-button" />
            <FontAwesomeIcon icon={faTrash} onClick={handleClearSummary} className="icon-button" />
            <FontAwesomeIcon icon={faDownload} onClick={handleDownload} className="icon-button" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarizationComponent;