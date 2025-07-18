<template>
  <div class="image-gallery-container">
    <!-- Screen reader instruction -->
    <div id="selected-image-instruction" class="sr-only">
      This image is selected. Press Enter or Space to start puzzle with this image.
    </div>
    
    <div class="gallery-header">
      <h2 class="gallery-title">Choose Your Puzzle! 🧩</h2>
      <p class="gallery-subtitle">Start with numbers to test the mechanics!</p>
    </div>

    <!-- Category Tabs -->
    <div class="category-tabs" role="tablist" aria-label="Puzzle categories">
      <button
        v-for="category in categories"
        :key="category"
        @click="selectedCategory = category"
        :class="[
          'category-tab',
          { 'active': selectedCategory === category }
        ]"
        :aria-label="`Select ${formatCategoryName(category)} category`"
        :aria-selected="selectedCategory === category"
        role="tab"
      >
        {{ getCategoryEmoji(category) }} {{ formatCategoryName(category) }}
      </button>
    </div>

    <!-- Image Grid -->
    <div class="image-grid" role="grid" aria-label="Available puzzle images">
      <div
        v-for="image in filteredImages"
        :key="image.id"
        class="image-item"
        @click="selectImage(image)"
        :class="{ 'selected': selectedImage?.id === image.id }"
        :aria-label="`Select ${image.alt} puzzle`"
        :aria-describedby="selectedImage?.id === image.id ? 'selected-image-instruction' : undefined"
        role="gridcell"
        tabindex="0"
        @keydown.enter="selectImage(image)"
        @keydown.space.prevent="selectImage(image)"
      >
        <div class="image-wrapper">
          <img
            :src="image.path"
            :alt="image.alt"
            class="gallery-image"
            @load="handleImageLoad"
            @error="handleImageError"
          />
          <div class="image-overlay">
            <div class="image-title">{{ formatImageTitle(image.filename) }}</div>
            <div class="select-indicator">
              <span class="select-icon">🎯</span>
            </div>
          </div>
        </div>
      </div>
    </div>



    <!-- Random Selection Button -->
    <div class="random-selection">
      <button 
        @click="selectRandomImage" 
        class="btn-primary random-btn"
        aria-label="Let us pick a random puzzle image for you"
      >
        🎲 Surprise Me!
      </button>
      <p class="random-hint">Let us pick a fun image for you</p>
    </div>

    <!-- Action Buttons -->
    <div class="gallery-actions" v-if="selectedImage">
      <button @click="confirmSelection" class="btn-primary">
        ✨ Create Puzzle
      </button>
      <button @click="clearSelection" class="btn-secondary">
        🔄 Choose Different
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">🧩</div>
      <p>Loading images...</p>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredImages.length === 0" class="empty-state">
      <div class="empty-icon">📸</div>
      <p>No images found in this category</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { formatImageTitle, formatCategoryName } from '@/utils/formatters'
import { handleAsync, logError, AppError, ERROR_TYPES, ERROR_SEVERITY } from '@/utils/errorHandler'
import imageManifest from '@/data/images-manifest.json'

const gameStore = useGameStore()

// Reactive state
const selectedCategory = ref('animals')
const selectedImage = ref(null)
const loading = ref(false)
const imageLoadErrors = ref(new Set())

// Computed properties
const categories = computed(() => {
  return Object.keys(imageManifest.categories)
})

const filteredImages = computed(() => {
  return imageManifest.categories[selectedCategory.value] || []
})

const availableImages = computed(() => {
  return Object.values(imageManifest.categories).flat()
})

// Category helpers
const getCategoryEmoji = (category) => {
  const emojis = {
    animals: '🐾',
    landscapes: '🏞️',
    cartoons: '🎨',
    numbers: '🔢',
    people: '👥',
    vehicles: '🚗',
    food: '🍕',
    nature: '🌿',
    toys: '🧸'
  }
  return emojis[category] || '🎯'
}



// Image selection
const selectImage = (image) => {
  try {
    if (!image || !image.id) {
      throw new AppError(
        'Invalid image object provided',
        ERROR_TYPES.VALIDATION,
        ERROR_SEVERITY.MEDIUM
      )
    }
    
    selectedImage.value = image
    console.log('🎯 Selected image:', image.filename)
  } catch (error) {
    logError(error, 'selectImage')
  }
}

const selectRandomImage = () => {
  const randomImage = gameStore.randomUnshownImage
  if (randomImage) {
    selectedImage.value = randomImage
    // Switch to the category of the random image
    selectedCategory.value = randomImage.category
    console.log('🎲 Random image selected:', randomImage.filename)
  }
}

const confirmSelection = () => {
  if (selectedImage.value) {
    handleAsync(
      async () => {
        gameStore.selectImage(selectedImage.value)
        console.log('✨ Puzzle created with:', selectedImage.value.filename)
      },
      'confirmSelection',
      (error) => {
        console.error('Failed to create puzzle:', error.message)
        // Could show user-friendly error message here
      }
    )
  }
}

const clearSelection = () => {
  selectedImage.value = null
}



// Image loading handlers
const handleImageLoad = (event) => {
  console.log('✅ Image loaded:', event.target.src)
}

const handleImageError = (event) => {
  console.error('❌ Image failed to load:', event.target.src)
  imageLoadErrors.value.add(event.target.src)
}

// Initialize component
onMounted(() => {
  console.log('🖼️ ImageGallery mounted')
  console.log('📊 Available images:', availableImages.value.length)
  
  // Initialize game store if not already done
  if (gameStore.availableImages.length === 0) {
    handleAsync(
      async () => {
        gameStore.initializeGame(imageManifest)
      },
      'ImageGallery initialization',
      (error) => {
        console.error('Failed to initialize ImageGallery:', error.message)
        loading.value = false
      }
    )
  }
  
  // Pre-select the number puzzle
  const numberPuzzle = availableImages.value.find(img => img.category === 'numbers')
  if (numberPuzzle) {
    selectedImage.value = numberPuzzle
    selectedCategory.value = 'numbers'
    console.log('🔢 Pre-selected number puzzle')
  }
})

onUnmounted(() => {
  // Cleanup any pending operations
  loading.value = false
  console.log('🖼️ ImageGallery unmounted')
})
</script>

<style scoped>
.image-gallery-container {
  @apply w-full;
}

.gallery-header {
  @apply text-center mb-6;
}

.gallery-title {
  @apply text-2xl font-bold text-puzzle-primary mb-2;
  @apply md:text-3xl;
}

.gallery-subtitle {
  @apply text-base text-gray-600;
  @apply md:text-lg;
}

.category-tabs {
  @apply flex flex-wrap justify-center gap-2 mb-6;
}

.category-tab {
  @apply px-4 py-2 rounded-full border-2 border-gray-300 bg-white;
  @apply text-sm font-medium text-gray-700;
  @apply transition-all duration-200 ease-in-out;
  @apply hover:border-puzzle-accent hover:bg-puzzle-accent hover:text-white;
  @apply focus:ring-2 focus:ring-puzzle-accent focus:outline-none;
  @apply active:bg-puzzle-accent active:text-white active:scale-95;
  @apply min-w-11 min-h-11; /* Ensure 44px minimum touch target */
}

.category-tab.active {
  @apply border-puzzle-primary bg-puzzle-primary text-white;
  @apply shadow-lg;
  @apply focus:ring-2 focus:ring-white focus:outline-none;
}

.image-grid {
  @apply grid gap-3 mb-6;
  @apply grid-cols-2;
  @apply sm:gap-4 sm:mb-8 sm:grid-cols-3;
  @apply lg:grid-cols-4;
}

.image-item {
  @apply relative cursor-pointer rounded-lg overflow-hidden;
  @apply transition-all duration-300 ease-out;
  @apply hover:scale-105 hover:shadow-xl;
  @apply focus:ring-2 focus:ring-puzzle-accent focus:outline-none;
  @apply active:scale-95 active:shadow-lg;
  @apply min-w-11 min-h-11; /* Ensure 44px minimum touch target */
}

.image-item.selected {
  @apply ring-4 ring-puzzle-accent ring-opacity-75;
  @apply scale-105 shadow-2xl;
  @apply focus:ring-4 focus:ring-puzzle-accent focus:outline-none;
}

.image-wrapper {
  @apply relative aspect-square bg-gray-100;
}

.gallery-image {
  @apply w-full h-full object-cover;
  @apply transition-opacity duration-300;
}

.image-overlay {
  @apply absolute inset-0 bg-black bg-opacity-0;
  @apply flex flex-col justify-end p-3;
  @apply transition-all duration-300;
}

.image-item:hover .image-overlay {
  @apply bg-opacity-30;
}

.image-title {
  @apply text-white font-medium text-sm;
  @apply opacity-0 transform translate-y-2;
  @apply transition-all duration-300;
}

.image-item:hover .image-title {
  @apply opacity-100 transform translate-y-0;
}

.select-indicator {
  @apply absolute top-2 right-2;
  @apply opacity-0 transform scale-75;
  @apply transition-all duration-300;
}

.image-item.selected .select-indicator {
  @apply opacity-100 transform scale-100;
}

.select-icon {
  @apply text-2xl filter drop-shadow-lg;
}



.random-selection {
  @apply text-center mb-6;
}

.random-btn {
  @apply mb-2;
}

.random-hint {
  @apply text-sm text-gray-500;
}

.gallery-actions {
  @apply flex justify-center space-x-4;
}

.loading-state {
  @apply text-center py-12;
}

.loading-spinner {
  @apply text-4xl animate-spin mb-4;
}

.empty-state {
  @apply text-center py-12;
}

.empty-icon {
  @apply text-6xl mb-4;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .image-grid {
    @apply grid-cols-2 gap-3;
  }
  
  .image-item {
    @apply min-w-12 min-h-12; /* Ensure larger touch targets on mobile */
  }
  
  .category-tab {
    @apply text-xs px-3 py-1 min-w-12 min-h-12; /* Ensure adequate touch targets */
  }
  
  .gallery-actions {
    @apply flex-col space-y-2 space-x-0;
  }
  
  .category-tabs {
    @apply gap-1;
  }
}
</style> 