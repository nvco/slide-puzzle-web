<template>
  <div class="welcome-screen">
    <div class="welcome-animation">
      <!-- Animated Demo Puzzle -->
      <div class="demo-puzzle">
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
      <button @click="startGame" class="start-button">
        ✨ Let's Play! ✨
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'

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
  
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#F4A460', '#87CEEB'
  ]
  
  return {
    backgroundColor: colors[(piece - 1) % colors.length],
    transform: movingPiece.value === piece ? 'scale(1.1)' : 'scale(1)'
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
  }, 300)
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
    animationInterval.value = setInterval(animateDemo, 1500)
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
  @apply min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100;
  @apply flex items-center justify-center p-4;
}

.welcome-animation {
  @apply text-center max-w-2xl mx-auto;
}

.demo-puzzle {
  @apply mb-8;
}

.demo-board {
  @apply w-48 h-48 mx-auto bg-white rounded-xl shadow-2xl border-4 border-puzzle-primary p-2;
  @apply grid grid-cols-3 grid-rows-3 gap-1;
}

.demo-piece {
  @apply rounded-lg border-2 border-white;
  @apply flex items-center justify-center;
  @apply transition-all duration-300 ease-out;
  @apply shadow-md;
}

.demo-piece.empty {
  @apply opacity-0;
}

.demo-piece.moving {
  @apply shadow-xl;
}

.demo-number {
  @apply text-2xl font-bold text-white;
  @apply filter drop-shadow-lg;
}

.welcome-message {
  @apply mb-8;
}

.welcome-title {
  @apply text-4xl font-bold text-puzzle-primary mb-4;
  @apply animate-bounce-in;
}

.welcome-subtitle {
  @apply text-xl text-gray-600 mb-6;
}

.demo-instructions {
  @apply flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8;
  @apply mb-8;
}

.instruction-step {
  @apply flex items-center space-x-2;
}

.step-number {
  @apply w-8 h-8 bg-puzzle-accent text-white rounded-full;
  @apply flex items-center justify-center font-bold text-sm;
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
  .welcome-title {
    @apply text-3xl;
  }
  
  .welcome-subtitle {
    @apply text-lg;
  }
  
  .demo-board {
    @apply w-40 h-40;
  }
  
  .demo-number {
    @apply text-xl;
  }
  
  .start-button {
    @apply text-xl px-8 py-3;
  }
  
  .demo-instructions {
    @apply flex-col space-y-3;
  }
}
</style> 