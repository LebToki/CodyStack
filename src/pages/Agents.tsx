import GlassCard from '../components/GlassCard'
import { Play, Pause, Settings } from 'lucide-react'
import { useState } from 'react'

interface Agent {
    id: string
    name: string
    emoji: string
    specialty: string
    model: string
    status: 'active' | 'idle' | 'processing'
    colorClass: string
}

const agents: Agent[] = [
    { id: 'architect', name: 'Architect', emoji: '🏗️', specialty: 'System design, pattern selection', model: 'Claude-3.5', status: 'active', colorClass: 'architect' },
    { id: 'coder', name: 'Coder', emoji: '💻', specialty: 'Implementation, syntax perfection', model: 'GPT-5', status: 'processing', colorClass: 'coder' },
    { id: 'debugger', name: 'Debugger', emoji: '🐛', specialty: 'Bug detection, root cause analysis', model: 'Local LLM', status: 'idle', colorClass: 'debugger' },
    { id: 'security', name: 'Security', emoji: '🔒', specialty: 'Vulnerability scanning, compliance', model: 'SecureAI', status: 'active', colorClass: 'security' },
    { id: 'tester', name: 'Tester', emoji: '🧪', specialty: 'Test generation, edge cases', model: 'TestGen-2', status: 'idle', colorClass: 'tester' },
    { id: 'reviewer', name: 'Reviewer', emoji: '👀', specialty: 'Code quality, best practices', model: 'MoE', status: 'idle', colorClass: 'reviewer' },
    { id: 'devops', name: 'DevOps', emoji: '🚀', specialty: 'Deployment, infrastructure', model: 'InfraCode', status: 'active', colorClass: 'devops' },
]

export default function Agents() {
    const [agentStates, setAgentStates] = useState(agents)

    const toggleAgent = (id: string) => {
        setAgentStates(agentStates.map(a =>
            a.id === id
                ? { ...a, status: a.status === 'active' ? 'idle' : 'active' as const }
                : a
        ))
    }

    return (
        <div className="stagger-children">
            {/* Header */}
            <header className="page-header">
                <h1 className="page-header__title">
                    AI <span className="text-gradient">Agents</span>
                </h1>
                <p className="page-header__subtitle">
                    Your expert development team - 7 specialized agents at your service
                </p>
            </header>

            {/* Stats */}
            <div style={{
                display: 'flex',
                gap: 'var(--space-lg)',
                marginBottom: 'var(--space-xl)',
                flexWrap: 'wrap'
            }}>
                <span className="tag tag--success">
                    ● {agentStates.filter(a => a.status === 'active').length} Active
                </span>
                <span className="tag">
                    ○ {agentStates.filter(a => a.status === 'idle').length} Idle
                </span>
                <span className="tag tag--secondary">
                    ◐ {agentStates.filter(a => a.status === 'processing').length} Processing
                </span>
            </div>

            {/* Agent Grid */}
            <div className="plugin-grid">
                {agentStates.map(agent => (
                    <GlassCard key={agent.id} glow>
                        <div className="agent-panel">
                            <div className="agent-item" style={{ border: 'none', background: 'transparent' }}>
                                <div className={`agent-item__avatar agent-item__avatar--${agent.colorClass}`}>
                                    {agent.emoji}
                                </div>
                                <div className="agent-item__info">
                                    <div className="agent-item__name">{agent.name} Agent</div>
                                    <div className="agent-item__status">{agent.specialty}</div>
                                </div>
                                <div className={`agent-item__indicator ${agent.status === 'idle' ? 'agent-item__indicator--idle' : ''}`}
                                    style={agent.status === 'processing' ? {
                                        background: 'var(--accent-secondary)',
                                        boxShadow: '0 0 8px var(--accent-secondary)',
                                        animation: 'pulse 1s ease infinite'
                                    } : undefined}
                                />
                            </div>

                            <div style={{
                                padding: 'var(--space-md)',
                                background: 'var(--glass-bg)',
                                borderRadius: 'var(--radius-sm)',
                                marginTop: 'var(--space-md)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: 'var(--space-sm)',
                                    fontSize: '0.8rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    <span>Model</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{agent.model}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '0.8rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    <span>Status</span>
                                    <span style={{
                                        color: agent.status === 'active' ? 'var(--accent-success)'
                                            : agent.status === 'processing' ? 'var(--accent-secondary)'
                                                : 'var(--text-muted)'
                                    }}>
                                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: 'var(--space-sm)',
                                marginTop: 'var(--space-md)'
                            }}>
                                <button
                                    className={`btn ${agent.status === 'active' ? 'btn--primary' : 'btn--secondary'}`}
                                    style={{ flex: 1 }}
                                    onClick={() => toggleAgent(agent.id)}
                                >
                                    {agent.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                                    {agent.status === 'active' ? 'Pause' : 'Activate'}
                                </button>
                                <button className="btn btn--ghost">
                                    <Settings size={16} />
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    )
}
