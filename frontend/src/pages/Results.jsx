import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import Navbar from '../components/Navbar';
import RiskBadge from '../components/RiskBadge';
import ProbabilityCard from '../components/ProbabilityCard';
import RecommendationCard from '../components/RecommendationCard';
import AudioInfo from '../components/AudioInfo';
import TechnicalAnalysis from '../components/TechnicalAnalysis';
import RawJsonViewer from '../components/RawJsonViewer';
import AIAssistant from '../components/AIAssistant';
import Card from '../components/Card';
import Button from '../components/Button';
import { ShieldAlert, ShieldCheck, ArrowLeft, RotateCcw, FileAudio } from 'lucide-react';

export default function Results() {
  const { analysisResult, clearSelectedFile } = useAnalysis();
  const navigate = useNavigate();

  const handleAnalyzeNew = () => {
    clearSelectedFile();
    navigate('/analyze');
  };

  // If no analysis result exists yet, show prompt to run an analysis first
  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100 bg-tech-grid">
        <Navbar />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
          <Card className="max-w-md w-full p-8 text-center">
            <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <FileAudio className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-mono font-bold text-slate-100 uppercase tracking-wide">
              NO ANALYSIS RECORD FOUND
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-2 mb-6">
              Please upload and analyze an audio recording on the Analyzer page to view detailed security telemetry.
            </p>
            <Button
              onClick={() => navigate('/analyze')}
              variant="primary"
              size="md"
              icon={ArrowLeft}
              fullWidth
            >
              GO TO AUDIO ANALYZER
            </Button>
          </Card>
        </main>
        <AIAssistant />
      </div>
    );
  }

  const isSpoof = analysisResult.prediction === 'Spoof';

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100 bg-tech-grid">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-mono font-extrabold tracking-tight text-slate-100 uppercase">
                DETAILED SECURITY ANALYSIS REPORT
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 bg-slate-900 border border-slate-800 text-emerald-400 rounded">
                PAGE 03
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Complete acoustic telemetry and probability classification synthesized from FastAPI backend.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => navigate('/analyze')}
              variant="outline"
              size="sm"
              icon={ArrowLeft}
            >
              BACK TO SUMMARY
            </Button>
            <Button
              onClick={handleAnalyzeNew}
              variant="secondary"
              size="sm"
              icon={RotateCcw}
            >
              NEW ANALYSIS
            </Button>
          </div>
        </div>

        {/* 1. PREDICTION BANNER SECTION */}
        <div className={`p-6 sm:p-8 border rounded-lg shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 ${
          isSpoof
            ? 'bg-red-950/40 border-red-800'
            : 'bg-emerald-950/40 border-emerald-800'
        }`}>
          <div className="flex items-center space-x-4 text-center sm:text-left">
            <div className={`p-3 rounded-lg border bg-slate-950 ${
              isSpoof ? 'border-red-700 text-red-500' : 'border-emerald-700 text-emerald-500'
            }`}>
              {isSpoof ? <ShieldAlert className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                CLASSIFICATION EVALUATION
              </span>
              <h2 className={`text-2xl sm:text-4xl font-mono font-extrabold tracking-tight uppercase ${
                isSpoof ? 'text-red-500' : 'text-emerald-500'
              }`}>
                {isSpoof ? 'SPOOF / AI SYNTHETIC' : 'AUTHENTIC / REAL VOICE'}
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">EVALUATED RISK LEVEL</span>
            <RiskBadge level={analysisResult.riskLevel} size="lg" />
          </div>
        </div>

        {/* 2 & 3. PROBABILITY ANALYSIS & RECOMMENDATION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProbabilityCard
            spoofProbability={analysisResult.spoofProbability}
            realProbability={analysisResult.realProbability}
          />
          
          <RecommendationCard
            recommendation={analysisResult.recommendation}
            prediction={analysisResult.prediction}
          />
        </div>

        {/* 4. AUDIO INFORMATION PANEL */}
        <AudioInfo audioInfo={analysisResult.audioInfo} />

        {/* 5. ADDITIONAL TECHNICAL ANALYSIS GRID */}
        <TechnicalAnalysis additionalData={analysisResult.additionalData} />

        {/* 6. RAW JSON INSPECTOR */}
        <RawJsonViewer rawJson={analysisResult.rawResponse} />

      </main>

      <AIAssistant />
    </div>
  );
}
