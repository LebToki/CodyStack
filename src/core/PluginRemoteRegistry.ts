/**
 * CodyStack Remote Plugin Registry
 * 
 * Manages community plugin discovery, installation from remote sources,
 * version tracking, and automatic updates with approval system.
 */

// ============================================
// REGISTRY TYPES
// ============================================

export interface RemotePlugin {
    id: string
    name: string
    version: string
    description: string
    category: string
    author: {
        name: string
        github?: string
        verified?: boolean
    }

    // Repository info
    repository: string
    homepage?: string
    license: string

    // Marketplace data
    downloads: number
    rating: number
    reviews: number

    // Version history
    versions: PluginVersion[]
    latestVersion: string

    // Approval status
    status: 'pending' | 'approved' | 'featured' | 'deprecated'
    approvedAt?: string
    approvedBy?: string

    // Compatibility
    minCodyStackVersion: string
    dependencies?: string[]

    // Assets
    icon?: string
    screenshots?: string[]
    readme?: string
}

export interface PluginVersion {
    version: string
    releaseDate: string
    changelog: string
    downloadUrl: string
    checksum: string
    downloads: number
}

export interface PluginUpdateInfo {
    pluginId: string
    currentVersion: string
    latestVersion: string
    changelog: string
    breaking: boolean
    autoUpdate: boolean
}

// ============================================
// REGISTRY API
// ============================================

const REGISTRY_BASE_URL = 'https://registry.codystack.dev/api/v1'

export interface PluginRegistryAPI {
    // Discovery
    search(query: string, options?: SearchOptions): Promise<RemotePlugin[]>
    getPlugin(id: string): Promise<RemotePlugin | null>
    getFeatured(): Promise<RemotePlugin[]>
    getTrending(): Promise<RemotePlugin[]>
    getByCategory(category: string): Promise<RemotePlugin[]>

    // Installation
    download(pluginId: string, version?: string): Promise<ArrayBuffer>
    getDownloadUrl(pluginId: string, version?: string): string

    // Updates
    checkForUpdates(installedPlugins: InstalledPluginInfo[]): Promise<PluginUpdateInfo[]>

    // Community
    submitPlugin(submission: PluginSubmission): Promise<{ id: string; status: string }>
    reportPlugin(pluginId: string, reason: string): Promise<void>
    ratePlugin(pluginId: string, rating: number, review?: string): Promise<void>
}

export interface SearchOptions {
    category?: string
    author?: string
    minRating?: number
    sortBy?: 'downloads' | 'rating' | 'recent' | 'name'
    limit?: number
    offset?: number
}

export interface InstalledPluginInfo {
    id: string
    version: string
    installedAt: string
}

export interface PluginSubmission {
    name: string
    repository: string
    description: string
    category: string
}

// ============================================
// REGISTRY CLIENT
// ============================================

class PluginRegistryClient implements PluginRegistryAPI {
    private baseUrl: string

    constructor(baseUrl = REGISTRY_BASE_URL) {
        this.baseUrl = baseUrl
    }

    async search(query: string, options: SearchOptions = {}): Promise<RemotePlugin[]> {
        const params = new URLSearchParams({ q: query, ...options as Record<string, string> })
        const response = await fetch(`${this.baseUrl}/plugins/search?${params}`)
        if (!response.ok) throw new Error('Search failed')
        return response.json()
    }

    async getPlugin(id: string): Promise<RemotePlugin | null> {
        const response = await fetch(`${this.baseUrl}/plugins/${id}`)
        if (response.status === 404) return null
        if (!response.ok) throw new Error('Failed to fetch plugin')
        return response.json()
    }

    async getFeatured(): Promise<RemotePlugin[]> {
        const response = await fetch(`${this.baseUrl}/plugins/featured`)
        if (!response.ok) throw new Error('Failed to fetch featured plugins')
        return response.json()
    }

    async getTrending(): Promise<RemotePlugin[]> {
        const response = await fetch(`${this.baseUrl}/plugins/trending`)
        if (!response.ok) throw new Error('Failed to fetch trending plugins')
        return response.json()
    }

    async getByCategory(category: string): Promise<RemotePlugin[]> {
        const response = await fetch(`${this.baseUrl}/plugins/category/${category}`)
        if (!response.ok) throw new Error('Failed to fetch plugins by category')
        return response.json()
    }

    async download(pluginId: string, version?: string): Promise<ArrayBuffer> {
        const url = this.getDownloadUrl(pluginId, version)
        const response = await fetch(url)
        if (!response.ok) throw new Error('Download failed')
        return response.arrayBuffer()
    }

    getDownloadUrl(pluginId: string, version = 'latest'): string {
        return `${this.baseUrl}/plugins/${pluginId}/download/${version}`
    }

    async checkForUpdates(installedPlugins: InstalledPluginInfo[]): Promise<PluginUpdateInfo[]> {
        const response = await fetch(`${this.baseUrl}/plugins/check-updates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plugins: installedPlugins })
        })
        if (!response.ok) throw new Error('Update check failed')
        return response.json()
    }

    async submitPlugin(submission: PluginSubmission): Promise<{ id: string; status: string }> {
        const response = await fetch(`${this.baseUrl}/plugins/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submission)
        })
        if (!response.ok) throw new Error('Submission failed')
        return response.json()
    }

    async reportPlugin(pluginId: string, reason: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/plugins/${pluginId}/report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason })
        })
        if (!response.ok) throw new Error('Report failed')
    }

    async ratePlugin(pluginId: string, rating: number, review?: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/plugins/${pluginId}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating, review })
        })
        if (!response.ok) throw new Error('Rating failed')
    }
}

// ============================================
// UPDATE MANAGER
// ============================================

export interface UpdateManager {
    // Check for updates
    checkUpdates(): Promise<PluginUpdateInfo[]>

    // Auto-update settings
    setAutoUpdate(pluginId: string, enabled: boolean): void
    getAutoUpdatePlugins(): string[]

    // Update operations
    updatePlugin(pluginId: string): Promise<void>
    updateAll(): Promise<void>

    // Notifications
    onUpdateAvailable(callback: (updates: PluginUpdateInfo[]) => void): () => void
}

// ============================================
// APPROVAL SYSTEM
// ============================================

export interface ApprovalStatus {
    pluginId: string
    status: 'pending' | 'under-review' | 'approved' | 'rejected'
    submittedAt: string
    reviewedAt?: string
    reviewer?: string
    comments?: string

    // Security checks
    securityScan: 'pending' | 'passed' | 'failed'
    codeReview: 'pending' | 'passed' | 'failed'

    // Requirements
    hasReadme: boolean
    hasLicense: boolean
    hasTests: boolean
    passesLinting: boolean
}

export interface PluginReview {
    userId: string
    userName: string
    rating: number
    review: string
    createdAt: string
    helpful: number
    verified: boolean
}

// ============================================
// EXPORTS
// ============================================

export const pluginRegistryClient = new PluginRegistryClient()

export default pluginRegistryClient
