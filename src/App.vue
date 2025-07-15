<template>
  <div id="app" class="min-h-screen">
    
    <!-- Puzzle Game Screen -->
    <div v-if="showPuzzle" class="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4 sm:p-6">
      <div class="w-full max-w-4xl min-h-0">
        <header class="text-center mb-8">
          <h1 class="text-3xl font-bold text-puzzle-primary mb-2">
            🧩 Number Puzzle 🧩
          </h1>
          <p class="text-lg text-gray-600">
            Slide the pieces to solve the puzzle!
          </p>
        </header>
        
        <main>
          <PuzzleBoard />
        </main>
      </div>
    </div>
    

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { trackComponentMount, logPerformanceReport } from '@/utils/performance'
import { handleAsync, logError } from '@/utils/errorHandler'
import PuzzleBoard from '@/components/PuzzleBoard.vue'
import imageManifest from '@/data/images-manifest.json'

const gameStore = useGameStore()

// Computed properties for game state
const showPuzzle = computed(() => gameStore.gameState === 'playing' || gameStore.gameState === 'won')
const currentPuzzle = computed(() => gameStore.currentPuzzle)







  // Initialize app
  onMounted(() => {
    const startTime = performance.now()
    
    console.log('🚀 Slide Puzzle App initialized')
    
    // Initialize game store with image manifest
    handleAsync(
      async () => {
        gameStore.initializeGame(imageManifest)
        
        // Start with solved puzzle (no scrambling)
        gameStore.startTime = Date.now()
        console.log('🔢 Starting with solved numbers puzzle')
        
        // Track component mount time
        trackComponentMount('App', startTime)
      },
      'App initialization',
      (error) => {
        console.error('Failed to initialize app:', error.message)
      }
    )
  
  // Log performance report every 30 seconds in development
  if (import.meta.env.DEV) {
    setInterval(logPerformanceReport, 30000)
  }
})
</script> 