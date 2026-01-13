import { useState } from 'react'
import PluginCard, { PluginData } from '../components/PluginCard'
import { Search, Filter, TrendingUp, Star } from 'lucide-react'

const featuredPlugins: PluginData[] = [
    {
        id: 'architect-agent',
        name: 'Architect Agent',
        description: 'System design expert that creates architecture diagrams, suggests patterns, and plans project structure.',
        author: 'CodyStack Core',
        icon: '🏗️',
        category: 'AI Agents',
        downloads: 12500,
        rating: 4.9,
        installed: true
    },
    {
        id: 'github-integration',
        name: 'GitHub Integration',
        description: 'Connect your GitHub repos for seamless PR reviews, issue tracking, and code synchronization.',
        author: 'CodyStack Core',
        icon: '🐙',
        category: 'Integrations',
        downloads: 8900,
        rating: 4.7,
        installed: true
    },
    {
        id: 'security-agent',
        name: 'Security Agent',
        description: 'Vulnerability scanner with automatic patching. Ensures PCI/HIPAA compliance patterns.',
        author: 'CodyStack Core',
        icon: '🔒',
        category: 'AI Agents',
        downloads: 7200,
        rating: 4.8,
        installed: false
    },
    {
        id: 'prettier-config',
        name: 'Prettier Pro Config',
        description: 'Opinionated code formatting with custom configurations for React, Vue, and TypeScript.',
        author: 'Community',
        icon: '✨',
        category: 'Formatters',
        downloads: 5400,
        rating: 4.5,
        installed: false
    },
    {
        id: 'jest-generator',
        name: 'Jest Test Generator',
        description: 'Automatically generates Jest unit tests from your functions with edge case detection.',
        author: 'TestLab',
        icon: '🧪',
        category: 'Test Suites',
        downloads: 4100,
        rating: 4.6,
        installed: false
    },
    {
        id: 'docker-devops',
        name: 'Docker DevOps',
        description: 'Generate Dockerfiles, docker-compose configs, and CI/CD pipelines automatically.',
        author: 'DevOps Guild',
        icon: '🐳',
        category: 'DevOps',
        downloads: 6300,
        rating: 4.7,
        installed: false
    },
]

const categories = ['All', 'AI Agents', 'Integrations', 'Formatters', 'Test Suites', 'DevOps']

export default function Marketplace() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeCategory, setActiveCategory] = useState('All')
    const [plugins, setPlugins] = useState(featuredPlugins)

    const filteredPlugins = plugins.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory
        return matchesSearch && matchesCategory
    })

    const handleInstall = (id: string) => {
        setPlugins(plugins.map(p =>
            p.id === id ? { ...p, installed: !p.installed } : p
        ))
    }

    return (
        <div className="stagger-children">
            {/* Header */}
            <header className="page-header">
                <h1 className="page-header__title">
                    Plugin <span className="text-gradient">Marketplace</span>
                </h1>
                <p className="page-header__subtitle">
                    Discover and install plugins to supercharge your development workflow
                </p>
            </header>

            {/* Search & Filter */}
            <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    padding: 'var(--space-sm) var(--space-md)',
                    background: 'var(--glass-bg)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-sm)'
                }}>
                    <Search size={18} color="var(--text-muted)" />
                    <input
                        type="text"
                        placeholder="Search plugins..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem',
                            outline: 'none'
                        }}
                    />
                </div>
                <button className="btn btn--secondary">
                    <Filter size={18} />
                    Filter
                </button>
            </div>

            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`btn ${activeCategory === cat ? 'btn--primary' : 'btn--ghost'}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Featured Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                <TrendingUp size={20} color="var(--accent-primary)" />
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Featured & Trending</h2>
                <span className="tag tag--primary">
                    <Star size={12} /> Top Rated
                </span>
            </div>

            {/* Plugin Grid */}
            <div className="plugin-grid">
                {filteredPlugins.map(plugin => (
                    <PluginCard
                        key={plugin.id}
                        plugin={plugin}
                        onInstall={handleInstall}
                    />
                ))}
            </div>

            {filteredPlugins.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: 'var(--space-2xl)',
                    color: 'var(--text-muted)'
                }}>
                    No plugins found. Try a different search or category.
                </div>
            )}
        </div>
    )
}
