import GlassCard from '../components/GlassCard'
import { Activity, Zap, Package, Users } from 'lucide-react'

const stats = [
    { label: 'Active Agents', value: '7', icon: Activity, color: '#ff3366' },
    { label: 'Installed Plugins', value: '12', icon: Package, color: '#00d4ff' },
    { label: 'Tasks Today', value: '24', icon: Zap, color: '#a855f7' },
    { label: 'Community', value: '1.2k', icon: Users, color: '#22c55e' },
]

const recentActivity = [
    { agent: '🏗️ Architect', action: 'Analyzed project structure', time: '2m ago' },
    { agent: '💻 Coder', action: 'Generated API endpoint', time: '5m ago' },
    { agent: '🔒 Security', action: 'Completed vulnerability scan', time: '12m ago' },
    { agent: '🧪 Tester', action: 'Created 8 unit tests', time: '18m ago' },
]

export default function Dashboard() {
    return (
        <div className="stagger-children">
            {/* Header */}
            <header className="page-header">
                <h1 className="page-header__title">
                    Welcome to <span className="text-gradient">CodyStack</span>
                </h1>
                <p className="page-header__subtitle">
                    Your AI-native development environment is ready
                </p>
            </header>

            {/* Stats Grid */}
            <div className="plugin-grid" style={{ marginBottom: 'var(--space-xl)' }}>
                {stats.map(stat => (
                    <GlassCard key={stat.label}>
                        <div style={{ padding: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                            <div style={{
                                width: 48,
                                height: 48,
                                borderRadius: 'var(--radius-md)',
                                background: `${stat.color}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <stat.icon size={24} color={stat.color} />
                            </div>
                            <div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{stat.value}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{stat.label}</div>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Recent Activity */}
            <GlassCard>
                <div style={{ padding: 'var(--space-lg)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
                        Recent Agent Activity
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        {recentActivity.map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 'var(--space-md)',
                                    background: 'var(--glass-bg)',
                                    borderRadius: 'var(--radius-sm)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                    <span style={{ fontSize: '1.25rem' }}>{item.agent.split(' ')[0]}</span>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{item.agent.split(' ').slice(1).join(' ')}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.action}</div>
                                    </div>
                                </div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </GlassCard>
        </div>
    )
}
