<template>
  <div class="game-controls" role="region" aria-label="Game statistics and controls">
    <div class="game-stats" role="group" aria-label="Game statistics">
      <div class="stat-item">
        <span class="stat-label" id="moves-label">Moves:</span>
        <span class="stat-value" aria-labelledby="moves-label">{{ moves }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label" id="time-label">Time:</span>
        <span class="stat-value" aria-labelledby="time-label">{{ formatTime(elapsedTime) }}</span>
      </div>
    </div>
    
    <div class="action-buttons">
      <button 
        @click="onReset" 
        class="btn-secondary"
        aria-label="Reset current puzzle"
      >
        🔄 Reset
      </button>
      <button 
        @click="onNewGame" 
        class="btn-primary"
        aria-label="Start a new puzzle game"
      >
        🎮 New Game
      </button>
    </div>
  </div>
</template>

<script setup>
import { formatTime } from '@/utils/formatters'

const props = defineProps({
  moves: { type: Number, required: true },
  elapsedTime: { type: Number, required: true },
})

const emit = defineEmits(['reset', 'new-game'])

function onReset() {
  emit('reset')
}

function onNewGame() {
  emit('new-game')
}
</script>

<style scoped>
.game-controls {
  @apply flex flex-col items-center space-y-4;
}

.game-stats {
  @apply flex flex-col space-y-2 space-x-0;
  @apply md:flex-row md:space-y-0 md:space-x-6;
}

.stat-item {
  @apply flex flex-col items-center;
}

.stat-label {
  @apply text-sm text-gray-600 font-medium;
}

.stat-value {
  @apply text-xl font-bold text-puzzle-primary;
  @apply md:text-2xl;
}

.action-buttons {
  @apply flex flex-col space-y-2 space-x-0;
  @apply md:flex-row md:space-y-0 md:space-x-4;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .game-stats {
    @apply flex-col space-y-2 space-x-0;
  }
  
  .action-buttons {
    @apply flex-col space-y-2 space-x-0;
  }
}
</style> 