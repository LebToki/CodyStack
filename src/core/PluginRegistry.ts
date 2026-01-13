/**
 * CodyStack Plugin Registry
 * 
 * Handles plugin discovery, loading, activation, and lifecycle management.
 */

import {
    CodyPlugin,
    PluginContext,
    PluginMetadata,
    Command,
    validatePlugin
} from './PluginSystem'

// ============================================
// PLUGIN STATE
// ============================================

interface PluginState {
    plugin: CodyPlugin
    active: boolean
    context: PluginContext
    storage: Map<string, unknown>
}

// ============================================
// PLUGIN REGISTRY
// ============================================

class PluginRegistry {
    private plugins: Map<string, PluginState> = new Map()
    private commands: Map<string, Command> = new Map()
    private listeners: Set<(plugins: PluginMetadata[]) => void> = new Set()

    /**
     * Register a plugin with the registry
     */
    async register(plugin: CodyPlugin): Promise<void> {
        if (!validatePlugin(plugin)) {
            throw new Error(`Invalid plugin structure: ${JSON.stringify(plugin)}`)
        }

        if (this.plugins.has(plugin.metadata.id)) {
            throw new Error(`Plugin already registered: ${plugin.metadata.id}`)
        }

        const storage = new Map<string, unknown>()
        const context = this.createContext(plugin.metadata.id, storage)

        this.plugins.set(plugin.metadata.id, {
            plugin,
            active: false,
            context,
            storage
        })

        this.notifyListeners()
        console.log(`[PluginRegistry] Registered: ${plugin.metadata.name} v${plugin.metadata.version}`)
    }

    /**
     * Activate a registered plugin
     */
    async activate(pluginId: string): Promise<void> {
        const state = this.plugins.get(pluginId)
        if (!state) {
            throw new Error(`Plugin not found: ${pluginId}`)
        }

        if (state.active) {
            console.warn(`[PluginRegistry] Plugin already active: ${pluginId}`)
            return
        }

        try {
            await state.plugin.onActivate(state.context)

            // Register contributed commands
            if (state.plugin.contributes?.commands) {
                for (const cmd of state.plugin.contributes.commands) {
                    this.commands.set(cmd.id, cmd)
                }
            }

            state.active = true
            this.notifyListeners()
            console.log(`[PluginRegistry] Activated: ${state.plugin.metadata.name}`)
        } catch (error) {
            console.error(`[PluginRegistry] Failed to activate ${pluginId}:`, error)
            throw error
        }
    }

    /**
     * Deactivate an active plugin
     */
    async deactivate(pluginId: string): Promise<void> {
        const state = this.plugins.get(pluginId)
        if (!state) {
            throw new Error(`Plugin not found: ${pluginId}`)
        }

        if (!state.active) {
            console.warn(`[PluginRegistry] Plugin not active: ${pluginId}`)
            return
        }

        try {
            await state.plugin.onDeactivate()

            // Unregister commands
            if (state.plugin.contributes?.commands) {
                for (const cmd of state.plugin.contributes.commands) {
                    this.commands.delete(cmd.id)
                }
            }

            state.active = false
            this.notifyListeners()
            console.log(`[PluginRegistry] Deactivated: ${state.plugin.metadata.name}`)
        } catch (error) {
            console.error(`[PluginRegistry] Failed to deactivate ${pluginId}:`, error)
            throw error
        }
    }

    /**
     * Unregister and remove a plugin
     */
    async unregister(pluginId: string): Promise<void> {
        const state = this.plugins.get(pluginId)
        if (!state) return

        if (state.active) {
            await this.deactivate(pluginId)
        }

        this.plugins.delete(pluginId)
        this.notifyListeners()
        console.log(`[PluginRegistry] Unregistered: ${pluginId}`)
    }

    /**
     * Get all registered plugins
     */
    getPlugins(): PluginMetadata[] {
        return Array.from(this.plugins.values()).map(s => s.plugin.metadata)
    }

    /**
     * Get active plugins only
     */
    getActivePlugins(): PluginMetadata[] {
        return Array.from(this.plugins.values())
            .filter(s => s.active)
            .map(s => s.plugin.metadata)
    }

    /**
     * Check if a plugin is active
     */
    isActive(pluginId: string): boolean {
        return this.plugins.get(pluginId)?.active ?? false
    }

    /**
     * Execute a registered command
     */
    async executeCommand(commandId: string): Promise<void> {
        const command = this.commands.get(commandId)
        if (!command) {
            throw new Error(`Command not found: ${commandId}`)
        }

        await command.handler()
    }

    /**
     * Subscribe to plugin changes
     */
    subscribe(listener: (plugins: PluginMetadata[]) => void): () => void {
        this.listeners.add(listener)
        return () => this.listeners.delete(listener)
    }

    private notifyListeners(): void {
        const plugins = this.getPlugins()
        this.listeners.forEach(l => l(plugins))
    }

    private createContext(pluginId: string, storage: Map<string, unknown>): PluginContext {
        return {
            getState: <T>(key: string): T | undefined => {
                return storage.get(key) as T | undefined
            },

            setState: <T>(key: string, value: T): void => {
                storage.set(key, value)
            },

            showNotification: (message: string, type = 'info'): void => {
                console.log(`[${pluginId}] ${type.toUpperCase()}: ${message}`)
                // TODO: Integrate with UI notification system
            },

            showModal: (_component: () => JSX.Element): void => {
                // TODO: Integrate with UI modal system
            },

            registerCommand: (command: Command): void => {
                this.commands.set(command.id, command)
            },

            executeCommand: async (commandId: string): Promise<void> => {
                await this.executeCommand(commandId)
            },

            invokeAgent: async (_agentId: string, _prompt: string): Promise<string> => {
                // TODO: Integrate with agent orchestration
                return 'Agent response placeholder'
            },

            log: (message: string, level = 'info'): void => {
                const prefix = `[${pluginId}]`
                switch (level) {
                    case 'debug': console.debug(prefix, message); break
                    case 'info': console.info(prefix, message); break
                    case 'warn': console.warn(prefix, message); break
                    case 'error': console.error(prefix, message); break
                }
            }
        }
    }
}

// Singleton instance
export const pluginRegistry = new PluginRegistry()

export default pluginRegistry
