
import React, { useState, useCallback } from 'react';
import { analyzeImageText } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { LogoIcon, SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setImageFile(file);
    setAnalysisResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    try {
      // The user prompt in Bengali means "what is written here"
      const prompt = "eikhane ki lekha ache";
      const result = await analyzeImageText(imageFile, prompt);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);
  
  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.95)), radial-gradient(circle at top left, #1e3a8a 0%, transparent 30%), radial-gradient(circle at bottom right, #1e3a8a 0%, transparent 40%)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };


  return (
    <div style={backgroundStyle} className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-slate-100">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <LogoIcon />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Image Text Decipher
            </h1>
          </div>
          <p className="text-slate-400 max-w-md mx-auto">
            Upload a blurry or pixelated image, and let Gemini reveal the hidden text.
          </p>
        </header>

        <main className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-xl shadow-2xl p-6 space-y-6">
          <ImageUploader onImageUpload={handleImageUpload} imageUrl={imageUrl} />
          
          {error && <div className="text-red-400 bg-red-900/50 border border-red-700 rounded-md p-3 text-center">{error}</div>}

          {imageFile && (
            <div className="flex justify-center">
              <button
                onClick={handleAnalyzeClick}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <Loader />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon />
                    <span>Analyze Image</span>
                  </>
                )}
              </button>
            </div>
          )}

          {analysisResult && (
            <ResultDisplay result={analysisResult} />
          )}
        </main>
        
        <footer className="text-center mt-8">
          <p className="text-sm text-slate-500">Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
