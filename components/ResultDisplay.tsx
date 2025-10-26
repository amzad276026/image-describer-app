
import React from 'react';

interface ResultDisplayProps {
  result: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 animate-fade-in">
      <h2 className="text-lg font-semibold text-indigo-400 mb-2">Analysis Result:</h2>
      <p className="text-slate-200 whitespace-pre-wrap">{result}</p>
    </div>
  );
};

export default ResultDisplay;
