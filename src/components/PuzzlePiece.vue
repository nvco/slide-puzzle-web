<template>
  <div
    :class="pieceClass"
    :style="pieceStyle"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedBy"
    :role="role"
    :tabindex="tabIndex"
    @click="onClick"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @keydown.enter="onKeyDownEnter"
    @keydown.space.prevent="onKeyDownSpace"
  >
    <div v-if="piece !== 0" class="piece-number">{{ piece }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  piece: { type: Number, required: true },
  isMoveable: { type: Boolean, default: false },
  isAnimating: { type: Boolean, default: false },
  isSolved: { type: Boolean, default: false },
  pieceStyle: { type: Object, default: () => ({}) },
  ariaLabel: { type: String, default: '' },
  ariaDescribedBy: { type: String, default: undefined },
  role: { type: String, default: 'button' },
  tabIndex: { type: [Number, String], default: 0 },
})

const emit = defineEmits([
  'click',
  'touchstart',
  'touchend',
  'keydown-enter',
  'keydown-space',
])

const pieceClass = computed(() => {
  return [
    'puzzle-piece',
    props.piece === 0 ? 'empty' : '',
    props.isMoveable ? 'moveable' : '',
    props.isAnimating ? 'animating' : '',
    props.isSolved ? 'solved-piece' : '',
  ]
})

function onClick(e) { emit('click', e) }
function onTouchStart(e) { emit('touchstart', e) }
function onTouchEnd(e) { emit('touchend', e) }
function onKeyDownEnter(e) { emit('keydown-enter', e) }
function onKeyDownSpace(e) { emit('keydown-space', e) }
</script>

<style scoped>
.puzzle-piece {
  @apply relative rounded-lg border-2 border-gray-300 overflow-hidden;
  @apply transition-all duration-300 ease-out;
  @apply flex items-center justify-center;
  @apply min-w-11 min-h-11; /* Ensure 44px minimum touch target */
  @apply focus:ring-2 focus:ring-puzzle-accent focus:outline-none;
  @apply cursor-default; /* Default cursor for non-moveable pieces */
}
.puzzle-piece.empty {
  @apply opacity-0 pointer-events-none cursor-default;
}
.puzzle-piece.moveable {
  @apply border-puzzle-accent shadow-lg cursor-grab;
  @apply focus:ring-2 focus:ring-puzzle-accent focus:outline-none;
  @apply active:scale-95 active:cursor-grabbing;
}
.puzzle-piece.moveable:active {
  @apply cursor-grabbing;
}
.puzzle-piece.animating {
  @apply transition-transform duration-300 ease-out cursor-wait;
}
.puzzle-piece.solved-piece {
  @apply border-gray-400 cursor-default;
  @apply focus:ring-2 focus:ring-gray-400 focus:outline-none;
}
.piece-number {
  @apply text-2xl font-bold text-gray-800;
  @apply md:text-3xl;
  @apply filter drop-shadow-sm;
  @apply select-none;
}
</style> 