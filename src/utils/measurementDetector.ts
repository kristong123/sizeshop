// Enhanced measurement detection for multiple shopping websites
// Supports: Amazon, ASOS, Zara, H&M, Uniqlo, Nike, Adidas, and more

import { DetectedMeasurement } from '../types'

interface MeasurementPattern {
  regex: RegExp
  type: DetectedMeasurement['type']
  unitGroup?: number
  valueGroup?: number
}

// Common measurement patterns across shopping sites
const MEASUREMENT_PATTERNS: MeasurementPattern[] = [
  // Standard format: "Chest: 100cm" or "Chest 100 cm"
  { regex: /chest[:\s]+(\d+(?:\.\d+)?)\s*(cm|inch|in|")/gi, type: 'chest', valueGroup: 1, unitGroup: 2 },
  { regex: /bust[:\s]+(\d+(?:\.\d+)?)\s*(cm|inch|in|")/gi, type: 'chest', valueGroup: 1, unitGroup: 2 },
  
  { regex: /waist[:\s]+(\d+(?:\.\d+)?)\s*(cm|inch|in|")/gi, type: 'waist', valueGroup: 1, unitGroup: 2 },
  
  { regex: /shoulder[:\s]+(width)?[:\s]*(\d+(?:\.\d+)?)\s*(cm|inch|in|")/gi, type: 'shoulder', valueGroup: 2, unitGroup: 3 },
  { regex: /across\s+shoulder[:\s]+(\d+(?:\.\d+)?)\s*(cm|inch|in|")/gi, type: 'shoulder', valueGroup: 1, unitGroup: 2 },
  
  { regex: /sleeve[:\s]+(length)?[:\s]*(\d+(?:\.\d+)?)\s*(cm|inch|in|")/gi, type: 'sleeve', valueGroup: 2, unitGroup: 3 },
  { regex: /arm\s+length[:\s]+(\d+(?:\.\d+)?)\s*(cm|inch|in|")/gi, type: 'sleeve', valueGroup: 1, unitGroup: 2 },
  
  { regex: /inseam[:\s]+(\d+(?:\.\d+)?)\s*(cm|inch|in|")/gi, type: 'inseam', valueGroup: 1, unitGroup: 2 },
  { regex: /inside\s+leg[:\s]+(\d+(?:\.\d+)?)\s*(cm|inch|in|")/gi, type: 'inseam', valueGroup: 1, unitGroup: 2 },
  
  { regex: /length[:\s]+(\d+(?:\.\d+)?)\s*(cm|inch|in|")/gi, type: 'length', valueGroup: 1, unitGroup: 2 },
  { regex: /total\s+length[:\s]+(\d+(?:\.\d+)?)\s*(cm|inch|in|")/gi, type: 'length', valueGroup: 1, unitGroup: 2 },
  
  // Table format: "100" in a cell next to "Chest" cell
  // This is handled separately in detectFromTables()
]

// Website-specific selectors for size charts and measurement tables
const WEBSITE_SELECTORS = {
  amazon: [
    '.product-facts-detail',
    '#productDetails_techSpec_section_1',
    '#size-chart',
    '.size-chart-container'
  ],
  asos: [
    '.size-guide',
    '.product-size',
    '[data-testid="size-guide"]'
  ],
  zara: [
    '.size-guide',
    '.product-detail-size-info',
    '.size-table'
  ],
  hm: [
    '.product-detail-measurement-guide',
    '.size-guide',
    '[data-testid="measurements"]'
  ],
  uniqlo: [
    '.size-chart',
    '.product-size-chart',
    '.fr-measurement'
  ],
  nike: [
    '.size-chart',
    '.product-dimensions',
    '[data-testid="size-chart"]'
  ],
  adidas: [
    '.size-chart',
    '.gl-size-chart',
    '.sizing-chart'
  ],
  generic: [
    '[class*="size"]',
    '[class*="measurement"]',
    '[class*="dimension"]',
    'table',
    '.product-details',
    '.product-info'
  ]
}

/**
 * Detect measurements from text content
 */
export function detectMeasurementsFromText(text: string): DetectedMeasurement[] {
  const measurements: DetectedMeasurement[] = []
  const seen = new Set<string>()
  
  MEASUREMENT_PATTERNS.forEach(pattern => {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags)
    let match
    
    while ((match = regex.exec(text)) !== null) {
      const value = parseFloat(match[pattern.valueGroup || 1])
      const unitText = match[pattern.unitGroup || 2]?.toLowerCase()
      const unit = normalizeUnit(unitText)
      
      // Skip unrealistic measurements
      if (!isRealisticMeasurement(value, unit, pattern.type)) continue
      
      const key = `${pattern.type}-${value}-${unit}`
      if (seen.has(key)) continue
      seen.add(key)
      
      measurements.push({
        text: match[0],
        value,
        unit,
        type: pattern.type,
        confidence: calculateConfidence(match[0], pattern.type)
      })
    }
  })
  
  return measurements
}

/**
 * Detect measurements from HTML tables (common in size charts)
 */
export function detectMeasurementsFromTables(doc: Document): DetectedMeasurement[] {
  const measurements: DetectedMeasurement[] = []
  const tables = doc.querySelectorAll('table')
  
  tables.forEach(table => {
    const rows = Array.from(table.querySelectorAll('tr'))
    if (rows.length === 0) return
    
    // Find header row (usually first row with th elements, or first row)
    let headerRow = rows.find(row => row.querySelector('th'))
    if (!headerRow) headerRow = rows[0]
    
    const headerCells = Array.from(headerRow.querySelectorAll('th, td'))
    const columnTypes: (DetectedMeasurement['type'] | null)[] = []
    
    // Map each column header to a measurement type
    headerCells.forEach(cell => {
      const headerText = cell.textContent?.toLowerCase().trim() || ''
      const type = inferMeasurementType(headerText)
      columnTypes.push(type !== 'unknown' ? type : null)
    })
    
    // Check if this table has any measurement columns
    const hasMeasurementColumns = columnTypes.some(type => type !== null)
    if (!hasMeasurementColumns) {
      // Try label-value pattern for non-standard tables
      rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td, th'))
        
        for (let i = 0; i < cells.length - 1; i++) {
          const labelText = cells[i].textContent?.toLowerCase().trim() || ''
          const valueText = cells[i + 1].textContent?.trim() || ''
          
          const type = inferMeasurementType(labelText)
          if (!type || type === 'unknown') continue
          
          const match = valueText.match(/(\d+(?:\.\d+)?)\s*(cm|inch|in|")?/)
          if (!match) continue
          
          const value = parseFloat(match[1])
          const unit = normalizeUnit(match[2] || 'cm')
          
          if (!isRealisticMeasurement(value, unit, type)) continue
          
          measurements.push({
            text: `${labelText}: ${valueText}`,
            value,
            unit,
            type,
            confidence: 0.8
          })
        }
      })
      return
    }
    
    // Process data rows (skip header row)
    const dataRows = rows.slice(rows.indexOf(headerRow) + 1)
    
    dataRows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll('td, th'))
      
      // Extract measurements from each column that has a measurement type
      cells.forEach((cell, colIndex) => {
        const type = columnTypes[colIndex]
        if (!type) return
        
        const valueText = cell.textContent?.trim() || ''
        
        // Try to extract number and unit
        const match = valueText.match(/(\d+(?:\.\d+)?)\s*(cm|inch|in|")?/)
        if (!match) return
        
        const value = parseFloat(match[1])
        const unit = normalizeUnit(match[2] || 'cm')
        
        if (!isRealisticMeasurement(value, unit, type)) return
        
        measurements.push({
          text: `${headerCells[colIndex]?.textContent?.trim()}: ${valueText}`,
          value,
          unit,
          type,
          confidence: 0.9,
          size: cells[0]?.textContent?.trim() // Store the size label (S, M, L, etc.)
        })
      })
    })
  })
  
  return measurements
}

/**
 * Scan specific website areas based on known patterns
 */
export function detectFromWebsite(doc: Document, url: string): DetectedMeasurement[] {
  const hostname = new URL(url).hostname.toLowerCase()
  let selectors = WEBSITE_SELECTORS.generic
  
  // Match website-specific selectors
  if (hostname.includes('amazon')) selectors = [...WEBSITE_SELECTORS.amazon, ...WEBSITE_SELECTORS.generic]
  else if (hostname.includes('asos')) selectors = [...WEBSITE_SELECTORS.asos, ...WEBSITE_SELECTORS.generic]
  else if (hostname.includes('zara')) selectors = [...WEBSITE_SELECTORS.zara, ...WEBSITE_SELECTORS.generic]
  else if (hostname.includes('hm.com')) selectors = [...WEBSITE_SELECTORS.hm, ...WEBSITE_SELECTORS.generic]
  else if (hostname.includes('uniqlo')) selectors = [...WEBSITE_SELECTORS.uniqlo, ...WEBSITE_SELECTORS.generic]
  else if (hostname.includes('nike')) selectors = [...WEBSITE_SELECTORS.nike, ...WEBSITE_SELECTORS.generic]
  else if (hostname.includes('adidas')) selectors = [...WEBSITE_SELECTORS.adidas, ...WEBSITE_SELECTORS.generic]
  
  let allText = ''
  
  // Extract text from relevant elements
  selectors.forEach(selector => {
    try {
      const elements = doc.querySelectorAll(selector)
      elements.forEach(el => {
        allText += ' ' + (el.textContent || '')
      })
    } catch (e) {
      // Invalid selector, skip
    }
  })
  
  return detectMeasurementsFromText(allText)
}

/**
 * Main detection function - tries multiple strategies
 */
export function detectAllMeasurements(doc: Document, url: string): DetectedMeasurement[] {
  const seen = new Map<string, DetectedMeasurement>()
  
  // Strategy 1: Website-specific detection
  const websiteMeasurements = detectFromWebsite(doc, url)
  
  // Strategy 2: Table detection
  const tableMeasurements = detectMeasurementsFromTables(doc)
  
  // Strategy 3: Full page text scan (fallback)
  const pageText = doc.body.innerText || ''
  const textMeasurements = detectMeasurementsFromText(pageText)
  
  // Combine and deduplicate
  ;[...websiteMeasurements, ...tableMeasurements, ...textMeasurements].forEach(m => {
    const key = `${m.type}-${m.value}-${m.unit}`
    const existing = seen.get(key)
    
    // Keep the one with higher confidence
    if (!existing || m.confidence > existing.confidence) {
      seen.set(key, m)
    }
  })
  
  return Array.from(seen.values()).sort((a, b) => b.confidence - a.confidence)
}

// Helper functions

function normalizeUnit(unit: string | undefined): 'cm' | 'inch' {
  if (!unit) return 'cm'
  const normalized = unit.toLowerCase().replace(/[^a-z]/g, '')
  return normalized === 'inch' || normalized === 'in' ? 'inch' : 'cm'
}

function inferMeasurementType(label: string): DetectedMeasurement['type'] {
  if (/chest|bust/i.test(label)) return 'chest'
  if (/waist/i.test(label)) return 'waist'
  if (/shoulder/i.test(label)) return 'shoulder'
  if (/sleeve|arm/i.test(label)) return 'sleeve'
  if (/inseam|inside.*leg/i.test(label)) return 'inseam'
  if (/length|height/i.test(label)) return 'length'
  return 'unknown'
}

function isRealisticMeasurement(value: number, unit: 'cm' | 'inch', type: string): boolean {
  // Convert to cm for comparison
  const cm = unit === 'inch' ? value * 2.54 : value
  
  // Realistic ranges in cm
  const ranges: Record<string, [number, number]> = {
    chest: [70, 150],
    waist: [50, 150],
    shoulder: [30, 60],
    sleeve: [50, 100],
    inseam: [60, 100],
    length: [40, 150]
  }
  
  const range = ranges[type]
  if (!range) return true
  
  return cm >= range[0] && cm <= range[1]
}

function calculateConfidence(text: string, type: string): number {
  let confidence = 0.5
  
  // Higher confidence if exact match
  if (text.toLowerCase().includes(type)) confidence += 0.3
  
  // Higher confidence if has clear separator
  if (/[:=]/.test(text)) confidence += 0.1
  
  // Higher confidence if has unit
  if (/cm|inch|in|"/.test(text)) confidence += 0.1
  
  return Math.min(confidence, 1.0)
}
