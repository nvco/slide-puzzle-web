<template>
  <div class="welcome-screen">
    <div class="welcome-animation">
      <!-- Animated Demo Puzzle with Classic Plastic Frame -->
      <div class="demo-puzzle">
        <div class="puzzle-frame">
          <!-- Puzzle playing area -->
          <div class="puzzle-well">
            <div class="demo-board">
              <div 
                v-for="(piece, index) in demoPieces"
                :key="index"
                class="demo-piece"
                :class="{ 'empty': piece === 0, 'moving': movingPiece === index }"
                :style="getDemoPieceStyle(piece)"
              >
                <div v-if="piece !== 0" class="demo-number">{{ piece }}</div>
              </div>
            </div>
          </div>
          
          <!-- Reference image at bottom -->
          <div class="reference-image">
            <div class="reference-content">
              <span class="reference-text">NUMBERS</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Welcome Message -->
      <div class="welcome-message">
        <h1 class="welcome-title">🧩 Welcome to Slide Puzzle Fun! 🧩</h1>
        <p class="welcome-subtitle">Watch how the pieces slide...</p>
        <div class="demo-instructions">
          <div class="instruction-step">
            <span class="step-number">1</span>
            <span class="step-text">Choose a picture</span>
          </div>
          <div class="instruction-step">
            <span class="step-number">2</span>
            <span class="step-text">Slide the pieces</span>
          </div>
          <div class="instruction-step">
            <span class="step-number">3</span>
            <span class="step-text">Complete the puzzle!</span>
          </div>
        </div>
      </div>

      <!-- Start Button -->
      <button 
        @click="startGame" 
        class="start-button"
        aria-label="Start the slide puzzle game"
      >
        ✨ Let's Play! ✨
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { ANIMATION_DURATIONS } from '@/utils/constants'

const gameStore = useGameStore()

// Demo animation state
const demoPieces = ref([1, 2, 3, 4, 5, 6, 7, 8, 0])
const movingPiece = ref(null)
const animationInterval = ref(null)

// Demo moves sequence
const demoMoves = [
  { from: 7, to: 8 }, // Move 8 down
  { from: 4, to: 7 }, // Move 5 down
  { from: 1, to: 4 }, // Move 2 down
  { from: 2, to: 1 }, // Move 3 left
  { from: 5, to: 2 }, // Move 6 left
  { from: 8, to: 5 }, // Move empty up
  { from: 7, to: 8 }, // Move 8 right
  { from: 6, to: 7 }, // Move 7 right
  { from: 3, to: 6 }, // Move 4 down
  { from: 0, to: 3 }, // Move 1 down
]

let currentMoveIndex = 0

// Style for demo pieces
const getDemoPieceStyle = (piece) => {
  if (piece === 0) return { opacity: 0 }
  
  return {
    backgroundColor: '#ffffff',
    transform: movingPiece.value === piece ? 'scale(1.05)' : 'scale(1)'
  }
}

// Animate demo moves
const animateDemo = () => {
  if (demoMoves.length === 0) return
  
  const move = demoMoves[currentMoveIndex]
  
  // Highlight moving piece
  movingPiece.value = demoPieces.value[move.from]
  
  setTimeout(() => {
    // Perform the move
    const temp = demoPieces.value[move.from]
    demoPieces.value[move.from] = demoPieces.value[move.to]
    demoPieces.value[move.to] = temp
    
    // Clear highlight
    movingPiece.value = null
    
    // Next move
    currentMoveIndex = (currentMoveIndex + 1) % demoMoves.length
  }, ANIMATION_DURATIONS.DEMO_MOVE_DELAY)
}

// Start the game
const startGame = () => {
  gameStore.showImageSelection()
}

// Lifecycle
onMounted(() => {
  console.log('👋 Welcome screen mounted')
  
  // Start demo animation
  setTimeout(() => {
    animationInterval.value = setInterval(animateDemo, ANIMATION_DURATIONS.DEMO_INTERVAL)
  }, 1000)
})

onUnmounted(() => {
  if (animationInterval.value) {
    clearInterval(animationInterval.value)
  }
})
</script>

<style scoped>
.welcome-screen {
  @apply min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50;
  @apply flex items-center justify-center p-4;
}

.welcome-animation {
  @apply text-center max-w-2xl mx-auto;
}

.demo-puzzle {
  @apply mb-12;
}

/* Classic Plastic Frame */
.puzzle-frame {
  @apply relative mx-auto w-80 h-96;
  @apply bg-gradient-to-br from-blue-400 to-blue-500;
  @apply rounded-3xl;
  @apply shadow-2xl;
  @apply p-8;
  
  /* Glossy plastic effect */
  background-image: 
    linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
}

.puzzle-well {
  @apply w-full h-64;
  @apply bg-white/90;
  @apply rounded-lg;
  @apply shadow-inner;
  @apply p-1;
  @apply mb-4;
}

.reference-image {
  @apply w-full h-16;
  @apply bg-white/90;
  @apply rounded-lg;
  @apply shadow-inner;
  @apply flex items-center justify-center;
}

.reference-content {
  @apply text-center;
}

.reference-text {
  @apply text-lg font-bold text-blue-600;
  @apply tracking-wide;
}

.demo-board {
  @apply w-full h-full;
  @apply grid grid-cols-3 grid-rows-3 gap-1;
  @apply bg-transparent;
  @apply rounded;
}

.demo-piece {
  @apply rounded-md;
  @apply flex items-center justify-center;
  @apply transition-all duration-300 ease-out;
  @apply relative;
  @apply shadow-md;
  @apply border border-white/30;
  
  /* Subtle glossy effect */
  background-image: 
    linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%);
}

.demo-piece.empty {
  @apply opacity-0;
  box-shadow: none;
}

.demo-piece.moving {
  @apply shadow-lg;
}

.demo-number {
  @apply text-2xl font-bold text-gray-800;
  @apply filter drop-shadow-sm;
  @apply font-sans;
}



.welcome-message {
  @apply mb-8;
}

.welcome-title {
  @apply text-3xl font-bold text-puzzle-primary mb-4;
  @apply md:text-4xl;
  @apply animate-bounce-in;
}

.welcome-subtitle {
  @apply text-lg text-gray-600 mb-6;
  @apply md:text-xl;
}

.demo-instructions {
  @apply flex flex-col justify-center items-center space-y-4 mb-6;
  @apply sm:flex-row sm:space-y-0 sm:space-x-8 sm:mb-8;
}

.instruction-step {
  @apply flex items-center space-x-2;
}

.step-number {
  @apply w-8 h-8 bg-puzzle-accent text-white rounded-full;
  @apply flex items-center justify-center font-bold text-sm;
  @apply shadow-md;
}

.step-text {
  @apply text-gray-700 font-medium;
}

.start-button {
  @apply btn-primary text-2xl px-12 py-4;
  @apply animate-pulse hover:animate-none;
  @apply transform hover:scale-105 transition-transform;
  @apply shadow-2xl;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .puzzle-frame {
    @apply w-64 h-80 p-5;
  }
  
  .puzzle-well {
    @apply h-48 p-1 mb-3;
  }
  
  .reference-image {
    @apply h-16;
  }
  
  .reference-text {
    @apply text-base;
  }
  
  .demo-number {
    @apply text-lg;
  }
  
  .welcome-title {
    @apply text-3xl;
  }
  
  .welcome-subtitle {
    @apply text-lg;
  }
  
  .start-button {
    @apply text-xl px-8 py-3;
  }
  
  .demo-instructions {
    @apply flex-col space-y-3;
  }
}
</style> 