/**
 * CodyStack Plugin System
 * 
 * This module defines the core interfaces and types for the plugin architecture.
 * Plugins can extend CodyStack with custom agents, commands, views, and workflows.
 */

// ============================================
// PLUGIN CATEGORIES
// ============================================

export type PluginCategory =
    | 'ai-agents'
    | 'integrations'
    | 'formatters'
    | 'test-suites'
    | 'devops'
    | 'themes'
    | 'custom'

export const PLUGIN_CATEGORIES: Record<PluginCategory, { label: string; icon: string; description: string }> = {
    'ai-agents': {
        label: 'AI Agents',
        icon: '🤖',
        description: 'Specialized AI assistants for coding tasks'
    },
    'integrations': {
        label: 'Integrations',
        icon: '🔗',
        description: 'Connect external services and APIs'
    },
    'formatters': {
        label: 'Formatters',
        icon: '✨',
        description: 'Code formatting and styling tools'
    },
    'test-suites': {
        label: 'Test Suites',
        icon: '🧪',
        description: 'Testing frameworks and generators'
    },
    'devops': {
        label: 'DevOps',
        icon: '🚀',
        description: 'Deployment and infrastructure tools'
    },
    'themes': {
        label: 'Themes',
        icon: '🎨',
        description: 'UI customization and color schemes'
    },
    'custom': {
        label: 'Custom',
        icon: '🔧',
        description: 'User-defined plugin category'
    }
}

// ============================================
// PLUGIN AUTHOR & METADATA
// ============================================

export interface PluginAuthor {
    name: string
    email?: string
    url?: string
    avatar?: string
}

export interface PluginMetadata {
    id: string
    name: string
    version: string
    description: string
    category: PluginCategory
    author: PluginAuthor
    repository?: string
    homepage?: string
    license?: string
    keywords?: string[]
    icon?: string

    // Marketplace data
    downloads?: number
    rating?: number
    featured?: boolean
}

// ============================================
// PLUGIN CONTRIBUTIONS
// ============================================

export interface Command {
    id: string
    title: string
    description?: string
    keybinding?: string
    handler: () => void | Promise<void>
}

export interface View {
    id: string
    title: string
    icon?: string
    component: () => JSX.Element
    location: 'sidebar' | 'panel' | 'modal'
}

export interface AgentConfig {
    id: string
    name: string
    specialty: string
    model: string
    systemPrompt?: string
    temperature?: number
    maxTokens?: number
}

export interface WorkflowStep {
    agentId: string
    action: string
    requiresApproval?: boolean
    timeout?: number
}

export interface WorkflowTemplate {
    id: string
    name: string
    description: string
    steps: WorkflowStep[]
}

export interface PluginContributions {
    commands?: Command[]
    views?: View[]
    agents?: AgentConfig[]
    workflows?: WorkflowTemplate[]
    settings?: Record<string, unknown>
}

// ============================================
// PLUGIN INTERFACE
// ============================================

export interface CodyPlugin {
    // Required metadata
    metadata: PluginMetadata

    // Lifecycle hooks
    onActivate(context: PluginContext): Promise<void>
    onDeactivate(): Promise<void>

    // Optional contributions
    contributes?: PluginContributions
}

export interface PluginContext {
    // Plugin state storage
    getState<T>(key: string): T | undefined
    setState<T>(key: string, value: T): void

    // UI interactions
    showNotification(message: string, type?: 'info' | 'success' | 'warning' | 'error'): void
    showModal(component: () => JSX.Element): void

    // Command registration
    registerCommand(command: Command): void
    executeCommand(commandId: string): Promise<void>

    // Agent interactions
    invokeAgent(agentId: string, prompt: string): Promise<string>

    // Logging
    log(message: string, level?: 'debug' | 'info' | 'warn' | 'error'): void
}

// ============================================
// PLUGIN MANIFEST (for npm-style plugins)
// ============================================

export interface PluginManifest {
    name: string
    version: string
    description: string
    main: string
    codystack: {
        category: PluginCategory
        icon?: string
        displayName: string
        activationEvents?: string[]
        contributes?: Partial<PluginContributions>
    }
    author?: string | PluginAuthor
    repository?: string
    license?: string
    keywords?: string[]
    dependencies?: Record<string, string>
    devDependencies?: Record<string, string>
}

// ============================================
// HELPER FUNCTIONS
// ============================================

export function createPlugin(
    metadata: PluginMetadata,
    handlers: {
        onActivate: (context: PluginContext) => Promise<void>
        onDeactivate?: () => Promise<void>
    },
    contributions?: PluginContributions
): CodyPlugin {
    return {
        metadata,
        contributes: contributions,
        onActivate: handlers.onActivate,
        onDeactivate: handlers.onDeactivate ?? (async () => { })
    }
}

export function validatePlugin(plugin: unknown): plugin is CodyPlugin {
    if (!plugin || typeof plugin !== 'object') return false

    const p = plugin as Partial<CodyPlugin>

    return !!(
        p.metadata &&
        typeof p.metadata.id === 'string' &&
        typeof p.metadata.name === 'string' &&
        typeof p.metadata.version === 'string' &&
        typeof p.onActivate === 'function' &&
        typeof p.onDeactivate === 'function'
    )
}
