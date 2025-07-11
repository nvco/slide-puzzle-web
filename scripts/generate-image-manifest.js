import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const IMAGES_DIR = path.join(__dirname, '../src/assets/puzzle-images')
const OUTPUT_FILE = path.join(__dirname, '../src/data/images-manifest.json')

function generateImageManifest() {
  const manifest = {
    categories: {},
    totalImages: 0,
    lastGenerated: new Date().toISOString()
  }

  try {
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(OUTPUT_FILE)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Check if images directory exists
    if (!fs.existsSync(IMAGES_DIR)) {
      console.log('Creating images directory structure...')
      fs.mkdirSync(IMAGES_DIR, { recursive: true })
      fs.mkdirSync(path.join(IMAGES_DIR, 'animals'), { recursive: true })
      fs.mkdirSync(path.join(IMAGES_DIR, 'landscapes'), { recursive: true })
      fs.mkdirSync(path.join(IMAGES_DIR, 'cartoons'), { recursive: true })
    }

    // Read categories (subdirectories)
    const categories = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)

    categories.forEach(category => {
      const categoryPath = path.join(IMAGES_DIR, category)
      const images = fs.readdirSync(categoryPath)
        .filter(file => /\.(jpg|jpeg|png|webp|svg)$/i.test(file))
        .map((file, index) => ({
          id: `${category}-${index}`,
          filename: file,
          path: `/src/assets/puzzle-images/${category}/${file}`,
          alt: file.replace(/\.(jpg|jpeg|png|webp|svg)$/i, '').replace(/[-_]/g, ' '),
          category: category
        }))

      manifest.categories[category] = images
      manifest.totalImages += images.length
    })

    // Write manifest file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2))
    console.log(`✅ Image manifest generated: ${manifest.totalImages} images across ${Object.keys(manifest.categories).length} categories`)
    
    // Log categories
    Object.entries(manifest.categories).forEach(([category, images]) => {
      console.log(`   ${category}: ${images.length} images`)
    })

  } catch (error) {
    console.error('❌ Error generating image manifest:', error)
    // Create empty manifest on error
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2))
  }
}

generateImageManifest() 