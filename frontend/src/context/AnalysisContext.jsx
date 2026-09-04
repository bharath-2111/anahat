import React, { createContext, useContext, useState } from 'react';
import { analyzeAudio } from '../services/api';
import { normalizePredictionResponse } from '../utils/responseMapper';
import { validateAudioFile } from '../utils/validators';

const AnalysisContext = createContext(null);

const STORAGE_KEY_USER = 'voxshield_user';
const STORAGE_KEY_AUTH = 'voxshield_authenticated';

export function AnalysisProvider({ children }) {
  const [userData, setUserData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    } catch (e) {
      return false;
    }
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileMetadata, setFileMetadata] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState('idle');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [isMockMode, setIsMockMode] = useState(false);

  // -----------------------------
  // Authentication
  // -----------------------------

  const loginUser = (user) => {
    setUserData(user);
    setIsAuthenticated(true);

    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY_AUTH, 'true');
    } catch (e) {
      console.warn('Could not save authentication data.');
    }
  };

  const logoutUser = () => {
    setUserData(null);
    setIsAuthenticated(false);

    try {
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch (e) {
      console.warn('Could not clear authentication data.');
    }
  };

  // -----------------------------
  // Existing audio functionality
  // -----------------------------

  const selectAudioFile = (file) => {
    const validation = validateAudioFile(file);

    if (!validation.valid) {
      setError({
        title: 'Invalid File',
        message: validation.error,
      });
      return false;
    }

    setSelectedFile(file);
    setError(null);
    setAnalysisResult(null);

    const meta = {
      name: file.name,
      size: file.size,
      type: file.type || 'audio/wav',
      lastModified: new Date(file.lastModified).toISOString(),
      duration: '00:00',
    };

    try {
      const audioUrl = URL.createObjectURL(file);
      const audio = new Audio();

      audio.src = audioUrl;

      audio.onloadedmetadata = () => {
        if (!isNaN(audio.duration)) {
          const mins = Math.floor(audio.duration / 60);
          const secs = Math.floor(audio.duration % 60);

          meta.duration = `${mins
            .toString()
            .padStart(2, '0')}:${secs
            .toString()
            .padStart(2, '0')}`;

          setFileMetadata({ ...meta });
        }

        URL.revokeObjectURL(audioUrl);
      };
    } catch (e) {
      console.warn('Failed to calculate audio duration:', e);
    }

    setFileMetadata(meta);
    setAnalysisStatus('file-selected');

    return true;
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFileMetadata(null);
    setAnalysisResult(null);
    setError(null);
    setAnalysisStatus('idle');
  };

  const runAnalysis = async () => {
    if (!selectedFile) {
      setError({
        title: 'No File Selected',
        message: 'Please select an audio file to analyze.',
      });
      return;
    }

    setAnalysisStatus('processing');
    setError(null);

    try {
      const rawData = await analyzeAudio(selectedFile, isMockMode);
      const normalized = normalizePredictionResponse(
        rawData,
        selectedFile
      );

      setAnalysisResult(normalized);
      setAnalysisStatus('success');
    } catch (err) {
      console.error('Audio Analysis Error:', err);

      setAnalysisStatus('error');

      setError({
        title: 'Analysis Failed',
        message:
          err.message ||
          'An unexpected error occurred while communicating with the analysis server.',
      });
    }
  };

  const toggleMockMode = (enabled) => {
    setIsMockMode(
      enabled !== undefined ? enabled : !isMockMode
    );
  };

  return (
    <AnalysisContext.Provider
      value={{
        // Authentication
        userData,
        isAuthenticated,
        loginUser,
        logoutUser,

        // Audio analysis
        selectedFile,
        fileMetadata,
        analysisStatus,
        analysisResult,
        error,
        isMockMode,
        selectAudioFile,
        clearSelectedFile,
        runAnalysis,
        toggleMockMode,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);

  if (!context) {
    throw new Error(
      'useAnalysis must be used within an AnalysisProvider'
    );
  }

  return context;
}