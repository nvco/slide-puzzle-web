<template>
  <div class="puzzle-container">
    <!-- Screen reader instruction -->
    <div id="moveable-piece-instruction" class="sr-only">
      Press Enter or Space to move this piece
    </div>
    
    <!-- Puzzle Board -->
    <div class="puzzle-board-wrapper">
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

    <!-- Game Controls -->
    <GameControls
      @reset="resetPuzzle"
    />

    <!-- Initial Big Bang Celebration -->
    <div 
      v-if="showBigBang" 
      class="big-bang-container"
    >
      <div class="big-bang-explosion">
        <div class="bang-text">🎉 SOLVED! 🎉</div>
        <div class="bang-stars">
          <div v-for="i in 20" :key="`star-${i}`" class="star" :style="getStarStyle(i)"></div>
        </div>
      </div>
    </div>

    <!-- Ongoing Confetti Celebration -->
    <div 
      v-if="showCelebration" 
      class="confetti-container"
    >
      <div 
        v-for="i in 50" 
        :key="i"
        class="confetti"
        :style="getConfettiStyle(i)"
      ></div>
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
const animating = ref(false)
const touchStartIndex = ref(null)
const showCelebration = ref(false)
const showBigBang = ref(false)

// Computed properties
const currentImage = computed(() => gameStore.currentPuzzle)



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

/**
 * Generate star animation styles for big bang effect
 * @param {number} index - Star index
 * @returns {Object} CSS style object
 */
const getStarStyle = (index) => {
  const angle = (index / 20) * 360
  const distance = 100 + Math.random() * 50
  const delay = Math.random() * 0.5
  
  return {
    transform: `rotate(${angle}deg) translateY(-${distance}px)`,
    animationDelay: `${delay}s`
  }
}

// Throttled piece movement to prevent rapid clicking
const throttledMovePiece = throttle((index) => {
  if (animating.value) return
  
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

// Reset current puzzle
const resetPuzzle = () => {
  gameStore.resetPuzzle()
  animating.value = false
  showCelebration.value = false
  showBigBang.value = false
}



// Play again with same image
const playAgain = () => {
  showCelebration.value = false
  showBigBang.value = false
  resetPuzzle()
}

// Celebrate win
const celebrateWin = () => {
  console.log('🎉 Puzzle solved!')
  
  // Start with big bang effect
  showBigBang.value = true
  console.log('💥 Big bang started')
  
  // After big bang, start ongoing confetti
  setTimeout(() => {
    showBigBang.value = false
    showCelebration.value = true
    console.log('🎉 Ongoing confetti started')
  }, 2000) // Big bang lasts 2 seconds
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

/* Big Bang Celebration */
.big-bang-container {
  @apply fixed inset-0 pointer-events-none z-50;
  @apply flex items-center justify-center;
  @apply overflow-hidden;
}

.big-bang-explosion {
  @apply relative;
  animation: big-bang-pulse 2s ease-out;
}

.bang-text {
  @apply text-6xl font-bold text-yellow-400;
  @apply filter drop-shadow-lg;
  @apply animate-bounce;
  animation: big-bang-text 2s ease-out;
}

.bang-stars {
  @apply absolute inset-0;
  @apply flex items-center justify-center;
}

.star {
  @apply absolute w-4 h-4;
  @apply bg-yellow-300;
  @apply rounded-full;
  animation: star-explosion 2s ease-out;
}

/* Confetti Animation */
.confetti-container {
  @apply fixed inset-0 pointer-events-none z-50;
  @apply overflow-hidden;
}

.confetti {
  @apply absolute w-2 h-2 rounded-sm;
  @apply opacity-80;
  animation: confetti-fall 3s linear infinite;
}

@keyframes big-bang-pulse {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

@keyframes big-bang-text {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.5) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0;
  }
}

@keyframes star-explosion {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    transform: scale(1) rotate(180deg);
    opacity: 1;
  }
  100% {
    transform: scale(0) rotate(360deg);
    opacity: 0;
  }
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


</style> 