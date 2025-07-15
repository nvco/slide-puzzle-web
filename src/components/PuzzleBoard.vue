<template>
  <div class="puzzle-container">
    <!-- Screen reader instruction -->
    <div id="moveable-piece-instruction" class="sr-only">
      Press Enter or Space to move this piece
    </div>
    
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
          <PuzzlePiece
            v-for="(piece, index) in solvedPieces"
            :key="`solved-${index}`"
            :piece="piece"
            :isSolved="true"
            :pieceStyle="getPieceStyle(piece, index)"
            :ariaLabel="piece === 0 ? 'Empty space' : `Solved puzzle piece ${piece}`"
            :role="'presentation'"
            :tabIndex="-1"
          />
        </div>
      </div>

      <!-- Back side - Scrambled puzzle game -->
      <div class="puzzle-face flip-back">
        <div 
          class="puzzle-board game-board"
          :class="`grid-${puzzleSize}x${puzzleSize}`"
          role="grid"
          :aria-label="`${puzzleSize}x${puzzleSize} puzzle board`"
        >
          <PuzzlePiece
            v-for="(piece, index) in gamePieces"
            :key="`game-${index}`"
            :piece="piece"
            :isMoveable="isMoveable(index)"
            :isAnimating="animating"
            :pieceStyle="getPieceStyle(piece, index)"
            :ariaLabel="piece === 0 ? 'Empty space' : `Move puzzle piece ${piece}`"
            :ariaDescribedBy="isMoveable(index) ? 'moveable-piece-instruction' : undefined"
            :role="'button'"
            :tabIndex="0"
            @click="() => movePiece(index)"
            @touchstart="() => handleTouchStart(index)"
            @touchend="() => handleTouchEnd(index)"
            @keydown-enter="() => movePiece(index)"
            @keydown-space="() => movePiece(index)"
          />
        </div>
      </div>
    </div>

    <!-- Game Controls -->
    <GameControls
      v-if="!showPreview"
      :moves="moves"
      :elapsedTime="elapsedTime"
      @reset="resetPuzzle"
      @new-game="newGame"
    />

    <!-- Ready to Play Button -->
    <div class="ready-controls" v-if="showPreview">
      <button 
        @click="startGame" 
        class="btn-primary ready-btn"
        aria-label="Start the puzzle game"
      >
        🎯 Ready to Play!
      </button>
    </div>

    <!-- Celebration Overlay -->
    <div 
      v-if="showCelebration" 
      class="celebration-overlay"
      role="dialog"
      aria-label="Puzzle solved celebration"
    >
      <!-- Confetti Container -->
      <div class="confetti-container">
        <div 
          v-for="i in 50" 
          :key="i"
          class="confetti"
          :style="getConfettiStyle(i)"
        ></div>
      </div>
      
      <!-- Victory Message -->
      <div class="victory-message">
        <div class="victory-icon">🎉</div>
        <h2 class="victory-title">Puzzle Solved!</h2>
        <div class="victory-stats">
          <p>Moves: {{ moves }}</p>
          <p>Time: {{ formatTime(elapsedTime) }}</p>
        </div>
        <div class="victory-actions">
          <button 
            @click="playAgain" 
            class="btn-primary"
            aria-label="Play another puzzle"
          >
            🎮 Play Again
          </button>
          <button 
            @click="newGame" 
            class="btn-secondary"
            aria-label="Choose a different image"
          >
            🖼️ New Image
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { ANIMATION_DURATIONS } from '@/utils/constants'
import { usePuzzleLogic } from '@/composables/usePuzzleLogic'
import { handleAsync, logError, AppError, ERROR_TYPES, ERROR_SEVERITY } from '@/utils/errorHandler'
import { throttle } from '@/utils/errorHandler'
import PuzzlePiece from './PuzzlePiece.vue'
import GameControls from './GameControls.vue'

const gameStore = useGameStore()

// Use puzzle logic composable
const {
  puzzleSize,
  gamePieces,
  gameState,
  solvedPieces,
  isMoveable,
  getPieceStyle,
} = usePuzzleLogic(gameStore)

// Reactive state
const isFlipped = ref(false)
const animating = ref(false)
const showPreview = ref(true)
const touchStartIndex = ref(null)
const showCelebration = ref(false)

// Computed properties
const moves = computed(() => gameStore.moves)
const elapsedTime = computed(() => gameStore.elapsedTime)
const currentImage = computed(() => gameStore.currentPuzzle)

/**
 * Format time in MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Generate confetti animation styles
 * @param {number} index - Confetti piece index
 * @returns {Object} CSS style object
 */
const getConfettiStyle = (index) => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F4A460', '#87CEEB']
  const color = colors[index % colors.length]
  const left = Math.random() * 100
  const animationDelay = Math.random() * 3
  const animationDuration = 2 + Math.random() * 2
  
  return {
    left: `${left}%`,
    backgroundColor: color,
    animationDelay: `${animationDelay}s`,
    animationDuration: `${animationDuration}s`
  }
}

// Throttled piece movement to prevent rapid clicking
const throttledMovePiece = throttle((index) => {
  if (animating.value || showPreview.value) return
  
  handleAsync(
    async () => {
      const moved = gameStore.movePiece(index)
      if (moved) {
        animating.value = true
        setTimeout(() => {
          animating.value = false
        }, ANIMATION_DURATIONS.PIECE_MOVE)
      }
      return moved
    },
    'movePiece',
    (error) => {
      console.error('Failed to move piece:', error.message)
      // Reset animation state on error
      animating.value = false
    }
  )
}, 100)

// Handle piece movement
const movePiece = (index) => {
  throttledMovePiece(index)
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
  try {
    showPreview.value = false
    
    // 3D flip animation
    isFlipped.value = true
    
    // Wait for flip animation to complete
    await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATIONS.FLIP))
    
    // Generate and scramble the puzzle
    await handleAsync(
      async () => {
        gameStore.generatePuzzle()
        gameStore.gameState = 'playing'
        gameStore.startTime = Date.now()
      },
      'startGame',
      (error) => {
        console.error('Failed to start game:', error.message)
        // Reset to preview state on error
        showPreview.value = true
        isFlipped.value = false
      }
    )
  } catch (error) {
    logError(error, 'startGame')
    // Reset to preview state on error
    showPreview.value = true
    isFlipped.value = false
  }
}

// Reset current puzzle
const resetPuzzle = () => {
  gameStore.resetPuzzle()
  animating.value = false
  showCelebration.value = false
}

// Start new game
const newGame = () => {
  gameStore.startNewGame()
  isFlipped.value = false
  showPreview.value = true
  showCelebration.value = false
}

// Play again with same image
const playAgain = () => {
  showCelebration.value = false
  resetPuzzle()
}

// Celebrate win
const celebrateWin = () => {
  console.log('🎉 Puzzle solved!')
  console.log('🎉 Setting showCelebration to true')
  showCelebration.value = true
  console.log('🎉 showCelebration is now:', showCelebration.value)
}

// Watch for game state changes
watch(gameState, (newState) => {
  if (newState === 'won' && !showCelebration.value) {
    console.log('🎉 Game state changed to won, triggering celebration')
    setTimeout(() => {
      celebrateWin()
    }, ANIMATION_DURATIONS.VICTORY_DELAY)
  }
})

onMounted(() => {
  console.log('🧩 PuzzleBoard component mounted')
})

onUnmounted(() => {
  // Cleanup any pending animations or timeouts
  animating.value = false
  console.log('🧩 PuzzleBoard component unmounted')
})
</script>

<style scoped>
.puzzle-container {
  @apply flex flex-col items-center space-y-6;
}

.puzzle-board-wrapper {
  @apply relative w-72 h-72;
  @apply transition-transform duration-500 ease-in-out;
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
  @apply flex items-center justify-center;
  @apply min-w-11 min-h-11; /* Ensure 44px minimum touch target */
  @apply focus:ring-2 focus:ring-puzzle-accent focus:outline-none;
  @apply active:scale-95;
}

.puzzle-piece.empty {
  @apply opacity-0 pointer-events-none cursor-default;
}

.puzzle-piece.moveable {
  @apply border-puzzle-accent shadow-lg cursor-grab;
  @apply hover:scale-105 hover:shadow-xl;
  @apply focus:ring-2 focus:ring-puzzle-accent focus:outline-none;
  @apply active:scale-95 active:cursor-grabbing;
}

.puzzle-piece.moveable:active {
  @apply cursor-grabbing;
}

.puzzle-piece.animating {
  @apply transition-transform duration-300 ease-out cursor-wait;
}

.puzzle-piece.solved-piece {
  @apply border-gray-400 cursor-default;
  @apply hover:scale-100 hover:shadow-md;
  @apply focus:ring-2 focus:ring-gray-400 focus:outline-none;
}

.piece-number {
  @apply text-2xl font-bold text-white;
  @apply md:text-3xl;
  @apply filter drop-shadow-lg;
  @apply select-none;
}



.ready-controls {
  @apply flex justify-center;
}

.ready-btn {
  @apply text-xl px-8 py-4 animate-pulse;
  @apply text-2xl;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .puzzle-board-wrapper {
    @apply w-64 h-64;
  }
  
  .puzzle-piece {
    @apply min-w-12 min-h-12; /* Ensure larger touch targets on mobile */
  }
  
  .piece-number {
    @apply text-2xl;
  }
}

/* Celebration Overlay */
.celebration-overlay {
  @apply fixed inset-0 z-50;
  @apply flex items-center justify-center;
  @apply bg-black bg-opacity-50 backdrop-blur-sm;
  animation: fade-in 0.5s ease-out;
}

/* Confetti Animation */
.confetti-container {
  @apply absolute inset-0 pointer-events-none;
  @apply overflow-hidden;
}

.confetti {
  @apply absolute w-2 h-2 rounded-sm;
  @apply opacity-80;
  animation: confetti-fall 3s linear infinite;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* Victory Message */
.victory-message {
  @apply bg-white rounded-2xl shadow-2xl;
  @apply p-8 max-w-md mx-4;
  @apply text-center;
  @apply border-4 border-puzzle-accent;
  animation: bounce-in 0.6s ease-out;
}

.victory-icon {
  @apply text-6xl mb-4;
  @apply animate-bounce;
}

.victory-title {
  @apply text-3xl font-bold text-gray-800 mb-4;
  @apply md:text-4xl;
}

.victory-stats {
  @apply space-y-2 mb-6;
  @apply text-lg text-gray-600;
}

.victory-stats p {
  @apply font-semibold;
}

.victory-actions {
  @apply flex flex-col space-y-3;
  @apply sm:flex-row sm:space-y-0 sm:space-x-4;
}

/* Animation Keyframes */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}


</style> 