/**
 * Format seconds into MM:SS display format
 * @param {number} seconds - Total seconds to format
 * @returns {string} Formatted time string (e.g., "2:45")
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format a filename into a readable title
 * @param {string} filename - The filename to format
 * @returns {string} Formatted title
 */
export function formatImageTitle(filename) {
  return filename
    .replace(/\.(jpg|jpeg|png|webp|svg)$/i, '')
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Format a category name for display
 * @param {string} category - The category name to format
 * @returns {string} Formatted category name
 */
export function formatCategoryName(category) {
  return category.charAt(0).toUpperCase() + category.slice(1)
} 