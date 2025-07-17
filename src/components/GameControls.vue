<template>
  <div class="game-controls" role="region" aria-label="Game controls">
    <div class="action-buttons">
      <button 
        @click="onReset" 
        :class="['btn-icon', { clicked: isClicked }]"
        aria-label="Start new puzzle game"
      >
        <RotateCcw :size="48" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RotateCcw } from 'lucide-vue-next'

const emit = defineEmits(['reset'])
const isClicked = ref(false)

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