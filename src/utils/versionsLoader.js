/**
 * Bible Versions Loader
 * Loads version data from versions.json and individual version.json files
 */

const VERSIONS_BASE_URL = '/app/content/bibles'

class VersionsLoader {
  constructor() {
    this.versionData = {}
    this.versionsByKey = {}
    this.versionKeys = []
    this.loaded = false
  }

  async loadVersionManifest() {
    try {
      const response = await fetch(`${VERSIONS_BASE_URL}/versions.json`)
      if (!response.ok) {
        console.error('Failed to load versions.json')
        return []
      }
      const data = await response.json()
      return data.versions || []
    } catch (error) {
      console.error('Error loading version manifest:', error)
      return []
    }
  }

  async loadVersionInfo(versionCode) {
    try {
      const response = await fetch(`${VERSIONS_BASE_URL}/${versionCode}/version.json`)
      if (!response.ok) {
        // Version.json doesn't exist, create a basic one
        return this.createDefaultVersionInfo(versionCode)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.warn(`Could not load version info for ${versionCode}:`, error)
      return this.createDefaultVersionInfo(versionCode)
    }
  }

  createDefaultVersionInfo(versionCode) {
    // Parse the version code to extract language
    const parts = versionCode.split('_')
    const langCode = parts[0] || 'en'
    const abbr = parts[1] ? parts[1].toUpperCase() : versionCode.toUpperCase()
    
    return {
      code: versionCode,
      name: abbr,
      abbreviation: abbr,
      language: this.getLanguageName(langCode),
      direction: 'ltr',
      font: 'default',
      books: [] // Will need to detect which books are available
    }
  }

  getLanguageName(langCode) {
    const languageMap = {
      'en': 'English',
      'eng': 'English',
      'es': 'Spanish',
      'ar': 'Arabic',
      'el': 'Greek',
      'he': 'Hebrew',
      'ru': 'Russian',
      'my': 'Burmese'
    }
    return languageMap[langCode] || 'Unknown'
  }

  async loadAllVersions() {
    if (this.loaded) {
      return this.versionData
    }

    const versionCodes = await this.loadVersionManifest()
    
    for (const versionCode of versionCodes) {
      const versionInfo = await this.loadVersionInfo(versionCode)
      
      const langCode = versionInfo.language.toLowerCase()
      
      // Create language group if it doesn't exist
      if (!this.versionData[langCode]) {
        this.versionData[langCode] = {
          languageName: versionInfo.language,
          versions: {}
        }
      }
      
      // Add version to language group
      this.versionData[langCode].versions[versionInfo.code] = versionInfo
      this.versionsByKey[versionInfo.code] = versionInfo
      this.versionKeys.push(versionInfo.code)
    }
    
    this.versionKeys.sort()
    this.loaded = true
    
    return this.versionData
  }

  getVersion(versionCode) {
    return this.versionsByKey[versionCode] || null
  }

  getVersionOptions() {
    const options = []
    
    for (const langCode in this.versionData) {
      const language = this.versionData[langCode]
      const group = {
        label: language.languageName,
        options: []
      }
      
      for (const versionCode in language.versions) {
        const version = language.versions[versionCode]
        group.options.push({
          value: version.code,
          label: `${version.abbreviation} - ${version.name}`,
          version: version
        })
      }
      
      if (group.options.length > 0) {
        options.push(group)
      }
    }
    
    return options
  }
}

// Create singleton instance
export const versionsLoader = new VersionsLoader()

export default versionsLoader
