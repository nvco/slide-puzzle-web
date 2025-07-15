/**
 * Performance monitoring utilities for the slide puzzle application
 */

// Performance metrics storage
const metrics = {
  componentMounts: new Map(),
  functionCalls: new Map(),
  memoryUsage: [],
  renderTimes: new Map()
}

/**
 * Track component mount time
 * @param {string} componentName - Name of the component
 * @param {number} startTime - Start time in milliseconds
 */
export function trackComponentMount(componentName, startTime) {
  const mountTime = performance.now() - startTime
  metrics.componentMounts.set(componentName, mountTime)
  
  if (import.meta.env.DEV) {
    console.log(`⚡ ${componentName} mounted in ${mountTime.toFixed(2)}ms`)
  }
}

/**
 * Track function execution time
 * @param {string} functionName - Name of the function
 * @param {Function} fn - Function to track
 * @returns {Function} Wrapped function with performance tracking
 */
export function trackFunction(functionName, fn) {
  return function (...args) {
    const startTime = performance.now()
    const result = fn.apply(this, args)
    const executionTime = performance.now() - startTime
    
    if (!metrics.functionCalls.has(functionName)) {
      metrics.functionCalls.set(functionName, [])
    }
    metrics.functionCalls.get(functionName).push(executionTime)
    
    if (import.meta.env.DEV && executionTime > 16) { // Longer than one frame
      console.warn(`🐌 Slow function: ${functionName} took ${executionTime.toFixed(2)}ms`)
    }
    
    return result
  }
}

/**
 * Track async function execution time
 * @param {string} functionName - Name of the function
 * @param {Function} fn - Async function to track
 * @returns {Function} Wrapped async function with performance tracking
 */
export function trackAsyncFunction(functionName, fn) {
  return async function (...args) {
    const startTime = performance.now()
    const result = await fn.apply(this, args)
    const executionTime = performance.now() - startTime
    
    if (!metrics.functionCalls.has(functionName)) {
      metrics.functionCalls.set(functionName, [])
    }
    metrics.functionCalls.get(functionName).push(executionTime)
    
    if (import.meta.env.DEV && executionTime > 100) { // Longer than 100ms
      console.warn(`🐌 Slow async function: ${functionName} took ${executionTime.toFixed(2)}ms`)
    }
    
    return result
  }
}

/**
 * Track render time for components
 * @param {string} componentName - Name of the component
 * @param {Function} renderFn - Render function to track
 * @returns {Function} Wrapped render function
 */
export function trackRender(componentName, renderFn) {
  return function (...args) {
    const startTime = performance.now()
    const result = renderFn.apply(this, args)
    const renderTime = performance.now() - startTime
    
    if (!metrics.renderTimes.has(componentName)) {
      metrics.renderTimes.set(componentName, [])
    }
    metrics.renderTimes.get(componentName).push(renderTime)
    
    if (import.meta.env.DEV && renderTime > 16) { // Longer than one frame
      console.warn(`🐌 Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`)
    }
    
    return result
  }
}

/**
 * Get memory usage information
 * @returns {Object} Memory usage data
 */
export function getMemoryUsage() {
  if ('memory' in performance) {
    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit
    }
  }
  return null
}

/**
 * Track memory usage over time
 */
export function trackMemoryUsage() {
  const memoryData = getMemoryUsage()
  if (memoryData) {
    metrics.memoryUsage.push({
      timestamp: Date.now(),
      ...memoryData
    })
    
    // Keep only last 100 measurements
    if (metrics.memoryUsage.length > 100) {
      metrics.memoryUsage.shift()
    }
  }
}

/**
 * Get performance report
 * @returns {Object} Performance metrics summary
 */
export function getPerformanceReport() {
  const report = {
    componentMounts: {},
    functionCalls: {},
    renderTimes: {},
    memoryUsage: null,
    timestamp: Date.now()
  }
  
  // Component mount times
  for (const [component, time] of metrics.componentMounts) {
    report.componentMounts[component] = time
  }
  
  // Function call statistics
  for (const [functionName, times] of metrics.functionCalls) {
    if (times.length > 0) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length
      const max = Math.max(...times)
      const min = Math.min(...times)
      
      report.functionCalls[functionName] = {
        average: avg,
        max,
        min,
        calls: times.length
      }
    }
  }
  
  // Render time statistics
  for (const [component, times] of metrics.renderTimes) {
    if (times.length > 0) {
      const avg = times.reduce((a, b) => a + b, 0) / times.length
      const max = Math.max(...times)
      const min = Math.min(...times)
      
      report.renderTimes[component] = {
        average: avg,
        max,
        min,
        renders: times.length
      }
    }
  }
  
  // Memory usage
  if (metrics.memoryUsage.length > 0) {
    const latest = metrics.memoryUsage[metrics.memoryUsage.length - 1]
    report.memoryUsage = latest
  }
  
  return report
}

/**
 * Log performance report to console
 */
export function logPerformanceReport() {
  if (import.meta.env.DEV) {
    const report = getPerformanceReport()
    console.group('📊 Performance Report')
    console.table(report.componentMounts)
    console.table(report.functionCalls)
    console.table(report.renderTimes)
    if (report.memoryUsage) {
      console.log('Memory Usage:', report.memoryUsage)
    }
    console.groupEnd()
  }
}

/**
 * Clear all performance metrics
 */
export function clearPerformanceMetrics() {
  metrics.componentMounts.clear()
  metrics.functionCalls.clear()
  metrics.renderTimes.clear()
  metrics.memoryUsage = []
}

// Start memory tracking
if (import.meta.env.DEV) {
  setInterval(trackMemoryUsage, 5000) // Track every 5 seconds
} 