<template>
  <div id="app" class="min-h-screen">
    <!-- Welcome Screen -->
    <WelcomeScreen v-if="showWelcome" />
    
    <!-- Image Selection Screen -->
    <div v-else-if="showImageGallery" class="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4 sm:p-6">
      <div class="w-full max-w-6xl min-h-0">
        <header class="text-center mb-8">
          <h1 class="text-4xl font-bold text-puzzle-primary mb-2">
            🧩 Slide Puzzle Fun! 🧩
          </h1>
          <p class="text-lg text-gray-600">
            Choose a picture and solve the puzzle!
          </p>
        </header>
        
        <main>
          <ImageGallery />
        </main>
      </div>
    </div>
    
    <!-- Puzzle Game Screen -->
    <div v-else-if="showPuzzle" class="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4 sm:p-6">
      <div class="w-full max-w-4xl min-h-0">
        <header class="text-center mb-8">
          <h1 class="text-3xl font-bold text-puzzle-primary mb-2">
            🧩 {{ currentPuzzle?.alt === 'Number Puzzle' ? 'Number Puzzle' : (currentPuzzle?.alt || 'Puzzle') }} 🧩
          </h1>
          <p class="text-lg text-gray-600">
            {{ currentPuzzle?.alt === 'Number Puzzle' ? 'Slide the numbered pieces into order!' : 'Slide the pieces to solve the puzzle!' }}
          </p>
        </header>
        
        <main>
          <PuzzleBoard />
        </main>
      </div>
    </div>
    
    <!-- Victory Screen -->
    <div v-else-if="showVictory" class="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 flex items-center justify-center p-4 sm:p-6">
      <div class="w-full max-w-2xl text-center">
        <div class="mb-8">
          <h1 class="text-5xl font-bold text-puzzle-success mb-4 animate-bounce">
            🎉 Congratulations! 🎉
          </h1>
          <p class="text-2xl text-gray-700 mb-4">
            You solved the puzzle!
          </p>
          <div class="text-lg text-gray-600 space-y-2">
            <p>✨ Moves: <span class="font-bold text-puzzle-primary">{{ moves }}</span></p>
            <p>⏱️ Time: <span class="font-bold text-puzzle-primary">{{ formatTime(elapsedTime) }}</span></p>
          </div>
        </div>
        
        <div class="space-y-4">
          <button @click="playAgain" class="btn-primary mr-4">
            🎮 Play Again
          </button>
          <button @click="newPuzzle" class="btn-secondary">
            🎯 New Puzzle
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import WelcomeScreen from '@/components/WelcomeScreen.vue'
import ImageGallery from '@/components/ImageGallery.vue'
import PuzzleBoard from '@/components/PuzzleBoard.vue'
import imageManifest from '@/data/images-manifest.json'

const gameStore = useGameStore()

// Computed properties for game state
const showWelcome = computed(() => gameStore.gameState === 'welcome')
const showImageGallery = computed(() => gameStore.gameState === 'selecting')
const showPuzzle = computed(() => gameStore.gameState === 'playing')
const showVictory = computed(() => gameStore.gameState === 'won')
const currentPuzzle = computed(() => gameStore.currentPuzzle)
const moves = computed(() => gameStore.moves)
const elapsedTime = computed(() => gameStore.elapsedTime)

// Format time display
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Victory screen actions
const playAgain = () => {
  gameStore.resetPuzzle()
}

const newPuzzle = () => {
  gameStore.startNewGame()
}

// Watch for game state changes
watch(showVictory, (isVictory) => {
  if (isVictory) {
    // Add some celebration effects
    console.log('🎉 Victory! Showing celebration screen')
    
    // Auto-advance to new game after celebration
    setTimeout(() => {
      console.log('🎮 Auto-advancing to new game selection')
    }, 5000)
  }
})

// Initialize app
onMounted(() => {
  console.log('🚀 Slide Puzzle App initialized')
  
  // Initialize game store with image manifest
  gameStore.initializeGame(imageManifest)
  
  // Start with welcome screen
  gameStore.startWelcome()
})
</script> 