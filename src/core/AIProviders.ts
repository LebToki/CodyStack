/**
 * CodyStack AI Provider System
 * 
 * Unified interface for multiple AI providers.
 * Users can plug their own API keys and use any supported model.
 */

// ============================================
// SUPPORTED PROVIDERS
// ============================================

export type AIProvider =
    | 'openai'
    | 'anthropic'
    | 'google'      // Gemini
    | 'xai'         // Grok
    | 'deepseek'
    | 'ollama'      // Local
    | 'custom'

export const AI_PROVIDERS: Record<AIProvider, ProviderInfo> = {
    openai: {
        id: 'openai',
        name: 'OpenAI',
        icon: '🤖',
        website: 'https://platform.openai.com',
        models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo', 'o1-preview', 'o1-mini'],
        defaultModel: 'gpt-4o',
        apiKeyUrl: 'https://platform.openai.com/api-keys',
        features: ['chat', 'code', 'vision', 'function-calling']
    },
    anthropic: {
        id: 'anthropic',
        name: 'Anthropic',
        icon: '🅰️',
        website: 'https://console.anthropic.com',
        models: ['claude-3.5-sonnet', 'claude-3-opus', 'claude-3-haiku'],
        defaultModel: 'claude-3.5-sonnet',
        apiKeyUrl: 'https://console.anthropic.com/settings/keys',
        features: ['chat', 'code', 'analysis', 'long-context']
    },
    google: {
        id: 'google',
        name: 'Google Gemini',
        icon: '✨',
        website: 'https://ai.google.dev',
        models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
        defaultModel: 'gemini-2.0-flash',
        apiKeyUrl: 'https://aistudio.google.com/apikey',
        features: ['chat', 'code', 'vision', 'multimodal']
    },
    xai: {
        id: 'xai',
        name: 'xAI Grok',
        icon: '🚀',
        website: 'https://x.ai',
        models: ['grok-2', 'grok-2-vision'],
        defaultModel: 'grok-2',
        apiKeyUrl: 'https://console.x.ai',
        features: ['chat', 'code', 'real-time']
    },
    deepseek: {
        id: 'deepseek',
        name: 'DeepSeek',
        icon: '🔍',
        website: 'https://platform.deepseek.com',
        models: ['deepseek-chat', 'deepseek-coder', 'deepseek-reasoner'],
        defaultModel: 'deepseek-coder',
        apiKeyUrl: 'https://platform.deepseek.com/api_keys',
        features: ['chat', 'code', 'reasoning', 'budget-friendly']
    },
    ollama: {
        id: 'ollama',
        name: 'Ollama (Local)',
        icon: '🦙',
        website: 'https://ollama.ai',
        models: ['llama3.2', 'codellama', 'mistral', 'deepseek-coder'],
        defaultModel: 'llama3.2',
        apiKeyUrl: null, // No API key needed
        features: ['local', 'private', 'offline']
    },
    custom: {
        id: 'custom',
        name: 'Custom Provider',
        icon: '⚙️',
        website: null,
        models: [],
        defaultModel: null,
        apiKeyUrl: null,
        features: ['custom-endpoint']
    }
}

export interface ProviderInfo {
    id: AIProvider
    name: string
    icon: string
    website: string | null
    models: string[]
    defaultModel: string | null
    apiKeyUrl: string | null
    features: string[]
}

// ============================================
// PROVIDER CONFIGURATION
// ============================================

export interface ProviderConfig {
    provider: AIProvider
    apiKey?: string
    baseUrl?: string
    organizationId?: string
    enabled: boolean
    models: ModelConfig[]
}

export interface ModelConfig {
    id: string
    displayName: string
    maxTokens: number
    contextWindow: number
    costPer1kInput?: number
    costPer1kOutput?: number
    capabilities: string[]
}

// ============================================
// AI REQUEST/RESPONSE
// ============================================

export interface AIMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
    name?: string
}

export interface AIRequest {
    provider: AIProvider
    model: string
    messages: AIMessage[]
    temperature?: number
    maxTokens?: number
    stream?: boolean
    functions?: AIFunction[]
}

export interface AIFunction {
    name: string
    description: string
    parameters: Record<string, unknown>
}

export interface AIResponse {
    id: string
    provider: AIProvider
    model: string
    content: string
    usage: {
        promptTokens: number
        completionTokens: number
        totalTokens: number
    }
    finishReason: 'stop' | 'length' | 'function_call' | 'error'
    latencyMs: number
}

export interface AIStreamChunk {
    content: string
    done: boolean
}

// ============================================
// MODEL ROUTER
// ============================================

export interface ModelRouterConfig {
    // Task-based routing
    taskRouting: Record<TaskType, RoutingRule>

    // Fallback chain
    fallbackOrder: AIProvider[]

    // Cost optimization
    costOptimization: boolean
    maxCostPerRequest?: number

    // Privacy settings
    privateCodeProviders: AIProvider[] // Only local/private providers
}

export type TaskType =
    | 'architecture'
    | 'coding'
    | 'debugging'
    | 'security'
    | 'testing'
    | 'review'
    | 'devops'
    | 'general'

export interface RoutingRule {
    preferredProvider: AIProvider
    preferredModel: string
    fallback?: {
        provider: AIProvider
        model: string
    }
    reason: string
}

export const DEFAULT_ROUTING: Record<TaskType, RoutingRule> = {
    architecture: {
        preferredProvider: 'anthropic',
        preferredModel: 'claude-3.5-sonnet',
        reason: 'Best for complex reasoning and system design'
    },
    coding: {
        preferredProvider: 'deepseek',
        preferredModel: 'deepseek-coder',
        fallback: { provider: 'openai', model: 'gpt-4o' },
        reason: 'Optimized for code generation, cost-effective'
    },
    debugging: {
        preferredProvider: 'ollama',
        preferredModel: 'deepseek-coder',
        fallback: { provider: 'anthropic', model: 'claude-3.5-sonnet' },
        reason: 'Local for privacy, detailed analysis'
    },
    security: {
        preferredProvider: 'anthropic',
        preferredModel: 'claude-3-opus',
        reason: 'Thorough security analysis'
    },
    testing: {
        preferredProvider: 'openai',
        preferredModel: 'gpt-4o',
        reason: 'Good at edge case generation'
    },
    review: {
        preferredProvider: 'anthropic',
        preferredModel: 'claude-3.5-sonnet',
        reason: 'Detailed code review feedback'
    },
    devops: {
        preferredProvider: 'google',
        preferredModel: 'gemini-2.0-flash',
        reason: 'Fast infrastructure code generation'
    },
    general: {
        preferredProvider: 'openai',
        preferredModel: 'gpt-4o',
        reason: 'General purpose assistance'
    }
}

// ============================================
// AI CLIENT INTERFACE
// ============================================

export interface AIClient {
    // Configuration
    configure(config: ProviderConfig): void
    getConfig(provider: AIProvider): ProviderConfig | undefined
    listConfiguredProviders(): AIProvider[]

    // Chat completion
    chat(request: AIRequest): Promise<AIResponse>
    chatStream(request: AIRequest): AsyncGenerator<AIStreamChunk>

    // Model routing
    routeTask(task: TaskType, context?: string): Promise<{ provider: AIProvider; model: string }>

    // Health check
    testConnection(provider: AIProvider): Promise<boolean>
}

// ============================================
// PROVIDER ADAPTER BASE
// ============================================

export abstract class ProviderAdapter {
    protected config: ProviderConfig

    constructor(config: ProviderConfig) {
        this.config = config
    }

    abstract chat(messages: AIMessage[], options?: Partial<AIRequest>): Promise<AIResponse>
    abstract chatStream(messages: AIMessage[], options?: Partial<AIRequest>): AsyncGenerator<AIStreamChunk>
    abstract testConnection(): Promise<boolean>

    protected getHeaders(): Record<string, string> {
        return {
            'Content-Type': 'application/json'
        }
    }
}

// ============================================
// API KEY STORAGE (Secure)
// ============================================

export interface SecureKeyStorage {
    setKey(provider: AIProvider, key: string): Promise<void>
    getKey(provider: AIProvider): Promise<string | null>
    deleteKey(provider: AIProvider): Promise<void>
    hasKey(provider: AIProvider): Promise<boolean>
    listProviders(): Promise<AIProvider[]>
}

// Keys stored in .codystack/config.json (encrypted in production)
export const STORAGE_KEY = 'codystack_api_keys'
