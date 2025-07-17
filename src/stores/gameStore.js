import { defineStore } from 'pinia'
import { AppError, ERROR_TYPES, ERROR_SEVERITY, logError, validatePuzzleBoard } from '@/utils/errorHandler'
import { usePuzzleLogic } from '@/composables/usePuzzleLogic'

export const useGameStore = defineStore('game', {
  state: () => ({
    // Game state
    currentPuzzle: {
      id: 'numbers-puzzle',
      filename: 'numbers',
      path: null,
      alt: 'Number Slide Puzzle',
      category: 'numbers'
    },
    puzzleSize: 3, // 3x3 grid (8 pieces + 1 empty)
    gameState: 'playing', // 'welcome', 'selecting', 'playing', 'won'
    moves: 0,
    startTime: null,
    
    // Color theme
    currentColor: 'red', // Default color
    availableColors: ['red', 'pink', 'blue', 'green', 'orange'],
    
    // Image management
    availableImages: [],
    shownImages: [],
    currentImageIndex: 0,
    
    // Puzzle board state
    board: [1, 2, 3, 4, 5, 6, 7, 8, 0], // Array of piece positions (solved state initially)
    solution: [1, 2, 3, 4, 5, 6, 7, 8, 0], // Solved state
    emptyPosition: { row: 2, col: 2 }, // Position of empty space
    
    // UI state
    showWelcome: false,
    showPuzzle: true,
    animating: false,
  }),

  getters: {
    // Check if current puzzle is solved
    isSolved: (state) => {
      if (!state.board.length) return false
      
      const size = state.puzzleSize
      const totalPieces = size * size
      
      // Check if pieces are in correct order (1 to 8, then 0)
      for (let i = 0; i < totalPieces - 1; i++) {
        if (state.board[i] !== i + 1) return false
      }
      
      // Check if empty space (0) is at the end
      return state.board[totalPieces - 1] === 0
    },
    
    // Get elapsed time in seconds
    elapsedTime: (state) => {
      if (!state.startTime) return 0
      return Math.floor((Date.now() - state.startTime) / 1000)
    },
    
    // Get available images that haven't been shown
    unshownImages: (state) => {
      return state.availableImages.filter(img => !state.shownImages.includes(img.id))
    },
    
    // Get random image from unshown images
    randomUnshownImage: (state) => {
      const unshown = state.availableImages.filter(img => !state.shownImages.includes(img.id))
      if (unshown.length === 0) {
        // Reset if all images have been shown
        return state.availableImages[Math.floor(Math.random() * state.availableImages.length)]
      }
      return unshown[Math.floor(Math.random() * unshown.length)]
    }
  },

  actions: {
    /**
     * Initialize game with image manifest
     * @param {Object} imageManifest - The image manifest object
     * @throws {AppError} If manifest is invalid or initialization fails
     */
    initializeGame(imageManifest) {
      try {
        if (!imageManifest || !imageManifest.categories) {
          throw new AppError(
            'Invalid image manifest provided',
            ERROR_TYPES.VALIDATION,
            ERROR_SEVERITY.HIGH
          )
        }

        this.availableImages = []
        Object.values(imageManifest.categories).forEach(category => {
          if (Array.isArray(category)) {
            this.availableImages.push(...category)
          }
        })
        
        console.log(`🎮 Game initialized with ${this.availableImages.length} images`)
      } catch (error) {
        logError(error, 'initializeGame')
        throw error
      }
    },
    
    // Start welcome animation
    startWelcome() {
      this.gameState = 'welcome'
      this.showWelcome = true
      this.showPuzzle = false
    },
    
    // Show image gallery for selection (kept for future use)
    showImageSelection() {
      this.gameState = 'selecting'
      this.showWelcome = false
      this.showPuzzle = false
    },
    
    // Start numbers puzzle directly
    startNumbersPuzzle() {
      this.randomizeColor() // Pick new color for new game
      this.currentPuzzle = {
        id: 'numbers-puzzle',
        filename: 'numbers',
        path: null,
        alt: 'Number Slide Puzzle',
        category: 'numbers'
      }
      this.generatePuzzle()
      this.gameState = 'playing'
      this.showWelcome = false
      this.showPuzzle = true
      this.startTime = Date.now()
      this.moves = 0
    },
    
    // Select an image and prepare puzzle (kept for future use)
    selectImage(image) {
      this.randomizeColor() // Pick new color for new game
      this.currentPuzzle = image
      this.shownImages.push(image.id)
      this.generatePuzzle()
      this.gameState = 'playing'
      this.showPuzzle = true
      this.startTime = Date.now()
      this.moves = 0
    },
    
    // Select random image
    selectRandomImage() {
      const randomImage = this.randomUnshownImage
      if (randomImage) {
        this.randomizeColor() // Pick new color for random game
        this.selectImage(randomImage)
      }
    },
    
    /**
     * Generate a new puzzle board with proper scrambling
     * @throws {AppError} If puzzle generation fails
     */
    generatePuzzle() {
      try {
        const size = this.puzzleSize
        const totalPieces = size * size
        
        // Create solved state (1-8, then 0 for empty space)
        this.solution = Array.from({ length: totalPieces }, (_, i) => i === totalPieces - 1 ? 0 : i + 1)
        
        // Create initial scrambled state
        this.board = [...this.solution]
        this.scrambleBoard()
        
        // Validate the generated board
        if (!validatePuzzleBoard(this.board, size)) {
          throw new AppError(
            'Generated puzzle board is invalid',
            ERROR_TYPES.GAME_LOGIC,
            ERROR_SEVERITY.HIGH
          )
        }
        
        // Check solvability (for debugging)
        const puzzleLogic = usePuzzleLogic(this)
        if (!puzzleLogic.isSolvable(this.board, size)) {
          console.warn('⚠️ Generated puzzle may not be solvable!')
        } else {
          console.log('✅ Generated puzzle is solvable')
        }
        
        // Set empty position
        const emptyIndex = this.board.indexOf(0)
        this.emptyPosition = {
          row: Math.floor(emptyIndex / size),
          col: emptyIndex % size
        }
        
        console.log(`🧩 Generated ${size}x${size} puzzle:`, this.board)
      } catch (error) {
        logError(error, 'generatePuzzle')
        throw error
      }
    },
    
    /**
     * Scramble the board using a solvable algorithm
     * Ensures the puzzle can always be solved by only making valid moves
     */
    scrambleBoard() {
      try {
        const size = this.puzzleSize
        const totalPieces = size * size
        const scrambleMoves = Math.max(50, totalPieces * 3) // Ensure enough moves for good scrambling
        
        // Start with solved state and make random valid moves
        for (let i = 0; i < scrambleMoves; i++) {
          const validMoves = this.getValidMoves()
          if (validMoves.length > 0) {
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
            this.performMove(randomMove)
          }
        }
        
        console.log(`🔄 Board scrambled with ${scrambleMoves} valid moves`)
      } catch (error) {
        logError(error, 'scrambleBoard')
        // If scrambling fails, use a simple but safe method
        this.safeShuffle()
      }
    },
    
    /**
     * Safe shuffle method that ensures solvability
     * Uses the fact that any arrangement reachable by valid moves is solvable
     */
    safeShuffle() {
      const size = this.puzzleSize
      const totalPieces = size * size
      
      // Make a small number of random valid moves to create a simple scramble
      for (let i = 0; i < 20; i++) {
        const validMoves = this.getValidMoves()
        if (validMoves.length > 0) {
          const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
          this.performMove(randomMove)
        }
      }
      
      console.log('🔄 Board safely shuffled with minimal moves')
    },
    
    /**
     * Get valid moves for the current board state
     * @returns {Array} Array of valid move indices
     */
    getValidMoves() {
      const moves = []
      const size = this.puzzleSize
      const emptyIndex = this.board.indexOf(0)
      
      if (emptyIndex === -1) {
        console.warn('No empty space found in board')
        return moves
      }
      
      const emptyRow = Math.floor(emptyIndex / size)
      const emptyCol = emptyIndex % size
      
      // Check all adjacent positions
      const adjacentPositions = [
        { row: emptyRow - 1, col: emptyCol }, // Up
        { row: emptyRow + 1, col: emptyCol }, // Down
        { row: emptyRow, col: emptyCol - 1 }, // Left
        { row: emptyRow, col: emptyCol + 1 }  // Right
      ]
      
      adjacentPositions.forEach(({ row, col }) => {
        if (row >= 0 && row < size && col >= 0 && col < size) {
          const index = row * size + col
          moves.push(index)
        }
      })
      
      return moves
    },
    
    /**
     * Perform a move without validation (for scrambling)
     * @param {number} pieceIndex - Index of piece to move
     */
    performMove(pieceIndex) {
      const size = this.puzzleSize
      const emptyIndex = this.board.indexOf(0)
      
      if (emptyIndex === -1) {
        console.warn('No empty space found for move')
        return
      }
      
      // Validate that the move is actually valid
      const pieceRow = Math.floor(pieceIndex / size)
      const pieceCol = pieceIndex % size
      const emptyRow = Math.floor(emptyIndex / size)
      const emptyCol = emptyIndex % size
      
      // Check if piece is adjacent to empty space
      const isAdjacent = (
        (Math.abs(pieceRow - emptyRow) === 1 && pieceCol === emptyCol) ||
        (Math.abs(pieceCol - emptyCol) === 1 && pieceRow === emptyRow)
      )
      
      if (!isAdjacent) {
        console.warn('Invalid move attempted during scrambling')
        return
      }
      
      // Swap piece with empty space
      ;[this.board[pieceIndex], this.board[emptyIndex]] = [this.board[emptyIndex], this.board[pieceIndex]]
    },
    
    /**
     * Attempt to move a piece on the puzzle board
     * @param {number} pieceIndex - Index of the piece to move
     * @returns {boolean} True if move was successful
     * @throws {AppError} If move validation fails
     */
    movePiece(pieceIndex) {
      try {
        if (this.animating) {
          return false
        }
        
        // Validate piece index
        if (pieceIndex < 0 || pieceIndex >= this.board.length) {
          throw new AppError(
            `Invalid piece index: ${pieceIndex}`,
            ERROR_TYPES.VALIDATION,
            ERROR_SEVERITY.MEDIUM
          )
        }
        
        const size = this.puzzleSize
        const pieceRow = Math.floor(pieceIndex / size)
        const pieceCol = pieceIndex % size
        const emptyRow = this.emptyPosition.row
        const emptyCol = this.emptyPosition.col
        
        // Check if piece is adjacent to empty space
        const isAdjacent = (
          (Math.abs(pieceRow - emptyRow) === 1 && pieceCol === emptyCol) ||
          (Math.abs(pieceCol - emptyCol) === 1 && pieceRow === emptyRow)
        )
        
        if (!isAdjacent) {
          return false
        }
        
        // Swap piece with empty space
        const emptyIndex = emptyRow * size + emptyCol
        ;[this.board[pieceIndex], this.board[emptyIndex]] = [this.board[emptyIndex], this.board[pieceIndex]]
        
        // Update empty position
        this.emptyPosition = { row: pieceRow, col: pieceCol }
        
        // Increment moves
        this.moves++
        
        // Check if puzzle is solved
        if (this.isSolved) {
          this.gameState = 'won'
          console.log(`🎉 Puzzle solved in ${this.moves} moves!`)
        }
        
        return true
      } catch (error) {
        logError(error, 'movePiece', { pieceIndex })
        throw error
      }
    },
    
    // Reset current puzzle
    resetPuzzle() {
      this.randomizeColor() // Pick new color on reset
      this.generatePuzzle()
      this.moves = 0
      this.startTime = Date.now()
      this.gameState = 'playing'
    },
    
    // Start new game
    startNewGame() {
      this.startWelcome()
    },
    
    /**
     * Randomly select a color from available colors
     */
    randomizeColor() {
      const randomIndex = Math.floor(Math.random() * this.availableColors.length)
      this.currentColor = this.availableColors[randomIndex]
      console.log(`🎨 New color selected: ${this.currentColor}`)
      
      // Update CSS custom property for immediate visual feedback
      document.documentElement.style.setProperty('--current-puzzle-color', `var(--puzzle-${this.currentColor})`)
      document.documentElement.style.setProperty('--current-puzzle-color-dark', `var(--puzzle-${this.currentColor}-dark)`)
    },
    
    // Reset shown images (for testing)
    resetShownImages() {
      this.shownImages = []
    }
  }
}) 