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
          @keydown.enter="() => movePiece(index)"
          @keydown.space="() => movePiece(index)"
        />
      </div>
    </div>

    <!-- Controls moved to App.vue -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { usePuzzleLogic } from '@/composables/usePuzzleLogic'
import { handleAsync, logError, AppError, ERROR_TYPES, ERROR_SEVERITY } from '@/utils/errorHandler'
import { throttle } from '@/utils/errorHandler'
import PuzzlePiece from './PuzzlePiece.vue'

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

// Computed properties
const currentImage = computed(() => gameStore.currentPuzzle)

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
        }, 300) // Animation duration for piece movement
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
}



// Watch for game state changes for any needed logic
watch(gameState, (newState) => {
  if (newState === 'won') {
    console.log('🎉 Puzzle solved!')
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

// Expose methods for parent component
defineExpose({
  resetPuzzle
})
</script>

<style scoped>
.puzzle-container {
  @apply flex flex-col items-center pt-4 pb-6;
  width: 90%;
}

.puzzle-board-wrapper {
  @apply relative w-full h-auto;
  @apply transition-transform duration-500 ease-in-out;
}

.puzzle-board {
  @apply w-full h-full rounded-xl border-4;
  @apply grid gap-[0.1rem];
  @apply aspect-square;
  background: var(--current-puzzle-color-dark);
  border-color: var(--current-puzzle-color-dark);
  box-shadow: 0px 0px 2px 1px rgb(0 0 0 / 0.21);
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
  @apply border-puzzle-accent cursor-grab;
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
  @apply focus:ring-2 focus:ring-gray-400 focus:outline-none;
}

.piece-number {
  @apply text-2xl font-bold text-white;
  @apply md:text-3xl;
  @apply select-none;
}





/* Mobile responsiveness */
@media (max-width: 640px) {
  .puzzle-board-wrapper {
    @apply w-full h-auto;
  }
  
  .puzzle-piece {
    @apply min-w-12 min-h-12; /* Ensure larger touch targets on mobile */
  }
  
  .piece-number {
    @apply text-2xl;
  }
}

</style> 