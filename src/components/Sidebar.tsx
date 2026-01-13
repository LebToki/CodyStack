import {
    LayoutDashboard,
    Store,
    Bot,
    GitBranch,
    Settings,
    Code2,
    Puzzle,
    FolderKanban
} from 'lucide-react'

interface SidebarProps {
    currentPage: string
    onNavigate: (page: 'dashboard' | 'marketplace' | 'agents' | 'workflows' | 'settings' | 'projects' | 'ide') => void
}

const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'ide', label: 'Code Editor', icon: Code2 },
    { id: 'agents', label: 'AI Agents', icon: Bot },
    { id: 'marketplace', label: 'Marketplace', icon: Store },
    { id: 'workflows', label: 'Workflows', icon: GitBranch },
]

const categories = [
    { id: 'ai-agents', label: 'AI Agents', icon: Bot, count: 7 },
    { id: 'integrations', label: 'Integrations', icon: Puzzle, count: 12 },
    { id: 'formatters', label: 'Formatters', icon: Code2, count: 5 },
]

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar__logo">
                <div className="sidebar__logo-icon">
                    <Code2 size={24} color="white" />
                </div>
                <span className="sidebar__logo-text">CodyStack</span>
            </div>

            {/* Main Navigation */}
            <nav className="sidebar__nav">
                <div className="sidebar__section">
                    <div className="sidebar__section-title">Navigation</div>
                    {navigation.map(item => (
                        <a
                            key={item.id}
                            href="#"
                            className={`sidebar__link ${currentPage === item.id ? 'sidebar__link--active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault()
                                onNavigate(item.id as 'dashboard' | 'marketplace' | 'agents' | 'workflows')
                            }}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </a>
                    ))}
                </div>

                <div className="sidebar__section">
                    <div className="sidebar__section-title">Plugin Categories</div>
                    {categories.map(cat => (
                        <a key={cat.id} href="#" className="sidebar__link">
                            <cat.icon size={18} />
                            {cat.label}
                            <span className="tag" style={{ marginLeft: 'auto' }}>{cat.count}</span>
                        </a>
                    ))}
                </div>
            </nav>

            {/* Footer */}
            <div style={{ marginTop: 'auto', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--glass-border)' }}>
                <a
                    href="#"
                    className={`sidebar__link ${currentPage === 'settings' ? 'sidebar__link--active' : ''}`}
                    onClick={(e) => {
                        e.preventDefault()
                        onNavigate('settings')
                    }}
                >
                    <Settings size={18} />
                    Settings
                </a>

                {/* Branding - DO NOT REMOVE */}
                <div style={{
                    marginTop: 'var(--space-lg)',
                    padding: 'var(--space-md)',
                    textAlign: 'center',
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.6
                }}>
                    <div style={{ marginBottom: '4px' }}>
                        Made with ❤️ by
                    </div>
                    <a
                        href="https://github.com/LebToki"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: 'var(--accent-primary)',
                            textDecoration: 'none',
                            fontWeight: 600
                        }}
                    >
                        Tarek Tarabichi
                    </a>
                    <div style={{ marginTop: '2px' }}>
                        <a
                            href="https://2tinteractive.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: 'var(--text-secondary)',
                                textDecoration: 'none'
                            }}
                        >
                            2TInteractive
                        </a>
                    </div>
                    <div style={{
                        marginTop: '8px',
                        fontSize: '0.6rem',
                        opacity: 0.7
                    }}>
                        © 2026 All Rights Reserved
                    </div>
                </div>
            </div>
        </aside>
    )
}
