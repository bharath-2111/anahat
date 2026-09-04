/**
 * API Service Layer for AI Voice Spoof / Cloning Detection System.
 * Connects directly to FastAPI backend via configurable endpoint.
 */

// Base API URL from Vite environment configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const ANALYZE_ENDPOINT = `${API_BASE_URL}/analyze`;

/**
 * Sends an audio file to the FastAPI backend for voice spoof detection analysis.
 *
 * @param {File} file - Audio file object (.wav, .mp3, .m4a, .flac)
 * @param {boolean} forceMock - Toggles isolated development mock mode (default: false)
 * @returns {Promise<Object>} Raw backend JSON response
 */
export async function analyzeAudio(file, forceMock = false) {
  if (!file) {
    throw new Error('No audio file provided for analysis.');
  }

  // Development Mock Handler (for offline testing & demo validation)
  if (forceMock) {
    return generateDevelopmentMock(file);
  }

  const formData = new FormData();
  // Standard FastAPI endpoint form field name: 'file'
  formData.append('file', file);

  try {
    const response = await fetch(ANALYZE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: Server returned an error during analysis.`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string' 
            ? errorData.detail 
            : JSON.stringify(errorData.detail);
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // Fallback to text parsing if JSON parsing fails
        const textErr = await response.text();
        if (textErr) errorMessage = textErr.substring(0, 150);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    // Check if network error (e.g. backend server down on port 8000)
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(
        `Unable to reach FastAPI server at ${API_BASE_URL}. Ensure backend service is running or switch to development mock mode.`
      );
    }
    throw err;
  }
}

/**
 * Isolated development mock generator.
 * Used ONLY when explicitly selected by developer or when server is unavailable.
 */
export function generateDevelopmentMock(file) {
  return new Promise((resolve) => {
    const isLikelySpoof = file.name.toLowerCase().includes('spoof') || 
                          file.name.toLowerCase().includes('fake') || 
                          file.name.toLowerCase().includes('ai') || 
                          Math.random() > 0.4;

    const spoofProb = isLikelySpoof 
      ? Number((0.82 + Math.random() * 0.16).toFixed(2))
      : Number((0.02 + Math.random() * 0.12).toFixed(2));
    
    const realProb = Number((1 - spoofProb).toFixed(2));
    const riskLevel = spoofProb > 0.85 ? 'Critical' : spoofProb > 0.65 ? 'High' : spoofProb > 0.3 ? 'Medium' : 'Low';

    setTimeout(() => {
      resolve({
        prediction: isLikelySpoof ? 'Spoof' : 'Real',
        spoof_probability: spoofProb,
        real_probability: realProb,
        risk_level: riskLevel,
        recommendation: isLikelySpoof
          ? 'Do not trust the caller. Voice exhibits high spectral synthetic artifacts consistent with text-to-speech deepfake cloning.'
          : 'Authentic acoustic signature verified. Acoustic pitch stability matches natural human vocal folds.',
        confidence_score: 0.965,
        analysis_engine: 'DeepVoice-Sentinel-v4.2',
        spectral_hash: '0x8F3A91E2C04B',
        model_version: '2026.04-prod',
        latency_ms: 342,
        audio_info: {
          filename: file.name,
          file_size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          file_type: file.type || 'audio/wav',
          duration: '00:14'
        }
      });
    }, 1500); // Realistic network delay simulation
  });
}
