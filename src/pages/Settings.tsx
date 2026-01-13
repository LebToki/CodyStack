import { useState } from 'react'
import { Icon } from '@iconify/react'
import GlassCard from '../components/GlassCard'
import { AI_PROVIDERS, AIProvider } from '../core/AIProviders'
import { Key, Eye, EyeOff, Check, ExternalLink, Github } from 'lucide-react'

// Iconify icons for AI providers
const PROVIDER_ICONS: Record<AIProvider, string> = {
    openai: 'simple-icons:openai',
    anthropic: 'simple-icons:anthropic',
    google: 'logos:google-gemini',
    xai: 'simple-icons:x',
    deepseek: 'arcticons:deepseek',
    ollama: 'simple-icons:ollama',
    custom: 'mdi:cog'
}

interface ProviderKey {
    provider: AIProvider
    configured: boolean
    lastTested?: string
}

const initialKeys: ProviderKey[] = [
    { provider: 'openai', configured: false },
    { provider: 'anthropic', configured: false },
    { provider: 'google', configured: false },
    { provider: 'xai', configured: false },
    { provider: 'deepseek', configured: false },
    { provider: 'ollama', configured: true }, // Local, no key needed
]

export default function Settings() {
    const [keys, setKeys] = useState(initialKeys)
    const [editingProvider, setEditingProvider] = useState<AIProvider | null>(null)
    const [apiKeyInput, setApiKeyInput] = useState('')
    const [showKey, setShowKey] = useState(false)
    const [githubToken, setGithubToken] = useState('')
    const [githubConnected, setGithubConnected] = useState(false)

    const handleSaveKey = (provider: AIProvider) => {
        if (apiKeyInput.trim()) {
            setKeys(keys.map(k =>
                k.provider === provider
                    ? { ...k, configured: true, lastTested: new Date().toISOString() }
                    : k
            ))
            setApiKeyInput('')
            setEditingProvider(null)
        }
    }

    const handleConnectGitHub = () => {
        if (githubToken.trim()) {
            setGithubConnected(true)
        }
    }

    return (
        <div className="stagger-children">
            {/* Header */}
            <header className="page-header">
                <h1 className="page-header__title">
                    <span className="text-gradient">Settings</span>
                </h1>
                <p className="page-header__subtitle">
                    Configure your AI providers and integrations
                </p>
            </header>

            {/* AI Providers Section */}
            <section style={{ marginBottom: 'var(--space-xl)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <Key size={20} />
                    AI Providers
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                    Connect your AI provider API keys to enable intelligent agents
                </p>

                <div className="plugin-grid">
                    {keys.map(({ provider, configured }) => {
                        const info = AI_PROVIDERS[provider]
                        const isEditing = editingProvider === provider

                        return (
                            <GlassCard key={provider} glow>
                                <div style={{ padding: 'var(--space-lg)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: 'var(--glass-bg)',
                                            borderRadius: 'var(--radius-sm)'
                                        }}>
                                            <Icon icon={PROVIDER_ICONS[provider]} width={24} height={24} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600 }}>{info.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {info.features.slice(0, 3).join(' • ')}
                                            </div>
                                        </div>
                                        {configured && (
                                            <span className="tag tag--success">
                                                <Check size={12} /> Connected
                                            </span>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <div style={{ marginTop: 'var(--space-md)' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                background: 'var(--glass-bg)',
                                                border: '1px solid var(--glass-border)',
                                                borderRadius: 'var(--radius-sm)',
                                                padding: 'var(--space-sm)'
                                            }}>
                                                <input
                                                    type={showKey ? 'text' : 'password'}
                                                    placeholder="Enter API key..."
                                                    value={apiKeyInput}
                                                    onChange={(e) => setApiKeyInput(e.target.value)}
                                                    style={{
                                                        flex: 1,
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: 'var(--text-primary)',
                                                        fontSize: '0.875rem',
                                                        outline: 'none'
                                                    }}
                                                />
                                                <button
                                                    className="btn btn--ghost"
                                                    onClick={() => setShowKey(!showKey)}
                                                    style={{ padding: 'var(--space-xs)' }}
                                                >
                                                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }}>
                                                <button
                                                    className="btn btn--primary"
                                                    style={{ flex: 1 }}
                                                    onClick={() => handleSaveKey(provider)}
                                                >
                                                    Save Key
                                                </button>
                                                <button
                                                    className="btn btn--ghost"
                                                    onClick={() => setEditingProvider(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                                            {provider !== 'ollama' && (
                                                <button
                                                    className="btn btn--secondary"
                                                    style={{ flex: 1 }}
                                                    onClick={() => setEditingProvider(provider)}
                                                >
                                                    {configured ? 'Update Key' : 'Add Key'}
                                                </button>
                                            )}
                                            {info.apiKeyUrl && (
                                                <a
                                                    href={info.apiKeyUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn--ghost"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </GlassCard>
                        )
                    })}
                </div>
            </section>

            {/* GitHub Integration */}
            <section>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <Github size={20} />
                    GitHub Integration
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
                    Connect your GitHub account to publish and share plugins
                </p>

                <GlassCard>
                    <div style={{ padding: 'var(--space-lg)' }}>
                        {githubConnected ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                <span className="tag tag--success">
                                    <Check size={12} /> Connected to GitHub
                                </span>
                                <button className="btn btn--ghost">Disconnect</button>
                            </div>
                        ) : (
                            <div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    background: 'var(--glass-bg)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: 'var(--space-sm)',
                                    marginBottom: 'var(--space-md)'
                                }}>
                                    <input
                                        type="password"
                                        placeholder="Enter GitHub Personal Access Token..."
                                        value={githubToken}
                                        onChange={(e) => setGithubToken(e.target.value)}
                                        style={{
                                            flex: 1,
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                    <button
                                        className="btn btn--primary"
                                        onClick={handleConnectGitHub}
                                    >
                                        <Github size={16} />
                                        Connect GitHub
                                    </button>
                                    <a
                                        href="https://github.com/settings/tokens/new?scopes=repo,read:user"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn--ghost"
                                    >
                                        Get Token <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </GlassCard>
            </section>
        </div>
    )
}
