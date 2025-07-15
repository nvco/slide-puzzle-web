/**
 * Error handling utilities for the slide puzzle application
 */

// Error types for different scenarios
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  GAME_LOGIC: 'GAME_LOGIC_ERROR',
  UI: 'UI_ERROR',
  STORAGE: 'STORAGE_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
}

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, severity = ERROR_SEVERITY.MEDIUM, details = {}) {
    super(message)
    this.name = 'AppError'
    this.type = type
    this.severity = severity
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

/**
 * Error logger with different output methods based on environment
 * @param {Error|AppError} error - The error to log
 * @param {string} context - Context where the error occurred
 * @param {Object} additionalData - Additional data to log
 */
export function logError(error, context = 'Unknown', additionalData = {}) {
  const errorInfo = {
    message: error.message,
    type: error.type || ERROR_TYPES.UNKNOWN,
    severity: error.severity || ERROR_SEVERITY.MEDIUM,
    context,
    timestamp: error.timestamp || new Date().toISOString(),
    stack: error.stack,
    details: error.details || {},
    ...additionalData
  }

  // Development: Detailed logging
  if (import.meta.env.DEV) {
    console.group(`🚨 Error in ${context}`)
    console.error('Error Details:', errorInfo)
    console.trace('Stack Trace')
    console.groupEnd()
  } else {
    // Production: Minimal logging
    console.error(`[${errorInfo.type}] ${errorInfo.message}`, {
      context,
      severity: errorInfo.severity,
      timestamp: errorInfo.timestamp
    })
  }

  // TODO: In production, send to error tracking service (e.g., Sentry)
  // if (import.meta.env.PROD) {
  //   // sendToErrorTrackingService(errorInfo)
  // }
}

/**
 * Handle async operations with error catching
 * @param {Function} asyncFn - The async function to execute
 * @param {string} context - Context for error logging
 * @param {Function} onError - Optional error handler
 * @returns {Promise} Promise that resolves with result or rejects with handled error
 */
export async function handleAsync(asyncFn, context = 'Async Operation', onError = null) {
  try {
    return await asyncFn()
  } catch (error) {
    const appError = error instanceof AppError ? error : new AppError(
      error.message,
      ERROR_TYPES.UNKNOWN,
      ERROR_SEVERITY.MEDIUM,
      { originalError: error }
    )
    
    logError(appError, context)
    
    if (onError) {
      onError(appError)
    }
    
    throw appError
  }
}

/**
 * Create user-friendly error messages
 * @param {AppError} error - The error to create message for
 * @returns {string} User-friendly error message
 */
export function getUserFriendlyMessage(error) {
  const messages = {
    [ERROR_TYPES.NETWORK]: 'Connection issue. Please check your internet and try again.',
    [ERROR_TYPES.VALIDATION]: 'Invalid input. Please check your selection and try again.',
    [ERROR_TYPES.GAME_LOGIC]: 'Game error. Please refresh the page and try again.',
    [ERROR_TYPES.UI]: 'Display issue. Please refresh the page.',
    [ERROR_TYPES.STORAGE]: 'Storage issue. Your progress may not be saved.',
    [ERROR_TYPES.UNKNOWN]: 'Something went wrong. Please try again.'
  }

  return messages[error.type] || messages[ERROR_TYPES.UNKNOWN]
}

/**
 * Validate puzzle board state
 * @param {Array} board - The puzzle board array
 * @param {number} size - The puzzle size
 * @returns {boolean} True if board is valid
 */
export function validatePuzzleBoard(board, size) {
  try {
    if (!Array.isArray(board)) {
      throw new AppError('Board must be an array', ERROR_TYPES.VALIDATION, ERROR_SEVERITY.HIGH)
    }

    const expectedLength = size * size
    if (board.length !== expectedLength) {
      throw new AppError(
        `Board length ${board.length} does not match expected length ${expectedLength}`,
        ERROR_TYPES.VALIDATION,
        ERROR_SEVERITY.HIGH
      )
    }

    // Check for duplicate values
    const uniqueValues = new Set(board)
    if (uniqueValues.size !== board.length) {
      throw new AppError('Board contains duplicate values', ERROR_TYPES.VALIDATION, ERROR_SEVERITY.HIGH)
    }

    // Check for valid values (0 to size*size-1)
    for (let i = 0; i < expectedLength; i++) {
      if (!board.includes(i)) {
        throw new AppError(`Board missing value ${i}`, ERROR_TYPES.VALIDATION, ERROR_SEVERITY.HIGH)
      }
    }

    return true
  } catch (error) {
    logError(error, 'validatePuzzleBoard')
    return false
  }
}

/**
 * Safe JSON parsing with error handling
 * @param {string} jsonString - JSON string to parse
 * @param {any} defaultValue - Default value if parsing fails
 * @returns {any} Parsed object or default value
 */
export function safeJsonParse(jsonString, defaultValue = null) {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    logError(
      new AppError('Failed to parse JSON', ERROR_TYPES.VALIDATION, ERROR_SEVERITY.LOW),
      'safeJsonParse',
      { jsonString: jsonString?.substring(0, 100) }
    )
    return defaultValue
  }
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
} 