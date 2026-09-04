/**
 * Audio file validation helper
 */
export const ALLOWED_EXTENSIONS = ['.wav', '.mp3', '.m4a', '.flac'];
export const ALLOWED_MIME_TYPES = [
  'audio/wav',
  'audio/x-wav',
  'audio/mpeg',
  'audio/mp3',
  'audio/m4a',
  'audio/x-m4a',
  'audio/mp4',
  'audio/flac',
  'audio/x-flac'
];
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB limit

export function validateAudioFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected. Please choose an audio file.' };
  }

  const name = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => name.endsWith(ext));

  if (!hasValidExtension) {
    return {
      valid: false,
      error: `Invalid file format. Supported formats: ${ALLOWED_EXTENSIONS.join(', ')}`
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'File size exceeds maximum limit of 50 MB.'
    };
  }

  return { valid: true, error: null };
}

/**
 * Login / User Identification form validation
 */
export function validateLoginData(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
  if (!data.phone || !phoneRegex.test(data.phone.trim())) {
    errors.phone = 'Please enter a valid phone number.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
