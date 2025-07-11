<template>
  <div class="image-gallery-container">
    <div class="gallery-header">
      <h2 class="gallery-title">Choose Your Puzzle! 🎨</h2>
      <p class="gallery-subtitle">Pick an image to turn into a puzzle</p>
    </div>

    <!-- Category Tabs -->
    <div class="category-tabs">
      <button
        v-for="category in categories"
        :key="category"
        @click="selectedCategory = category"
        :class="[
          'category-tab',
          { 'active': selectedCategory === category }
        ]"
      >
        {{ getCategoryEmoji(category) }} {{ formatCategoryName(category) }}
      </button>
    </div>

    <!-- Image Grid -->
    <div class="image-grid">
      <div
        v-for="image in filteredImages"
        :key="image.id"
        class="image-item"
        @click="selectImage(image)"
        :class="{ 'selected': selectedImage?.id === image.id }"
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
      <button @click="selectRandomImage" class="btn-primary random-btn">
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
import { ref, computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
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
    people: '👥',
    vehicles: '🚗',
    food: '🍕',
    nature: '🌿',
    toys: '🧸'
  }
  return emojis[category] || '🎯'
}

const formatCategoryName = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

const formatImageTitle = (filename) => {
  return filename
    .replace(/\.(jpg|jpeg|png|webp|svg)$/i, '')
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Image selection
const selectImage = (image) => {
  selectedImage.value = image
  console.log('🎯 Selected image:', image.filename)
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
    gameStore.selectImage(selectedImage.value)
    console.log('✨ Puzzle created with:', selectedImage.value.filename)
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
    gameStore.initializeGame(imageManifest)
  }
})
</script>

<style scoped>
.image-gallery-container {
  @apply max-w-4xl mx-auto p-4;
}

.gallery-header {
  @apply text-center mb-6;
}

.gallery-title {
  @apply text-3xl font-bold text-puzzle-primary mb-2;
}

.gallery-subtitle {
  @apply text-lg text-gray-600;
}

.category-tabs {
  @apply flex flex-wrap justify-center gap-2 mb-6;
}

.category-tab {
  @apply px-4 py-2 rounded-full border-2 border-gray-300 bg-white;
  @apply text-sm font-medium text-gray-700;
  @apply transition-all duration-200 ease-in-out;
  @apply hover:border-puzzle-accent hover:bg-puzzle-accent hover:text-white;
}

.category-tab.active {
  @apply border-puzzle-primary bg-puzzle-primary text-white;
  @apply shadow-lg;
}

.image-grid {
  @apply grid gap-4 mb-8;
  @apply grid-cols-2 sm:grid-cols-3 lg:grid-cols-4;
}

.image-item {
  @apply relative cursor-pointer rounded-lg overflow-hidden;
  @apply transition-all duration-300 ease-out;
  @apply hover:scale-105 hover:shadow-xl;
}

.image-item.selected {
  @apply ring-4 ring-puzzle-accent ring-opacity-75;
  @apply scale-105 shadow-2xl;
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
  
  .gallery-actions {
    @apply flex-col space-y-2 space-x-0;
  }
  
  .category-tabs {
    @apply gap-1;
  }
  
  .category-tab {
    @apply text-xs px-3 py-1;
  }
}
</style> 