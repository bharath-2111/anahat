import { formatFileSize, formatDuration } from './formatters';

/**
 * Maps and normalizes unpredictable backend JSON responses into a consistent,
 * frontend-safe structure. Allows FastAPI backend response schema to evolve
 * without breaking UI components.
 *
 * @param {Object} response - Raw JSON from FastAPI backend
 * @param {File} audioFile - Optional original audio file object for metadata fallback
 * @returns {Object} Normalized prediction structure
 */
export function normalizePredictionResponse(response, audioFile = null) {
  if (!response || typeof response !== 'object') {
    return createFallbackResponse('Invalid response object from backend', audioFile);
  }

  // 1. Normalize Prediction Label
  const rawPred = (
    response.prediction ||
    response.result ||
    response.label ||
    response.status ||
    response.classification ||
    ''
  ).toString().trim();

  let prediction = 'Spoof'; // Default conservative classification for security
  if (/real|authentic|human|genuine|pass/i.test(rawPred)) {
    prediction = 'Real';
  } else if (/spoof|fake|cloned|synthetic|deepfake|ai/i.test(rawPred)) {
    prediction = 'Spoof';
  }

  // 2. Normalize Probabilities
  let spoofProb = extractProbability(
    response.spoof_probability ??
    response.spoofProbability ??
    response.spoof_score ??
    response.fake_probability ??
    response.ai_probability
  );

  let realProb = extractProbability(
    response.real_probability ??
    response.realProbability ??
    response.real_score ??
    response.human_probability ??
    response.authentic_probability
  );

  // If one probability exists but not the other, derive it
  if (spoofProb !== null && realProb === null) {
    realProb = Math.max(0, 1 - spoofProb);
  } else if (realProb !== null && spoofProb === null) {
    spoofProb = Math.max(0, 1 - realProb);
  } else if (spoofProb === null && realProb === null) {
    // Fallback based on prediction label if probabilities are completely omitted by backend
    if (prediction === 'Spoof') {
      spoofProb = 0.95;
      realProb = 0.05;
    } else {
      spoofProb = 0.05;
      realProb = 0.95;
    }
  }

  // Clamp probabilities to [0, 1] range
  spoofProb = Math.min(1, Math.max(0, spoofProb));
  realProb = Math.min(1, Math.max(0, realProb));

  // 3. Normalize Risk Level
  let riskLevel = (
    response.risk_level ||
    response.riskLevel ||
    response.threat_level ||
    response.severity ||
    ''
  ).toString().trim();

  if (!riskLevel) {
    if (spoofProb >= 0.85) riskLevel = 'Critical';
    else if (spoofProb >= 0.65) riskLevel = 'High';
    else if (spoofProb >= 0.4) riskLevel = 'Medium';
    else riskLevel = 'Low';
  } else {
    // Standardize casing
    const lower = riskLevel.toLowerCase();
    if (lower.includes('crit')) riskLevel = 'Critical';
    else if (lower.includes('high')) riskLevel = 'High';
    else if (lower.includes('med')) riskLevel = 'Medium';
    else if (lower.includes('low')) riskLevel = 'Low';
    else riskLevel = 'Medium';
  }

  // 4. Normalize Security Recommendation
  let recommendation = (
    response.recommendation ||
    response.recommendation_text ||
    response.action ||
    response.guidance ||
    ''
  ).toString().trim();

  if (!recommendation) {
    if (prediction === 'Spoof') {
      recommendation = 'HIGH SPOOF RISK: Do not trust the caller identity. Verify through an independent out-of-band communication channel.';
    } else {
      recommendation = 'LOW RISK: Acoustic characteristics are consistent with natural human speech. Normal verification procedures apply.';
    }
  }

  // 5. Audio Information Extraction
  const audioInfo = {
    filename: response.audio_info?.filename || response.filename || audioFile?.name || 'Uploaded_Audio_File.wav',
    fileSize: response.audio_info?.file_size || response.file_size || (audioFile ? formatFileSize(audioFile.size) : 'Unknown'),
    fileType: response.audio_info?.file_type || response.file_type || audioFile?.type || 'audio/wav',
    duration: response.audio_info?.duration || response.duration || '00:00'
  };

  // 6. Windows Analyzed Extraction
  const windowsAnalyzed = response.windows_analyzed ?? response.windowsAnalyzed ?? response.windows?.length ?? 1;

  // 7. Additional Arbitrary Backend Fields
  const knownKeys = new Set([
    'prediction', 'result', 'label', 'status', 'classification',
    'spoof_probability', 'spoofProbability', 'spoof_score', 'fake_probability', 'ai_probability',
    'real_probability', 'realProbability', 'real_score', 'human_probability', 'authentic_probability',
    'risk_level', 'riskLevel', 'threat_level', 'severity',
    'recommendation', 'recommendation_text', 'action', 'guidance',
    'audio_info', 'filename', 'file_size', 'file_type', 'duration',
    'windows_analyzed', 'windowsAnalyzed', 'windows'
  ]);

  const additionalData = {};
  Object.keys(response).forEach(key => {
    if (!knownKeys.has(key)) {
      additionalData[key] = response[key];
    }
  });

  return {
    prediction,
    spoofProbability: spoofProb,
    realProbability: realProb,
    riskLevel,
    recommendation,
    audioInfo,
    windowsAnalyzed,
    additionalData,
    rawResponse: response
  };
}

/**
 * Extracts numeric probability value safely, converting percentage strings if needed.
 */
function extractProbability(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') {
    return val > 1 ? val / 100 : val;
  }
  if (typeof val === 'string') {
    const cleaned = val.replace('%', '').trim();
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) {
      return parsed > 1 ? parsed / 100 : parsed;
    }
  }
  return null;
}

/**
 * Creates a safe fallback response if mapping fails
 */
function createFallbackResponse(reason, audioFile) {
  return {
    prediction: 'Spoof',
    spoofProbability: 0.9,
    realProbability: 0.1,
    riskLevel: 'High',
    recommendation: `Analysis warning: ${reason}. Please re-upload or contact system administrator.`,
    audioInfo: {
      filename: audioFile?.name || 'audio_sample.wav',
      fileSize: audioFile ? formatFileSize(audioFile.size) : 'Unknown',
      fileType: audioFile?.type || 'audio/wav',
      duration: 'Unknown'
    },
    additionalData: { fallback: true, reason },
    rawResponse: { error: reason }
  };
}
