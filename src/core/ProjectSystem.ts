/**
 * CodyStack Project System
 * 
 * Manages local project configuration with a .codystack/ folder
 * similar to how Git uses .git/ for repository data.
 */

// ============================================
// PROJECT STRUCTURE
// ============================================

export interface CodyStackProject {
    name: string
    version: string
    created: string
    lastOpened: string

    // Plugin configuration
    plugins: {
        installed: string[]
        enabled: string[]
        settings: Record<string, unknown>
    }

    // Agent configuration
    agents: {
        enabled: string[]
        preferences: Record<string, AgentPreference>
    }

    // Workflow templates
    workflows: WorkflowConfig[]

    // Project-specific settings
    settings: ProjectSettings
}

export interface AgentPreference {
    model?: string
    temperature?: number
    maxTokens?: number
    customPrompt?: string
}

export interface WorkflowConfig {
    id: string
    name: string
    steps: string[]
    autoRun?: boolean
}

export interface ProjectSettings {
    theme?: string
    autoSave?: boolean
    formatOnSave?: boolean
    lintOnSave?: boolean
    telemetry?: boolean
}

// ============================================
// .CODYSTACK FOLDER STRUCTURE
// ============================================

/**
 * .codystack/
 * ├── config.json          # Main project configuration
 * ├── plugins/             # Locally installed plugins
 * │   └── [plugin-id]/
 * ├── cache/               # Plugin cache data
 * ├── logs/                # Agent activity logs
 * ├── workflows/           # Custom workflow definitions
 * └── presets/             # Saved presets and templates
 */

export const CODYSTACK_FOLDER = '.codystack'

export const CODYSTACK_STRUCTURE = {
    CONFIG: 'config.json',
    PLUGINS: 'plugins',
    CACHE: 'cache',
    LOGS: 'logs',
    WORKFLOWS: 'workflows',
    PRESETS: 'presets'
} as const

// ============================================
// PROJECT MANAGER
// ============================================

export interface ProjectManager {
    // Project lifecycle
    createProject(path: string, name: string): Promise<CodyStackProject>
    openProject(path: string): Promise<CodyStackProject>
    closeProject(): Promise<void>

    // Configuration
    getConfig(): CodyStackProject | null
    updateConfig(updates: Partial<CodyStackProject>): Promise<void>

    // Plugin management (local)
    installPluginLocally(pluginId: string, source: string): Promise<void>
    uninstallPluginLocally(pluginId: string): Promise<void>
    getLocalPlugins(): string[]

    // Presets
    savePreset(name: string, config: Partial<CodyStackProject>): Promise<void>
    loadPreset(name: string): Promise<Partial<CodyStackProject>>
    listPresets(): Promise<string[]>
}

// ============================================
// DEFAULT PROJECT CONFIG
// ============================================

export function createDefaultProject(name: string): CodyStackProject {
    const now = new Date().toISOString()

    return {
        name,
        version: '1.0.0',
        created: now,
        lastOpened: now,

        plugins: {
            installed: [],
            enabled: [],
            settings: {}
        },

        agents: {
            enabled: ['architect', 'coder', 'debugger', 'security', 'tester', 'reviewer', 'devops'],
            preferences: {}
        },

        workflows: [
            {
                id: 'default-review',
                name: 'Code Review',
                steps: ['security', 'reviewer', 'tester']
            }
        ],

        settings: {
            theme: 'dark',
            autoSave: true,
            formatOnSave: true,
            lintOnSave: true,
            telemetry: false
        }
    }
}

// ============================================
// FILE BROWSER INTERFACE
// ============================================

export interface FileNode {
    name: string
    path: string
    type: 'file' | 'directory'
    children?: FileNode[]
    size?: number
    modified?: string
    extension?: string
}

export interface FileBrowser {
    // Navigation
    listDirectory(path: string): Promise<FileNode[]>
    getParentDirectory(path: string): string

    // File operations
    createFile(path: string, content?: string): Promise<void>
    createDirectory(path: string): Promise<void>
    deleteFile(path: string): Promise<void>
    renameFile(oldPath: string, newPath: string): Promise<void>
    readFile(path: string): Promise<string>
    writeFile(path: string, content: string): Promise<void>

    // Project detection
    isCodyStackProject(path: string): Promise<boolean>
    findProjects(rootPath: string): Promise<string[]>
}

// ============================================
// OS-INDEPENDENT PATH UTILITIES
// ============================================

export const PathUtils = {
    join(...parts: string[]): string {
        return parts.join('/').replace(/\/+/g, '/')
    },

    basename(path: string): string {
        return path.split('/').pop() || ''
    },

    dirname(path: string): string {
        const parts = path.split('/')
        parts.pop()
        return parts.join('/') || '/'
    },

    extension(path: string): string {
        const name = PathUtils.basename(path)
        const dot = name.lastIndexOf('.')
        return dot > 0 ? name.slice(dot + 1) : ''
    },

    normalize(path: string): string {
        // Convert Windows backslashes to forward slashes
        return path.replace(/\\/g, '/')
    }
}
