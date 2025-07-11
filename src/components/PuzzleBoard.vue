<template>
  <div class="puzzle-container">
    <!-- Puzzle Board -->
    <div 
      class="puzzle-board-wrapper flip-3d"
      :class="{ 'flipped': isFlipped }"
    >
      <!-- Front side - Solved puzzle preview -->
      <div class="puzzle-face flip-front">
        <div 
          class="puzzle-board solved-preview"
          :class="`grid-${puzzleSize}x${puzzleSize}`"
        >
          <div
            v-for="(piece, index) in solvedPieces"
            :key="`solved-${index}`"
            class="puzzle-piece solved-piece"
            :style="getPieceStyle(piece, index)"
          >
            <img 
              v-if="currentImage"
              :src="currentImage.path"
              :alt="currentImage.alt"
              class="piece-image"
              draggable="false"
            />
          </div>
        </div>
      </div>

      <!-- Back side - Scrambled puzzle game -->
      <div class="puzzle-face flip-back">
        <div 
          class="puzzle-board game-board"
          :class="`grid-${puzzleSize}x${puzzleSize}`"
        >
          <div
            v-for="(piece, index) in gamePieces"
            :key="`game-${index}`"
            class="puzzle-piece game-piece"
            :class="{ 
              'empty': piece === 0,
              'moveable': isMoveable(index),
              'animating': animating 
            }"
            :style="getPieceStyle(piece, index)"
            @click="movePiece(index)"
            @touchstart="handleTouchStart(index)"
            @touchend="handleTouchEnd(index)"
          >
            <img 
              v-if="piece !== 0 && currentImage"
              :src="currentImage.path"
              :alt="currentImage.alt"
              class="piece-image"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Game Controls -->
    <div class="game-controls" v-if="!showPreview">
      <div class="game-stats">
        <div class="stat-item">
          <span class="stat-label">Moves:</span>
          <span class="stat-value">{{ moves }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Time:</span>
          <span class="stat-value">{{ formatTime(elapsedTime) }}</span>
        </div>
      </div>
      
      <div class="action-buttons">
        <button @click="resetPuzzle" class="btn-secondary">
          🔄 Reset
        </button>
        <button @click="newGame" class="btn-primary">
          🎮 New Game
        </button>
      </div>
    </div>

    <!-- Ready to Play Button -->
    <div class="ready-controls" v-if="showPreview">
      <button @click="startGame" class="btn-primary ready-btn">
        🎯 Ready to Play!
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

// Reactive state
const isFlipped = ref(false)
const animating = ref(false)
const showPreview = ref(true)
const touchStartIndex = ref(null)

// Computed properties
const puzzleSize = computed(() => gameStore.puzzleSize)
const moves = computed(() => gameStore.moves)
const elapsedTime = computed(() => gameStore.elapsedTime)
const currentImage = computed(() => gameStore.currentPuzzle)
const gamePieces = computed(() => gameStore.board)
const gameState = computed(() => gameStore.gameState)

// Generate solved pieces for preview
const solvedPieces = computed(() => {
  const size = puzzleSize.value
  return Array.from({ length: size * size }, (_, i) => i)
})

// Check if a piece can move
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

// Get CSS styles for each piece
const getPieceStyle = (piece, index) => {
  const size = puzzleSize.value
  const pieceSize = 100 / size
  
  if (piece === 0) {
    return {
      opacity: 0,
      pointerEvents: 'none'
    }
  }
  
  // Calculate background position for image cropping
  const originalRow = Math.floor((piece - 1) / size)
  const originalCol = (piece - 1) % size
  
  return {
    backgroundImage: currentImage.value ? `url(${currentImage.value.path})` : 'none',
    backgroundSize: `${size * 100}% ${size * 100}%`,
    backgroundPosition: `-${originalCol * pieceSize}% -${originalRow * pieceSize}%`,
    aspectRatio: '1/1'
  }
}

// Format time display
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Handle piece movement
const movePiece = (index) => {
  if (animating.value || showPreview.value) return
  
  const moved = gameStore.movePiece(index)
  if (moved) {
    animating.value = true
    setTimeout(() => {
      animating.value = false
      
      // Check for win condition
      if (gameStore.isSolved) {
        celebrateWin()
      }
    }, 300)
  }
}

// Touch handling for mobile
const handleTouchStart = (index) => {
  touchStartIndex.value = index
}

const handleTouchEnd = (index) => {
  if (touchStartIndex.value === index) {
    movePiece(index)
  }
  touchStartIndex.value = null
}

// Start the game (flip animation)
const startGame = async () => {
  showPreview.value = false
  
  // 3D flip animation
  isFlipped.value = true
  
  // Wait for flip animation to complete
  await new Promise(resolve => setTimeout(resolve, 600))
  
  // Generate and scramble the puzzle
  gameStore.generatePuzzle()
  gameStore.gameState = 'playing'
  gameStore.startTime = Date.now()
}

// Reset current puzzle
const resetPuzzle = () => {
  gameStore.resetPuzzle()
  animating.value = false
}

// Start new game
const newGame = () => {
  gameStore.startNewGame()
  isFlipped.value = false
  showPreview.value = true
}

// Celebrate win
const celebrateWin = () => {
  console.log('🎉 Puzzle solved!')
  // TODO: Add celebration animation
}

// Watch for game state changes
watch(gameState, (newState) => {
  if (newState === 'won') {
    setTimeout(() => {
      celebrateWin()
    }, 500)
  }
})

onMounted(() => {
  console.log('🧩 PuzzleBoard component mounted')
})
</script>

<style scoped>
.puzzle-container {
  @apply flex flex-col items-center space-y-6;
}

.puzzle-board-wrapper {
  @apply relative;
  width: 300px;
  height: 300px;
  transition: transform 0.6s ease-in-out;
}

.puzzle-board-wrapper.flipped {
  transform: rotateY(180deg);
}

.puzzle-face {
  @apply absolute inset-0 w-full h-full;
  backface-visibility: hidden;
}

.flip-back {
  transform: rotateY(180deg);
}

.puzzle-board {
  @apply w-full h-full bg-white rounded-xl shadow-2xl border-4 border-puzzle-primary p-2;
  @apply grid gap-1;
}

.puzzle-board.grid-3x3 {
  @apply grid-cols-3 grid-rows-3;
}

.puzzle-board.grid-4x4 {
  @apply grid-cols-4 grid-rows-4;
}

.puzzle-piece {
  @apply relative rounded-lg border-2 border-gray-300 overflow-hidden;
  @apply transition-all duration-300 ease-out;
  background-repeat: no-repeat;
  cursor: pointer;
}

.puzzle-piece.empty {
  @apply opacity-0 pointer-events-none;
}

.puzzle-piece.moveable {
  @apply border-puzzle-accent shadow-lg;
  @apply hover:scale-105 hover:shadow-xl;
}

.puzzle-piece.animating {
  @apply transition-transform duration-300 ease-out;
}

.puzzle-piece.solved-piece {
  @apply border-gray-400 cursor-default;
  @apply hover:scale-100 hover:shadow-md;
}

.piece-image {
  @apply w-full h-full object-cover;
}

.game-controls {
  @apply flex flex-col items-center space-y-4;
}

.game-stats {
  @apply flex space-x-6;
}

.stat-item {
  @apply flex flex-col items-center;
}

.stat-label {
  @apply text-sm text-gray-600 font-medium;
}

.stat-value {
  @apply text-2xl font-bold text-puzzle-primary;
}

.action-buttons {
  @apply flex space-x-4;
}

.ready-controls {
  @apply flex justify-center;
}

.ready-btn {
  @apply text-xl px-8 py-4 animate-pulse;
  font-size: 1.25rem;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .puzzle-board-wrapper {
    width: 280px;
    height: 280px;
  }
  
  .game-stats {
    @apply flex-col space-y-2 space-x-0;
  }
  
  .action-buttons {
    @apply flex-col space-y-2 space-x-0;
  }
}
</style> 