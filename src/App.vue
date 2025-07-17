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
              <header class="title-header">
                <h1 class="puzzle-title">
                  {{ titleText }}
                </h1>
              </header>
              
              <main>
                <PuzzleBoard ref="puzzleBoardRef" />
              </main>

              <div class="controls-container">
                <GameControls @reset="resetPuzzle" />
              </div>
            </div>
          </div>
          
          <!-- Phone Frame Details -->
          <!-- Side buttons -->
          <div class="side-button side-button-left side-button-volume-up"></div>
          <div class="side-button side-button-left side-button-volume-down"></div>
          <div class="side-button side-button-right side-button-power"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { trackComponentMount, logPerformanceReport } from '@/utils/performance'
import { handleAsync, logError } from '@/utils/errorHandler'
import PuzzleBoard from '@/components/PuzzleBoard.vue'
import GameControls from '@/components/GameControls.vue'
import imageManifest from '@/data/images-manifest.json'

const gameStore = useGameStore()

// Refs
const puzzleBoardRef = ref(null)

// Computed properties for game state
const showPuzzle = computed(() => gameStore.gameState === 'playing' || gameStore.gameState === 'won')
const currentPuzzle = computed(() => gameStore.currentPuzzle)

// Reactive title based on game state
const titleText = computed(() => {
  return gameStore.gameState === 'won' ? 'Told ya !' : 'You can do it !'
})

// Initialize app
onMounted(() => {
  const startTime = performance.now()
  
  console.log('🚀 Slide Puzzle App initialized')
  
  // Initialize game store with image manifest
  handleAsync(
    async () => {
      gameStore.initializeGame(imageManifest)
      
      // Set initial random color
      gameStore.randomizeColor()
      
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

const resetPuzzle = () => {
  if (puzzleBoardRef.value) {
    puzzleBoardRef.value.resetPuzzle()
  }
  // Title will automatically update to "You can do it !" when game state changes
}
</script>

<style scoped>
/* Phone Background - custom background color */
.phone-background {
  @apply min-h-screen w-full;
  background: #F6EDF4;
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

/* Phone Screen - the inner area with dynamic background */
.phone-screen {
  @apply w-full h-full;
  background: var(--current-puzzle-color);
  @apply rounded-[1.875rem];
  @apply overflow-hidden;
  @apply relative;
  
  /* Subtle inner shadow to simulate screen depth */
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Game Content - contains the actual game */
.game-content {
  @apply w-full h-full;
  @apply flex flex-col items-center;
  @apply overflow-auto;
}

/* Main game area that takes only content space */
.game-content main {
  @apply flex items-center justify-center;
  @apply w-full;
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

/* Side Button Positioning */
.side-button-volume-up {
  top: 120px;
}

.side-button-volume-down {
  top: 190px;
}

.side-button-power {
  top: 120px;
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
  /* No animations needed */
}

/* Responsive adjustments for game content */
@media (max-width: 640px) {
  
  .title-header {
    @apply py-4 px-2;
    min-height: 80px;
  }
  
  .puzzle-title {
    font-size: 2.5rem;
    line-height: 1;
  }
}

/* Title Header Layout */
.title-header {
  @apply flex items-center justify-center;
  @apply py-6 px-4;
  @apply flex-1;
  min-height: 100px; /* Ensure adequate space for the title */
}

/* Puzzle Title Style */
.puzzle-title {
  font-family: 'Permanent Marker', cursive;
  color: color-mix(in srgb, var(--current-puzzle-color) 60%, black 30%);
  font-size: 4rem;
  line-height: 1.1;
  margin: 0;
  text-align: center;
}

/* Controls Container */
.controls-container {
  @apply flex justify-center items-center;
  @apply flex-1;
}
</style> 