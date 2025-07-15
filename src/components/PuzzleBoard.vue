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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { ANIMATION_DURATIONS } from '@/utils/constants'
import { usePuzzleLogic } from '@/composables/usePuzzleLogic'
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

// Computed properties
const moves = computed(() => gameStore.moves)
const elapsedTime = computed(() => gameStore.elapsedTime)
const currentImage = computed(() => gameStore.currentPuzzle)



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
    }, ANIMATION_DURATIONS.PIECE_MOVE)
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
  await new Promise(resolve => setTimeout(resolve, ANIMATION_DURATIONS.FLIP))
  
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
    }, ANIMATION_DURATIONS.VICTORY_DELAY)
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
</style> 