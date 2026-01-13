import { useState, useRef, useEffect } from 'react'
import { Terminal as TerminalIcon, X, Plus, Play, Square, Trash2 } from 'lucide-react'

// ============================================
// TYPES
// ============================================

interface TerminalSession {
    id: string
    name: string
    output: string[]
    isRunning: boolean
    command?: string
}

interface TerminalProps {
    projectPath: string
    onClose?: () => void
}

// ============================================
// TERMINAL COMPONENT
// ============================================

export default function TerminalPanel({ projectPath, onClose }: TerminalProps) {
    const [sessions, setSessions] = useState<TerminalSession[]>([
        { id: '1', name: 'Terminal 1', output: [], isRunning: false }
    ])
    const [activeSession, setActiveSession] = useState('1')
    const [inputValue, setInputValue] = useState('')
    const outputRef = useRef<HTMLDivElement>(null)

    const currentSession = sessions.find(s => s.id === activeSession)

    useEffect(() => {
        // Scroll to bottom on new output
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight
        }
    }, [currentSession?.output])

    const addOutput = (sessionId: string, line: string) => {
        setSessions(sessions.map(s =>
            s.id === sessionId
                ? { ...s, output: [...s.output, line] }
                : s
        ))
    }

    const handleCommand = (command: string) => {
        if (!currentSession) return

        // Add command to output
        addOutput(activeSession, `$ ${command}`)

        // Simulate command execution
        const lowerCmd = command.toLowerCase().trim()

        if (lowerCmd === 'clear' || lowerCmd === 'cls') {
            setSessions(sessions.map(s =>
                s.id === activeSession ? { ...s, output: [] } : s
            ))
            return
        }

        if (lowerCmd === 'help') {
            addOutput(activeSession, 'Available commands:')
            addOutput(activeSession, '  npm run dev    - Start development server')
            addOutput(activeSession, '  npm install    - Install dependencies')
            addOutput(activeSession, '  npm run build  - Build for production')
            addOutput(activeSession, '  clear          - Clear terminal')
            addOutput(activeSession, '  help           - Show this help')
            return
        }

        if (lowerCmd.startsWith('npm run dev')) {
            setSessions(sessions.map(s =>
                s.id === activeSession
                    ? { ...s, isRunning: true, command: 'npm run dev' }
                    : s
            ))
            setTimeout(() => addOutput(activeSession, ''), 100)
            setTimeout(() => addOutput(activeSession, '  VITE v6.4.1  ready in 732 ms'), 200)
            setTimeout(() => addOutput(activeSession, ''), 300)
            setTimeout(() => addOutput(activeSession, '  ➜  Local:   http://localhost:5173/'), 400)
            setTimeout(() => addOutput(activeSession, '  ➜  Network: use --host to expose'), 500)
            setTimeout(() => addOutput(activeSession, '  ➜  press h + enter to show help'), 600)
            return
        }

        if (lowerCmd.startsWith('npm install')) {
            addOutput(activeSession, '')
            setTimeout(() => addOutput(activeSession, 'added 155 packages in 2m'), 1500)
            setTimeout(() => addOutput(activeSession, ''), 1600)
            setTimeout(() => addOutput(activeSession, '32 packages are looking for funding'), 1700)
            setTimeout(() => addOutput(activeSession, '  run `npm fund` for details'), 1800)
            setTimeout(() => addOutput(activeSession, ''), 1900)
            setTimeout(() => addOutput(activeSession, 'found 0 vulnerabilities'), 2000)
            return
        }

        // Unknown command
        setTimeout(() => {
            addOutput(activeSession, `Command not found: ${command.split(' ')[0]}`)
            addOutput(activeSession, 'Type "help" for available commands')
        }, 100)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            handleCommand(inputValue)
            setInputValue('')
        }
    }

    const addSession = () => {
        const newId = (sessions.length + 1).toString()
        setSessions([...sessions, {
            id: newId,
            name: `Terminal ${newId}`,
            output: [],
            isRunning: false
        }])
        setActiveSession(newId)
    }

    const closeSession = (id: string) => {
        if (sessions.length === 1) return
        const newSessions = sessions.filter(s => s.id !== id)
        setSessions(newSessions)
        if (activeSession === id) {
            setActiveSession(newSessions[0].id)
        }
    }

    const stopProcess = () => {
        if (!currentSession?.isRunning) return
        addOutput(activeSession, '^C')
        setSessions(sessions.map(s =>
            s.id === activeSession
                ? { ...s, isRunning: false, command: undefined }
                : s
        ))
    }

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: '#0d0d0d',
            borderTop: '1px solid var(--glass-border)'
        }}>
            {/* Tab Bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--glass-bg)',
                borderBottom: '1px solid var(--glass-border)'
            }}>
                <div style={{ display: 'flex', flex: 1, overflow: 'auto' }}>
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            onClick={() => setActiveSession(session.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                borderRight: '1px solid var(--glass-border)',
                                background: activeSession === session.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                                fontSize: '0.8rem'
                            }}
                        >
                            <TerminalIcon size={14} color={session.isRunning ? 'var(--accent-success)' : 'var(--text-muted)'} />
                            <span>{session.name}</span>
                            {session.isRunning && (
                                <span style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: 'var(--accent-success)'
                                }} />
                            )}
                            {sessions.length > 1 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); closeSession(session.id) }}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex'
                                    }}
                                >
                                    <X size={12} color="var(--text-muted)" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '4px', padding: '4px 8px' }}>
                    <button
                        onClick={addSession}
                        className="btn btn--ghost"
                        style={{ padding: '4px' }}
                        title="New terminal"
                    >
                        <Plus size={14} />
                    </button>
                    {currentSession?.isRunning && (
                        <button
                            onClick={stopProcess}
                            className="btn btn--ghost"
                            style={{ padding: '4px' }}
                            title="Stop process"
                        >
                            <Square size={14} color="var(--accent-error)" />
                        </button>
                    )}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="btn btn--ghost"
                            style={{ padding: '4px' }}
                            title="Close terminal"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Output Area */}
            <div
                ref={outputRef}
                style={{
                    flex: 1,
                    padding: '12px',
                    overflow: 'auto',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    lineHeight: 1.5,
                    color: '#e0e0e0'
                }}
            >
                <div style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>
                    CodyStack Terminal — {projectPath}
                </div>
                {currentSession?.output.map((line, i) => (
                    <div key={i} style={{
                        color: line.startsWith('$') ? 'var(--accent-secondary)' :
                            line.startsWith('➜') ? 'var(--accent-success)' :
                                line.includes('error') ? 'var(--accent-error)' :
                                    '#e0e0e0'
                    }}>
                        {line || '\u00A0'}
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                borderTop: '1px solid var(--glass-border)',
                background: 'rgba(0,0,0,0.3)'
            }}>
                <span style={{
                    color: 'var(--accent-primary)',
                    marginRight: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem'
                }}>
                    $
                </span>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={currentSession?.isRunning ? 'Process running... (Ctrl+C to stop)' : 'Enter command...'}
                    disabled={currentSession?.isRunning}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: '#e0e0e0',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem'
                    }}
                />
            </div>
        </div>
    )
}

// ============================================
// DEV SERVER PRESETS
// ============================================

export const DEV_SERVER_COMMANDS = {
    vite: 'npm run dev',
    nextjs: 'npm run dev',
    react: 'npm start',
    vue: 'npm run serve',
    angular: 'ng serve',
    laravel: 'php artisan serve',
    django: 'python manage.py runserver',
    flask: 'flask run',
    express: 'node server.js',
    fastapi: 'uvicorn main:app --reload'
} as const

export type DevServerType = keyof typeof DEV_SERVER_COMMANDS
