import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalysis } from '../context/AnalysisContext';
import { 
  UploadCloud, 
  FileAudio, 
  Trash2, 
  Play, 
  Pause, 
  AlertCircle, 
  CheckCircle,
  Mic,
  Radio,
  Zap,
  Clock,
  BarChart3,
  Shield,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { formatFileSize } from '../utils/formatters';
import Button from './Button';

export default function AudioUploader() {
  const { selectedFile, fileMetadata, selectAudioFile, clearSelectedFile, runAnalysis, analysisStatus } = useAnalysis();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const isProcessing = analysisStatus === 'processing';

  // Handle file selection with upload simulation
  const handleFileSelected = (file) => {
    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const success = selectAudioFile(file);
    if (success) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setIsPlaying(false);
    }
  };

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

  const handleRemove = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setIsPlaying(false);
    setUploadProgress(0);
    setIsUploading(false);
    setShowSuccess(false);
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

  // Audio quality indicator
  const getAudioQuality = () => {
    if (!selectedFile) return null;
    const size = selectedFile.size;
    if (size > 10 * 1024 * 1024) return { label: 'High Quality', color: 'text-emerald-400', icon: Sparkles };
    if (size > 5 * 1024 * 1024) return { label: 'Good Quality', color: 'text-blue-400', icon: Radio };
    return { label: 'Standard', color: 'text-slate-400', icon: Mic };
  };

  const qualityInfo = getAudioQuality();

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".wav,.mp3,.m4a,.flac,audio/wav,audio/mpeg,audio/mp4,audio/flac"
        className="hidden"
      />

      {/* State A: File Dropzone */}
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 bg-slate-900/60 ${
              isDragOver
                ? 'border-emerald-500 bg-emerald-500/5 shadow-lg shadow-emerald-500/10 scale-[1.01]'
                : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            {/* Animated background */}
            {isDragOver && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-emerald-500/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}

            <div className="relative">
              <motion.div 
                className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-5 text-emerald-400"
                whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.3 }}
              >
                <UploadCloud className="w-10 h-10" />
              </motion.div>

              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
                {isDragOver ? 'Drop Your Audio File' : 'Upload Audio File'}
              </h3>
              <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                {isDragOver 
                  ? 'Release to upload and analyze for voice authenticity'
                  : 'Drag & drop your audio file here, or click to browse'
                }
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['WAV', 'MP3', 'M4A', 'FLAC'].map((ext) => (
                  <span
                    key={ext}
                    className="px-3 py-1 bg-slate-950 border border-slate-800 text-[10px] font-mono font-semibold text-slate-400 rounded-lg hover:border-emerald-500/30 transition-colors"
                  >
                    .{ext}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-center gap-6 text-[10px] font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  Max 50 MB
                </span>
                <span className="w-px h-4 bg-slate-800" />
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  Secure Upload
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* State B: Audio File Selected */
          <motion.div
            key="file-selected"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
          >
            {/* Upload Progress Bar (when uploading) */}
            <AnimatePresence>
              {isUploading && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pt-4"
                >
                  <div className="flex items-center justify-between text-[10px] font-medium text-slate-400 mb-1.5">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success animation */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="px-6 pt-4"
                >
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-[10px] font-medium">File uploaded successfully</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* File Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <motion.div 
                    className="w-14 h-14 bg-slate-950 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400 flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                  >
                    <FileAudio className="w-7 h-7" />
                  </motion.div>
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-100 truncate max-w-xs sm:max-w-md">
                        {fileMetadata?.name || selectedFile.name}
                      </h4>
                      {qualityInfo && (
                        <span className={`text-[8px] font-bold uppercase tracking-wider ${qualityInfo.color}`}>
                          {qualityInfo.label}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] font-medium text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {selectedFile.type?.toUpperCase() || 'AUDIO'}
                      </span>
                      <span className="w-px h-3 bg-slate-700" />
                      <span className="flex items-center gap-1.5">
                        <BarChart3 className="w-3 h-3" />
                        {formatFileSize(selectedFile.size)}
                      </span>
                      {fileMetadata?.duration && (
                        <>
                          <span className="w-px h-3 bg-slate-700" />
                          <span className="flex items-center gap-1.5 text-emerald-400">
                            <Clock className="w-3 h-3" />
                            {fileMetadata.duration}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full lg:w-auto">
                  {audioUrl && (
                    <motion.button
                      type="button"
                      onClick={togglePlayAudio}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-[10px] font-semibold flex items-center gap-2 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 text-amber-400" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 text-emerald-400" />
                          Preview
                        </>
                      )}
                    </motion.button>
                  )}
                  
                  <motion.button
                    type="button"
                    onClick={handleRemove}
                    disabled={isProcessing}
                    className="px-3 py-2 bg-slate-950 hover:bg-red-950/80 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-800 rounded-xl text-[10px] font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </motion.button>
                </div>
              </div>

              {/* Audio Player */}
              {audioUrl && (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
              )}

              {/* Bottom Action Bar */}
              <div className="mt-5 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-[10px] font-medium text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>File validated</span>
                  </div>
                  <span className="w-px h-4 bg-slate-700" />
                  <div className="flex items-center gap-1.5">
                  
                    <span>Ready for analysis</span>
                  </div>
                </div>

                <Button
                  onClick={runAnalysis}
                  disabled={isProcessing}
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto min-w-[180px]"
                  icon={isProcessing ? Loader2 : ArrowRight}
                >
                  {isProcessing ? 'Analyzing...' : 'Analyze Voice'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}