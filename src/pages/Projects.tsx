import { useState } from 'react'
import GlassCard from '../components/GlassCard'
import {
    FolderOpen,
    FolderPlus,
    Clock,
    Trash2,
    ChevronRight,
    HardDrive,
    Settings,
    Star
} from 'lucide-react'

// ============================================
// TYPES
// ============================================

interface RecentProject {
    id: string
    name: string
    path: string
    lastOpened: string
    starred: boolean
    agents: number
    plugins: number
}

// ============================================
// MOCK DATA (would come from localStorage/backend)
// ============================================

const mockRecentProjects: RecentProject[] = [
    {
        id: '1',
        name: 'CodyStack',
        path: 'E:\\platform\\CodyStack',
        lastOpened: new Date().toISOString(),
        starred: true,
        agents: 7,
        plugins: 3
    },
    {
        id: '2',
        name: 'MusicStudio',
        path: 'E:\\platform\\MusicStudio',
        lastOpened: new Date(Date.now() - 86400000).toISOString(),
        starred: false,
        agents: 4,
        plugins: 2
    },
    {
        id: '3',
        name: 'WhatsApp CRM',
        path: 'E:\\platform\\WaveQ',
        lastOpened: new Date(Date.now() - 172800000).toISOString(),
        starred: true,
        agents: 5,
        plugins: 4
    }
]

// ============================================
// COMPONENT
// ============================================

export default function Projects() {
    const [recentProjects, setRecentProjects] = useState<RecentProject[]>(mockRecentProjects)
    const [showNewProjectModal, setShowNewProjectModal] = useState(false)
    const [newProjectName, setNewProjectName] = useState('')
    const [newProjectPath, setNewProjectPath] = useState('')

    const formatDate = (isoString: string) => {
        const date = new Date(isoString)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const days = Math.floor(diff / 86400000)

        if (days === 0) return 'Today'
        if (days === 1) return 'Yesterday'
        if (days < 7) return `${days} days ago`
        return date.toLocaleDateString()
    }

    const handleOpenProject = (project: RecentProject) => {
        // Update last opened
        setRecentProjects(recentProjects.map(p =>
            p.id === project.id
                ? { ...p, lastOpened: new Date().toISOString() }
                : p
        ))
        console.log(`Opening project: ${project.path}`)
        // In real implementation, this would load the project
    }

    const handleDeleteProject = (id: string) => {
        setRecentProjects(recentProjects.filter(p => p.id !== id))
    }

    const handleToggleStar = (id: string) => {
        setRecentProjects(recentProjects.map(p =>
            p.id === id ? { ...p, starred: !p.starred } : p
        ))
    }

    const handleCreateProject = () => {
        if (newProjectName.trim() && newProjectPath.trim()) {
            const newProject: RecentProject = {
                id: Date.now().toString(),
                name: newProjectName,
                path: newProjectPath,
                lastOpened: new Date().toISOString(),
                starred: false,
                agents: 7,
                plugins: 0
            }
            setRecentProjects([newProject, ...recentProjects])
            setShowNewProjectModal(false)
            setNewProjectName('')
            setNewProjectPath('')
        }
    }

    const starredProjects = recentProjects.filter(p => p.starred)
    const otherProjects = recentProjects.filter(p => !p.starred)

    return (
        <div className="stagger-children">
            {/* Header */}
            <header className="page-header">
                <h1 className="page-header__title">
                    <span className="text-gradient">Projects</span>
                </h1>
                <p className="page-header__subtitle">
                    Create, open, and manage your CodyStack projects
                </p>
            </header>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                <GlassCard glow>
                    <button
                        onClick={() => setShowNewProjectModal(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-md)',
                            padding: 'var(--space-lg)',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        <div style={{
                            width: 48,
                            height: 48,
                            background: 'rgba(255, 51, 102, 0.2)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FolderPlus size={24} color="var(--accent-primary)" />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 600, fontSize: '1rem' }}>New Project</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                Initialize a new CodyStack project
                            </div>
                        </div>
                    </button>
                </GlassCard>

                <GlassCard glow>
                    <button
                        onClick={() => console.log('Open folder picker')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-md)',
                            padding: 'var(--space-lg)',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        <div style={{
                            width: 48,
                            height: 48,
                            background: 'rgba(0, 212, 255, 0.2)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FolderOpen size={24} color="var(--accent-secondary)" />
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 600, fontSize: '1rem' }}>Open Folder</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                Open an existing project folder
                            </div>
                        </div>
                    </button>
                </GlassCard>
            </div>

            {/* Starred Projects */}
            {starredProjects.length > 0 && (
                <section style={{ marginBottom: 'var(--space-xl)' }}>
                    <h2 style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        marginBottom: 'var(--space-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        color: 'var(--text-secondary)'
                    }}>
                        <Star size={16} fill="var(--accent-warning)" color="var(--accent-warning)" />
                        Starred Projects
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        {starredProjects.map(project => (
                            <ProjectRow
                                key={project.id}
                                project={project}
                                formatDate={formatDate}
                                onOpen={handleOpenProject}
                                onDelete={handleDeleteProject}
                                onToggleStar={handleToggleStar}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Recent Projects */}
            <section>
                <h2 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    marginBottom: 'var(--space-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-sm)',
                    color: 'var(--text-secondary)'
                }}>
                    <Clock size={16} />
                    Recent Projects
                </h2>

                {otherProjects.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        {otherProjects.map(project => (
                            <ProjectRow
                                key={project.id}
                                project={project}
                                formatDate={formatDate}
                                onOpen={handleOpenProject}
                                onDelete={handleDeleteProject}
                                onToggleStar={handleToggleStar}
                            />
                        ))}
                    </div>
                ) : (
                    <GlassCard>
                        <div style={{
                            padding: 'var(--space-2xl)',
                            textAlign: 'center',
                            color: 'var(--text-muted)'
                        }}>
                            No recent projects yet. Create or open a project to get started.
                        </div>
                    </GlassCard>
                )}
            </section>

            {/* New Project Modal */}
            {showNewProjectModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <GlassCard>
                        <div style={{ padding: 'var(--space-xl)', width: 400 }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--space-lg)' }}>
                                Create New Project
                            </h2>

                            <div style={{ marginBottom: 'var(--space-md)' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: 'var(--space-xs)',
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)'
                                }}>
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    placeholder="My Awesome Project"
                                    style={{
                                        width: '100%',
                                        padding: 'var(--space-sm) var(--space-md)',
                                        background: 'var(--glass-bg)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.9rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: 'var(--space-lg)' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: 'var(--space-xs)',
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)'
                                }}>
                                    Project Path
                                </label>
                                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                    <input
                                        type="text"
                                        value={newProjectPath}
                                        onChange={(e) => setNewProjectPath(e.target.value)}
                                        placeholder="C:\Projects\my-project"
                                        style={{
                                            flex: 1,
                                            padding: 'var(--space-sm) var(--space-md)',
                                            background: 'var(--glass-bg)',
                                            border: '1px solid var(--glass-border)',
                                            borderRadius: 'var(--radius-sm)',
                                            color: 'var(--text-primary)',
                                            fontSize: '0.9rem',
                                            outline: 'none'
                                        }}
                                    />
                                    <button className="btn btn--secondary">
                                        <FolderOpen size={16} />
                                    </button>
                                </div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    marginTop: 'var(--space-xs)'
                                }}>
                                    A .codystack folder will be created in this directory
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
                                <button
                                    className="btn btn--ghost"
                                    onClick={() => setShowNewProjectModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn--primary"
                                    onClick={handleCreateProject}
                                >
                                    <FolderPlus size={16} />
                                    Create Project
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    )
}

// ============================================
// PROJECT ROW COMPONENT
// ============================================

interface ProjectRowProps {
    project: RecentProject
    formatDate: (date: string) => string
    onOpen: (project: RecentProject) => void
    onDelete: (id: string) => void
    onToggleStar: (id: string) => void
}

function ProjectRow({ project, formatDate, onOpen, onDelete, onToggleStar }: ProjectRowProps) {
    return (
        <GlassCard>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-md)',
                    padding: 'var(--space-md) var(--space-lg)',
                    cursor: 'pointer'
                }}
                onClick={() => onOpen(project)}
            >
                <div style={{
                    width: 40,
                    height: 40,
                    background: 'var(--glass-bg)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <HardDrive size={20} color="var(--accent-secondary)" />
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                        {project.name}
                        {project.starred && (
                            <Star size={14} fill="var(--accent-warning)" color="var(--accent-warning)" />
                        )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {project.path}
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <span className="tag">{project.agents} agents</span>
                    <span className="tag">{project.plugins} plugins</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: 80 }}>
                        {formatDate(project.lastOpened)}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                    <button
                        className="btn btn--ghost"
                        onClick={(e) => { e.stopPropagation(); onToggleStar(project.id) }}
                        style={{ padding: 'var(--space-xs)' }}
                    >
                        <Star
                            size={16}
                            fill={project.starred ? 'var(--accent-warning)' : 'transparent'}
                            color={project.starred ? 'var(--accent-warning)' : 'var(--text-muted)'}
                        />
                    </button>
                    <button
                        className="btn btn--ghost"
                        onClick={(e) => { e.stopPropagation(); console.log('Project settings') }}
                        style={{ padding: 'var(--space-xs)' }}
                    >
                        <Settings size={16} />
                    </button>
                    <button
                        className="btn btn--ghost"
                        onClick={(e) => { e.stopPropagation(); onDelete(project.id) }}
                        style={{ padding: 'var(--space-xs)' }}
                    >
                        <Trash2 size={16} />
                    </button>
                    <ChevronRight size={16} color="var(--text-muted)" />
                </div>
            </div>
        </GlassCard>
    )
}
