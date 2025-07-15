import { computed } from 'vue'
import { PUZZLE_COLORS, PUZZLE_CONFIG } from '@/utils/constants'

/**
 * Composable for puzzle game logic
 * @param {Object} gameStore - The game store instance
 * @returns {Object} Puzzle logic functions and computed properties
 */
export function usePuzzleLogic(gameStore) {
  // Computed properties
  const puzzleSize = computed(() => gameStore.puzzleSize)
  const gamePieces = computed(() => gameStore.board)
  const gameState = computed(() => gameStore.gameState)

  // Generate solved pieces for preview
  const solvedPieces = computed(() => {
    const size = puzzleSize.value
    return Array.from({ length: size * size }, (_, i) => i)
  })

  /**
   * Check if a piece can move to the empty space
   * @param {number} index - The index of the piece to check
   * @returns {boolean} True if the piece can move
   */
  const isMoveable = (index) => {
    if (!gamePieces.value.length) return false
    
    const size = puzzleSize.value
    const emptyIndex = gamePieces.value.indexOf(0)
    const emptyRow = Math.floor(emptyIndex / size)
    const emptyCol = emptyIndex % size
    const pieceRow = Math.floor(index / size)
    const pieceCol = index % size
    
    // Check if piece is adjacent to empty space
    return (
      (Math.abs(pieceRow - emptyRow) === 1 && pieceCol === emptyCol) ||
      (Math.abs(pieceCol - emptyCol) === 1 && pieceRow === emptyRow)
    )
  }

  /**
   * Get CSS styles for a puzzle piece
   * @param {number} piece - The piece value
   * @param {number} index - The piece index
   * @returns {Object} CSS style object
   */
  const getPieceStyle = (piece, index) => {
    if (piece === PUZZLE_CONFIG.EMPTY_PIECE_VALUE) {
      return {
        opacity: 0,
        pointerEvents: 'none'
      }
    }
    
    return {
      backgroundColor: '#ffffff',
      border: '2px solid #e5e7eb',
      aspectRatio: '1/1'
    }
  }

  /**
   * Check if the puzzle is solved
   * @returns {boolean} True if the puzzle is solved
   */
  const isSolved = computed(() => {
    if (!gamePieces.value.length) return false
    
    const size = puzzleSize.value
    const expectedLength = size * size
    
    // Check if board has correct length
    if (gamePieces.value.length !== expectedLength) return false
    
    // Check if pieces are in correct order (0 should be last)
    for (let i = 0; i < expectedLength - 1; i++) {
      if (gamePieces.value[i] !== i + 1) return false
    }
    
    // Check if empty space (0) is at the end
    return gamePieces.value[expectedLength - 1] === 0
  })

  /**
   * Get the empty space index
   * @returns {number} Index of the empty space, or -1 if not found
   */
  const getEmptyIndex = computed(() => {
    return gamePieces.value.indexOf(0)
  })

  /**
   * Get valid moves for the current board state
   * @returns {Array} Array of indices that can be moved
   */
  const getValidMoves = computed(() => {
    const moves = []
    for (let i = 0; i < gamePieces.value.length; i++) {
      if (isMoveable(i)) {
        moves.push(i)
      }
    }
    return moves
  })

  /**
   * Check if a puzzle state is solvable
   * Uses the inversion count method for 3x3 puzzles
   * @param {Array} board - The board state to check (optional, uses current board if not provided)
   * @param {number} size - The puzzle size (optional, uses current size if not provided)
   * @returns {boolean} True if the puzzle is solvable
   */
  const isSolvable = (board = gamePieces.value, size = puzzleSize.value) => {
    if (size === 3) {
      // For 3x3 puzzles, count inversions (excluding the empty space)
      let inversions = 0
      for (let i = 0; i < board.length; i++) {
        if (board[i] === 0) continue // Skip empty space
        for (let j = i + 1; j < board.length; j++) {
          if (board[j] === 0) continue // Skip empty space
          if (board[i] > board[j]) {
            inversions++
          }
        }
      }
      
      // 3x3 puzzle is solvable if inversions count is even
      return inversions % 2 === 0
    } else {
      // For larger puzzles, any state reachable by valid moves is solvable
      // Since we only use valid moves for scrambling, this should always be true
      return true
    }
  }

  return {
    // Computed properties
    puzzleSize,
    gamePieces,
    gameState,
    solvedPieces,
    isSolved,
    getEmptyIndex,
    getValidMoves,
    
    // Functions
    isMoveable,
    getPieceStyle,
    isSolvable,
  }
} 