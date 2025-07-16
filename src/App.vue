<template>
  <div id="app" class="min-h-screen">
    
    <!-- Phone Frame Container -->
    <div v-if="showPuzzle" class="phone-background">
      <div class="phone-container">
        <!-- Phone Frame -->
        <div class="phone-frame">
          <!-- Screen Area -->
          <div class="phone-screen">
            <!-- Game Content -->
            <div class="game-content">
              <header class="text-center mb-6">
                <h1 class="text-2xl font-bold text-puzzle-primary mb-2">
                  🧩 Number Puzzle 🧩
                </h1>
                <p class="text-sm text-gray-600">
                  Slide the pieces to solve the puzzle!
                </p>
              </header>
              
              <main>
                <PuzzleBoard />
              </main>
            </div>
          </div>
          
          <!-- Phone Frame Details -->
          <!-- Side buttons -->
          <div class="side-button side-button-left" style="top: 120px;"></div>
          <div class="side-button side-button-left" style="top: 190px;"></div>
          <div class="side-button side-button-right" style="top: 120px;"></div>
        </div>
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

<style scoped>
/* Phone Background - matches the pinkish background from the image */
.phone-background {
  @apply min-h-screen w-full;
  background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 50%, #fef2f2 100%);
  @apply flex items-center justify-center p-4;
}

/* Phone Container - allows for size adjustment */
.phone-container {
  /* CSS Custom Properties for easy size adjustment */
  --phone-scale: 1;
  --phone-width: 320px;
  --phone-height: 640px;
  
  width: calc(var(--phone-width) * var(--phone-scale));
  height: calc(var(--phone-height) * var(--phone-scale));
  @apply relative;
}

/* Responsive phone scaling */
@media (max-width: 640px) {
  .phone-container {
    --phone-scale: 0.85;
  }
}

@media (max-width: 480px) {
  .phone-container {
    --phone-scale: 0.75;
  }
}

@media (min-width: 1200px) {
  .phone-container {
    --phone-scale: 1.2;
  }
}

/* Phone Frame - the dark border/body of the phone */
.phone-frame {
  @apply w-full h-full relative;
  @apply bg-gray-800 rounded-[2.5rem];
  @apply shadow-2xl;
  @apply p-3;
}

/* Phone Screen - the inner white area */
.phone-screen {
  @apply w-full h-full;
  @apply bg-white rounded-[1.875rem];
  @apply overflow-hidden;
  @apply relative;
  
  /* Subtle inner shadow to simulate screen depth */
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Game Content - contains the actual game */
.game-content {
  @apply w-full h-full;
  @apply flex flex-col items-center justify-center;
  @apply p-4 overflow-auto;
}

/* Side Buttons */
.side-button {
  @apply absolute rounded-md;
  @apply bg-gray-800;
  width: 10px;
  height: 60px;
}

.side-button-left {
  left: -6px;
}

.side-button-right {
  right: -6px;
  height: 80px;
}

/* Utility classes for easy size adjustment */
.phone-small {
  --phone-scale: 0.8;
}

.phone-medium {
  --phone-scale: 1;
}

.phone-large {
  --phone-scale: 1.3;
}

.phone-xl {
  --phone-scale: 1.5;
}

/* Add subtle animations */
.phone-frame {
  transition: transform 0.3s ease-in-out;
}

.phone-frame:hover {
  transform: translateY(-2px);
}

/* Responsive adjustments for game content */
@media (max-width: 640px) {
  .game-content {
    @apply p-2;
  }
  
  .game-content header h1 {
    @apply text-xl;
  }
  
  .game-content header p {
    @apply text-xs;
  }
}
</style> 