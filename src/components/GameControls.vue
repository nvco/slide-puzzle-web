<template>
  <div class="game-controls" role="region" aria-label="Game controls">
    <div class="action-buttons">
      <button 
        @click="onReset" 
        class="btn-primary"
        aria-label="Start the puzzle game"
      >
        🎮 Start Game
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['reset'])

function onReset() {
  emit('reset')
}
</script>

<style scoped>
.game-controls {
  @apply flex flex-col items-center;
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