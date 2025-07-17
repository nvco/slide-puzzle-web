<template>
  <div class="game-controls" role="region" aria-label="Game controls">
    <div class="action-buttons">
      <button 
        @click="onReset" 
        :class="['btn-icon', { clicked: isClicked, pulsing: isPuzzleSolved }]"
        aria-label="Start new puzzle game"
      >
        <RotateCcw :size="48" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RotateCcw } from 'lucide-vue-next'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
const emit = defineEmits(['reset'])
const isClicked = ref(false)

// Track if puzzle is solved to trigger pulsing
const isPuzzleSolved = computed(() => gameStore.gameState === 'won')

function onReset() {
  // Trigger the click animation
  isClicked.value = true
  
  // Reset the animation after a short delay
  setTimeout(() => {
    isClicked.value = false
  }, 200)
  
  // Emit the reset event
  emit('reset')
}
</script>

<style scoped>
.game-controls {
  @apply flex flex-col items-center pb-6;
}

.action-buttons {
  @apply flex flex-col space-y-2 space-x-0;
  @apply md:flex-row md:space-y-0 md:space-x-4;
}

.btn-icon {
  @apply font-bold p-5 rounded-full;
  @apply min-w-24 min-h-24; /* Moderate size for 2x icon */
  @apply flex items-center justify-center;
  @apply cursor-default; /* Remove pointer cursor */
  color: color-mix(in srgb, var(--current-puzzle-color) 60%, black 30%); /* Match H1 title color */
  transition: opacity 0.2s ease-in-out;
}

.btn-icon.clicked {
  opacity: 0.3;
}

.btn-icon.pulsing {
  animation: pulse-icon 1.5s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .game-stats {
    @apply flex-col space-y-2 space-x-0;
  }
  
  .action-buttons {
    @apply flex-col space-y-2 space-x-0;
  }
  
  .btn-icon {
    @apply min-w-20 min-h-20; /* Proportionally smaller on mobile */
  }
}
</style> 