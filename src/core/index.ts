/**
 * CodyStack Core - Public API
 */

// Plugin System
export * from './PluginSystem'
export { pluginRegistry } from './PluginRegistry'

// Project System
export * from './ProjectSystem'

// Remote Registry
export * from './PluginRemoteRegistry'
export { pluginRegistryClient } from './PluginRemoteRegistry'

// Re-export commonly used types
export type {
    CodyPlugin,
    PluginContext,
    PluginMetadata,
    PluginCategory,
    PluginContributions,
    Command,
    View,
    AgentConfig,
    WorkflowTemplate
} from './PluginSystem'

export type {
    CodyStackProject,
    FileNode,
    FileBrowser,
    ProjectManager
} from './ProjectSystem'

export type {
    RemotePlugin,
    PluginUpdateInfo,
    PluginRegistryAPI
} from './PluginRemoteRegistry'
