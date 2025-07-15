// Animation durations
export const ANIMATION_DURATIONS = {
  FLIP: 600,
  PIECE_MOVE: 300,
  VICTORY_DELAY: 500,
  DEMO_INTERVAL: 1500,
  DEMO_MOVE_DELAY: 300,
}

// Puzzle configuration
export const PUZZLE_CONFIG = {
  DEFAULT_SIZE: 3,
  MAX_SIZE: 4,
  EMPTY_PIECE_VALUE: 0,
}

// Color palette for numbered puzzle pieces
export const PUZZLE_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal  
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#F4A460', // Sandy Brown
  '#87CEEB', // Sky Blue
]

// Game states
export const GAME_STATES = {
  WELCOME: 'welcome',
  SELECTING: 'selecting',
  PLAYING: 'playing',
  WON: 'won',
}

// Touch target sizes (in pixels)
export const TOUCH_TARGETS = {
  MINIMUM: 44,
  MOBILE: 48,
}

// Responsive breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} 