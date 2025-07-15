import { defineStore } from 'pinia'
import { AppError, ERROR_TYPES, ERROR_SEVERITY, logError, validatePuzzleBoard } from '@/utils/errorHandler'

export const useGameStore = defineStore('game', {
  state: () => ({
    // Game state
    currentPuzzle: null,
    puzzleSize: 3, // 3x3 grid (8 pieces + 1 empty)
    gameState: 'welcome', // 'welcome', 'selecting', 'playing', 'won'
    moves: 0,
    startTime: null,
    
    // Image management
    availableImages: [],
    shownImages: [],
    currentImageIndex: 0,
    
    // Puzzle board state
    board: [], // Array of piece positions
    solution: [], // Solved state
    emptyPosition: { row: 2, col: 2 }, // Position of empty space
    
    // UI state
    showWelcome: true,
    showImageGallery: false,
    showPuzzle: false,
    animating: false,
  }),

  getters: {
    // Check if current puzzle is solved
    isSolved: (state) => {
      if (!state.board.length || !state.solution.length) return false
      return JSON.stringify(state.board) === JSON.stringify(state.solution)
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
      this.showImageGallery = false
      this.showPuzzle = false
    },
    
    // Show image gallery for selection
    showImageSelection() {
      this.gameState = 'selecting'
      this.showWelcome = false
      this.showImageGallery = true
      this.showPuzzle = false
    },
    
    // Select an image and prepare puzzle
    selectImage(image) {
      this.currentPuzzle = image
      this.shownImages.push(image.id)
      this.generatePuzzle()
      this.gameState = 'playing'
      this.showImageGallery = false
      this.showPuzzle = true
      this.startTime = Date.now()
      this.moves = 0
    },
    
    // Select random image
    selectRandomImage() {
      const randomImage = this.randomUnshownImage
      if (randomImage) {
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
        
        // Create solved state (0 represents empty space)
        this.solution = Array.from({ length: totalPieces }, (_, i) => i)
        
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
        
        // Set empty position
        const emptyIndex = this.board.indexOf(0)
        this.emptyPosition = {
          row: Math.floor(emptyIndex / size),
          col: emptyIndex % size
        }
        
        console.log(`🧩 Generated ${size}x${size} puzzle`)
      } catch (error) {
        logError(error, 'generatePuzzle')
        throw error
      }
    },
    
    /**
     * Scramble the board using a solvable algorithm
     * Ensures the puzzle can always be solved
     */
    scrambleBoard() {
      try {
        const size = this.puzzleSize
        const moves = size * size * 2 // Number of random moves to perform
        
        for (let i = 0; i < moves; i++) {
          const validMoves = this.getValidMoves()
          if (validMoves.length > 0) {
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
            this.performMove(randomMove)
          }
        }
        
        console.log(`🔄 Board scrambled with ${moves} random moves`)
      } catch (error) {
        logError(error, 'scrambleBoard')
        // Fallback to simple shuffle if scrambling fails
        this.fallbackShuffle()
      }
    },
    
    /**
     * Fallback shuffle method if proper scrambling fails
     */
    fallbackShuffle() {
      for (let i = this.board.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[this.board[i], this.board[j]] = [this.board[j], this.board[i]]
      }
    },
    
    /**
     * Get valid moves for the current board state
     * @returns {Array} Array of valid move indices
     */
    getValidMoves() {
      const moves = []
      const size = this.puzzleSize
      const emptyIndex = this.board.indexOf(0)
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
      const pieceRow = Math.floor(pieceIndex / size)
      const pieceCol = pieceIndex % size
      const emptyRow = this.emptyPosition.row
      const emptyCol = this.emptyPosition.col
      
      // Swap piece with empty space
      const emptyIndex = emptyRow * size + emptyCol
      ;[this.board[pieceIndex], this.board[emptyIndex]] = [this.board[emptyIndex], this.board[pieceIndex]]
      
      // Update empty position
      this.emptyPosition = { row: pieceRow, col: pieceCol }
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
      this.generatePuzzle()
      this.moves = 0
      this.startTime = Date.now()
      this.gameState = 'playing'
    },
    
    // Start new game
    startNewGame() {
      this.showImageSelection()
    },
    
    // Reset shown images (for testing)
    resetShownImages() {
      this.shownImages = []
    }
  }
}) 