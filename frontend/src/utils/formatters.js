/**
 * Formats file size in bytes to a human-readable string (KB, MB).
 */
export function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Formats a decimal probability (0-1) or percentage (0-100) into clean string with %
 */
export function formatProbability(value) {
  if (value === null || value === undefined || isNaN(value)) return '0.0%';
  let num = Number(value);
  if (num <= 1) {
    num = num * 100;
  }
  return `${num.toFixed(1)}%`;
}

/**
 * Formats duration in seconds to MM:SS format
 */
export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Formats ISO timestamp to local readable security log timestamp
 */
export function formatTimestamp(date = new Date()) {
  return new Date(date).toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}
