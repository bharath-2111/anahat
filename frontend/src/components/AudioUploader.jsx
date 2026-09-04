import React, { useState, useRef } from 'react';
import { useAnalysis } from '../context/AnalysisContext';
import { UploadCloud, FileAudio, Trash2, Play, Pause, AlertCircle, CheckCircle } from 'lucide-react';
import { formatFileSize } from '../utils/formatters';
import Button from './Button';

export default function AudioUploader() {
  const { selectedFile, fileMetadata, selectAudioFile, clearSelectedFile, runAnalysis, analysisStatus } = useAnalysis();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle Drag Events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    const success = selectAudioFile(file);
    if (success) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setIsPlaying(false);
    }
  };

  const handleRemove = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setIsPlaying(false);
    clearSelectedFile();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".wav,.mp3,.m4a,.flac,audio/wav,audio/mpeg,audio/mp4,audio/flac"
        className="hidden"
      />

      {/* State A: File Dropzone (When no file selected or idle) */}
      {!selectedFile ? (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer transition-colors duration-200 bg-slate-900/60 ${
            isDragOver
              ? 'border-emerald-500 bg-slate-800/80'
              : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900'
          }`}
        >
          <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-base font-mono font-bold text-slate-100 uppercase tracking-wide">
            DRAG & DROP AUDIO FILE
          </h3>
          <p className="text-xs text-slate-400 mt-2 font-sans max-w-md mx-auto">
            Select a target recording to analyze voice acoustic features and detect deepfake synthesis.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {['.WAV', '.MP3', '.M4A', '.FLAC'].map((ext) => (
              <span
                key={ext}
                className="px-2.5 py-1 bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 rounded"
              >
                {ext}
              </span>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 font-mono mt-4">
            MAXIMUM FILE SIZE: 50 MB
          </p>
        </div>
      ) : (
        /* State B: Audio File Selected Panel */
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            
            {/* File Icon & Info */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-slate-950 border border-emerald-500/40 rounded flex items-center justify-center text-emerald-400 flex-shrink-0">
                <FileAudio className="w-6 h-6" />
              </div>
              
              <div>
                <h4 className="text-sm font-mono font-bold text-slate-100 truncate max-w-xs sm:max-w-md">
                  {fileMetadata?.name || selectedFile.name}
                </h4>
                
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs font-mono text-slate-400">
                  <span>FORMAT: <strong className="text-slate-200">{(selectedFile.type || 'AUDIO').toUpperCase()}</strong></span>
                  <span>SIZE: <strong className="text-slate-200">{formatFileSize(selectedFile.size)}</strong></span>
                  {fileMetadata?.duration && (
                    <span>LENGTH: <strong className="text-emerald-400">{fileMetadata.duration}</strong></span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              {audioUrl && (
                <button
                  type="button"
                  onClick={togglePlayAudio}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono flex items-center gap-1.5"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{isPlaying ? 'PAUSE' : 'PLAY PREVIEW'}</span>
                </button>
              )}
              
              <button
                type="button"
                onClick={handleRemove}
                disabled={analysisStatus === 'processing'}
                className="px-3 py-1.5 bg-slate-950 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-900 rounded text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>REMOVE</span>
              </button>
            </div>
          </div>

          {/* HTML5 Audio Player Element */}
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          )}

          {/* Action Row */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>PAYLOAD VALIDATED. READY FOR DETECT ENGINE.</span>
            </div>

            <Button
              onClick={runAnalysis}
              disabled={analysisStatus === 'processing'}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              RUN FASTAPI ANALYSIS
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
